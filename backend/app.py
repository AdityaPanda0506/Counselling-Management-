import os
import hashlib
from datetime import datetime, timedelta
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client.counselling_db

# students collection: one document per regno
# Document shape:
# {
#   regno: "42",
#   block: "Block A",
#   student_hash: sha256(regno),
#   student_entries:   [ { mood, stress, pulse_bpm, sleep_hours, social_life, ts } ],
#   parent_42:         [ { mood_obs, stress_obs, sleep_obs, ts } ],
#   friend_42:         [ { mood_obs, stress_obs, social_obs, ts } ],
# }

def hash_regno(regno):
    return hashlib.sha256(str(regno).strip().lower().encode()).hexdigest()

def safe_avg(entries, key):
    vals = [e[key] for e in entries if e.get(key) is not None]
    return round(sum(vals) / len(vals), 2) if vals else None

def recent(entries, days=7):
    cutoff = datetime.utcnow() - timedelta(days=days)
    return [e for e in entries if datetime.fromisoformat(e['ts']) >= cutoff]


# ─────────────────────────────────────────────
#  POST /api/wellbeing  — upsert single student doc
# ─────────────────────────────────────────────

@app.route('/api/wellbeing', methods=['POST'])
def log_wellbeing():
    data         = request.json
    regno        = str(data.get('regno') or data.get('student_id', '')).strip().lower()
    block        = data.get('block', '')
    submitted_by = data.get('submitted_by', 'student')   # student | parent | friend

    if not regno:
        return jsonify({"error": "regno is required"}), 400

    ts = datetime.utcnow().isoformat()

    if submitted_by == 'student':
        entry = {
            "mood":   data.get('mood_score'),
            "stress": data.get('stress_score'),
            "pulse":  data.get('pulse_bpm'),
            "sleep":  data.get('sleep_hours'),
            "social": data.get('social_life'),
            "ts":     ts
        }
        entry = {k: v for k, v in entry.items() if v is not None or k == 'ts'}

        db.students.update_one(
            {"regno": regno},
            {
                "$set":  {"block": block, "student_hash": hash_regno(regno)},
                "$push": {"student_entries": entry}
            },
            upsert=True
        )

    elif submitted_by == 'parent':
        entry = {
            "mood_obs":   data.get('parent_mood_obs'),
            "stress_obs": data.get('parent_stress_obs'),
            "sleep_obs":  data.get('parent_sleep_obs'),
            "ts":         ts
        }
        entry = {k: v for k, v in entry.items() if v is not None or k == 'ts'}

        db.students.update_one(
            {"regno": regno},
            {"$push": {f"parent_{regno}": entry}},
            upsert=True
        )

    elif submitted_by == 'friend':
        entry = {
            "mood_obs":   data.get('friend_mood_obs'),
            "stress_obs": data.get('friend_stress_obs'),
            "social_obs": data.get('friend_social_obs'),
            "ts":         ts
        }
        entry = {k: v for k, v in entry.items() if v is not None or k == 'ts'}

        db.students.update_one(
            {"regno": regno},
            {"$push": {f"friend_{regno}": entry}},
            upsert=True
        )

    else:
        return jsonify({"error": "Invalid submitted_by"}), 400

    return jsonify({"message": f"Data saved for regno {regno}."}), 201


# ─────────────────────────────────────────────
#  GET /api/wellbeing/summary/<regno>
# ─────────────────────────────────────────────

@app.route('/api/wellbeing/summary/<regno>', methods=['GET'])
def get_wellbeing_summary(regno):
    regno = str(regno).strip().lower()
    try:
        doc = db.students.find_one({"regno": regno})
        if not doc:
            return jsonify({"has_data": False}), 200

        s_entries = recent(doc.get("student_entries", []))
        p_entries = recent(doc.get(f"parent_{regno}", []))
        f_entries = recent(doc.get(f"friend_{regno}", []))

        avg_stress  = safe_avg(s_entries, 'stress')
        avg_mood    = safe_avg(s_entries, 'mood')
        is_alarming = (avg_mood is not None and avg_mood <= 2.5) or \
                      (avg_stress is not None and avg_stress >= 4.0)

        return jsonify({
            "has_data": True,
            "is_alarming": is_alarming,

            "student": {
                "count":      len(s_entries),
                "avg_mood":   avg_mood,
                "avg_stress": avg_stress,
                "avg_pulse":  safe_avg(s_entries, 'pulse'),
                "avg_sleep":  safe_avg(s_entries, 'sleep'),
                "avg_social": safe_avg(s_entries, 'social'),
            },
            "parent": {
                "count":          len(p_entries),
                "avg_mood_obs":   safe_avg(p_entries, 'mood_obs'),
                "avg_stress_obs": safe_avg(p_entries, 'stress_obs'),
                "avg_sleep_obs":  safe_avg(p_entries, 'sleep_obs'),
            },
            "friend": {
                "count":          len(f_entries),
                "avg_mood_obs":   safe_avg(f_entries, 'mood_obs'),
                "avg_stress_obs": safe_avg(f_entries, 'stress_obs'),
                "avg_social_obs": safe_avg(f_entries, 'social_obs'),
            }
        }), 200
    except Exception as e:
        print(f"Error in summary for {regno}: {e}")
        return jsonify({"error": str(e)}), 500


# ─────────────────────────────────────────────
#  ANALYTICS — block level
# ─────────────────────────────────────────────

@app.route('/api/analytics/blocks', methods=['GET'])
def block_analytics():
    docs = list(db.students.find({}))
    blocks = {}

    for doc in docs:
        blk = doc.get('block', 'Unknown')
        entries = recent(doc.get('student_entries', []))
        if not entries:
            continue
        if blk not in blocks:
            blocks[blk] = {'moods': [], 'stresses': [], 'count': 0}
        for e in entries:
            if e.get('mood')   is not None: blocks[blk]['moods'].append(e['mood'])
            if e.get('stress') is not None: blocks[blk]['stresses'].append(e['stress'])
        blocks[blk]['count'] += len(entries)

    result = []
    for blk, data in blocks.items():
        result.append({
            "block":      blk,
            "avg_mood":   round(sum(data['moods'])/len(data['moods']), 2) if data['moods'] else 0,
            "avg_stress": round(sum(data['stresses'])/len(data['stresses']), 2) if data['stresses'] else 0,
            "total_logs": data['count']
        })
    return jsonify(result), 200


@app.route('/api/analytics/students/<block>', methods=['GET'])
def student_details_by_block(block):
    docs = list(db.students.find({"block": block}))
    result = []

    for doc in docs:
        regno    = doc.get('regno')
        entries  = recent(doc.get('student_entries', []))
        if not entries:
            continue

        avg_mood   = safe_avg(entries, 'mood')
        avg_stress = safe_avg(entries, 'stress')
        result.append({
            "regno":      regno,
            "short_id":   doc.get('student_hash', '')[:10],
            "avg_mood":   avg_mood,
            "avg_stress": avg_stress,
            "avg_pulse":  safe_avg(entries, 'pulse'),
            "avg_sleep":  safe_avg(entries, 'sleep'),
            "avg_social": safe_avg(entries, 'social'),
            "logs_count": len(entries),
            "is_alarming": (avg_mood is not None and avg_mood <= 2.5) or
                           (avg_stress is not None and avg_stress >= 4.0)
        })

    result.sort(key=lambda x: (x.get('avg_stress') or 0), reverse=True)
    return jsonify(result), 200


# ─────────────────────────────────────────────
#  COUNSELLING
# ─────────────────────────────────────────────

@app.route('/api/counselling/book', methods=['POST'])
def book_counselling():
    data   = request.json
    regno  = str(data.get('student_id') or data.get('regno')).strip().lower()
    date   = data.get('date')
    is_sos = data.get('is_sos', False)
    db.appointments.insert_one({
        "regno":      regno,
        "date":       date,
        "is_sos":     is_sos,
        "status":     "pending",
        "created_at": datetime.utcnow()
    })
    return jsonify({"message": "Appointment booked"}), 201


@app.route('/api/counselling/appointments', methods=['GET'])
def get_appointments():
    appointments = list(db.appointments.find({}, {"_id": 0}))
    return jsonify(appointments), 200


# ─────────────────────────────────────────────
#  ML PLACEHOLDER
# ─────────────────────────────────────────────

@app.route('/api/ml/predict', methods=['GET'])
def predict_stress():
    dummy = [
        {"regno": "3223a", "student_hash": hash_regno("3223a"), "risk_level": "High",   "reason": "Consistent drop in mood over 3 weeks"},
        {"regno": "student_1", "student_hash": hash_regno("student_1"), "risk_level": "Medium",  "reason": "Spike in stress on weekends"},
    ]
    return jsonify(dummy), 200


if __name__ == '__main__':
    app.run(port=5000, debug=True, use_reloader=False)
