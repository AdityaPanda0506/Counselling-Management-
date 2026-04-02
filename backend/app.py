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

# Helper to hash student ID
def hash_student_id(student_id):
    return hashlib.sha256(student_id.encode()).hexdigest()

@app.route('/api/pulse', methods=['POST'])
def log_pulse():
    data = request.json
    student_id = data.get('student_id')
    # Can also be actual pulse rate, but keeping it consistent with the scoring logic for averages
    mood_score = data.get('mood_score') 
    stress_score = data.get('stress_score') 
    block = data.get('block') 
    
    if not all([student_id, mood_score, stress_score, block]):
        return jsonify({"error": "Missing data"}), 400
        
    student_hash = hash_student_id(student_id)
    
    pulse_log = {
        "student_hash": student_hash,
        "mood_score": int(mood_score),
        "stress_score": int(stress_score),
        "block": block,
        "timestamp": datetime.utcnow()
    }
    
    db.pulses.insert_one(pulse_log)
    return jsonify({"message": "Pulse logged successfully anonymously."}), 201

@app.route('/api/pulse/average/<student_id>', methods=['GET'])
def get_seven_day_average(student_id):
    student_hash = hash_student_id(student_id)
    seven_days_ago = datetime.utcnow() - timedelta(days=7)
    
    logs = list(db.pulses.find({
        "student_hash": student_hash,
        "timestamp": {"$gte": seven_days_ago}
    }))
    
    if not logs:
        return jsonify({"avg_mood": None, "avg_stress": None, "is_alarming": False}), 200
        
    avg_mood = sum(log['mood_score'] for log in logs) / len(logs)
    avg_stress = sum(log['stress_score'] for log in logs) / len(logs)
    
    # Simple rule for alarming: mood < 2.5 or stress > 4
    is_alarming = avg_mood <= 2.5 or avg_stress >= 4.0
    
    return jsonify({
        "avg_mood": round(avg_mood, 2),
        "avg_stress": round(avg_stress, 2),
        "logs_count": len(logs),
        "is_alarming": is_alarming
    }), 200

@app.route('/api/analytics/blocks', methods=['GET'])
def block_analytics():
    # Aggregate average stress and mood by block
    pipeline = [
        {
            "$group": {
                "_id": "$block",
                "avg_mood": {"$avg": "$mood_score"},
                "avg_stress": {"$avg": "$stress_score"},
                "total_logs": {"$sum": 1}
            }
        }
    ]
    results = list(db.pulses.aggregate(pipeline))
    
    formatted = []
    for r in results:
        formatted.append({
            "block": r["_id"],
            "avg_mood": round(r["avg_mood"], 2),
            "avg_stress": round(r["avg_stress"], 2),
            "total_logs": r["total_logs"]
        })
        
    return jsonify(formatted), 200

@app.route('/api/analytics/students/<block>', methods=['GET'])
def student_details_by_block(block):
    # Per student averages within a block using last 7 days
    seven_days_ago = datetime.utcnow() - timedelta(days=7)

    pipeline = [
        {
            "$match": {
                "block": block,
                "timestamp": {"$gte": seven_days_ago}
            }
        },
        {
            "$group": {
                "_id": "$student_hash",
                "avg_mood": {"$avg": "$mood_score"},
                "avg_stress": {"$avg": "$stress_score"},
                "logs_count": {"$sum": 1},
                "latest": {"$max": "$timestamp"}
            }
        },
        { "$sort": { "avg_stress": -1 } }
    ]
    results = list(db.pulses.aggregate(pipeline))

    formatted = []
    for r in results:
        avg_mood = round(r["avg_mood"], 2)
        avg_stress = round(r["avg_stress"], 2)
        formatted.append({
            "student_hash": r["_id"],
            "short_id": r["_id"][:10],  # show first 10 chars for display
            "avg_mood": avg_mood,
            "avg_stress": avg_stress,
            "logs_count": r["logs_count"],
            "latest": r["latest"].isoformat() if r.get("latest") else None,
            "is_alarming": avg_mood <= 2.5 or avg_stress >= 4.0
        })

    return jsonify(formatted), 200

@app.route('/api/counselling/book', methods=['POST'])
def book_counselling():
    data = request.json
    student_id = data.get('student_id')
    date = data.get('date')
    is_sos = data.get('is_sos', False)
    
    appointment = {
        "student_id": student_id, # Can keep plaintext here since it's direct counselling link
        "date": date,
        "is_sos": is_sos,
        "status": "pending",
        "created_at": datetime.utcnow()
    }
    
    db.appointments.insert_one(appointment)
    return jsonify({"message": "Appointment booked"}), 201

@app.route('/api/counselling/appointments', methods=['GET'])
def get_appointments():
    appointments = list(db.appointments.find({}, {"_id": 0}))
    return jsonify(appointments), 200

@app.route('/api/ml/predict', methods=['GET'])
def predict_stress():
    # Placeholder for the future ML model.
    # Currently returning a dummy prediction for UI demonstration.
    dummy_predictions = [
        {"student_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855", "risk_level": "High", "reason": "Consistent drop in mood over 3 weeks"},
        {"student_hash": "8aba4b2a8d5a3cb148ec7f2127160233ea85f368f5c94cdcf98a8a9143715c0e", "risk_level": "Medium", "reason": "Spike in stress on weekends"},
    ]
    return jsonify(dummy_predictions), 200

if __name__ == '__main__':
    app.run(port=5000, debug=True)
