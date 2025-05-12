from flask import Blueprint, jsonify, render_template, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.scr.models.models import User, GameSession, Transaction

profile_bp = Blueprint('profile', __name__)


# Страница профиля (рендерит HTML)
@profile_bp.route('/profile')
@jwt_required()
def profile_page():
    return render_template('profile.html')


