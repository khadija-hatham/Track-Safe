from flask import Blueprint, request, jsonify
from models.violation_model import Violation
from models.database import db

violation_bp = Blueprint('violation', __name__)

@violation_bp.route('/', methods=['GET'])
def get_violations():
    violations = Violation.query.all()
    return jsonify([{
        "id": v.id,
        "worker_name": v.worker_name,
        "violation_type": v.violation_type,
        "timestamp": v.timestamp.isoformat()
    } for v in violations]), 200

@violation_bp.route('/', methods=['POST'])
def report_violation():
    data = request.get_json()
    v = Violation(
        worker_name=data['worker_name'],
        violation_type=data['violation_type']
    )
    db.session.add(v)
    db.session.commit()
    return jsonify({"message": "Violation reported"}), 201
