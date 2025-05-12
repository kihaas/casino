from backend.scr import create_app
from backend.scr.models.models import db

app = create_app()
with app.app_context():
    db.create_all()