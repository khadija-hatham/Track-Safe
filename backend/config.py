import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'your-secret-key')
    SQLALCHEMY_DATABASE_URI = 'sqlite:///tracksafe.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
