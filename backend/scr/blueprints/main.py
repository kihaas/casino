from flask import Blueprint, render_template
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.scr.models.models import User

main_bp = Blueprint('main', __name__)


@main_bp.route('/')
def index():
    return render_template('index.html')


@main_bp.route('/roulette')
def roulette():
    return render_template('roulette.html')