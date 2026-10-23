from models.database import db
from datetime import datetime

class Violation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    worker_name = db.Column(db.String(100))
    violation_type = db.Column(db.String(100))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
