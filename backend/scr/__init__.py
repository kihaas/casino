import os
from flask import Flask
from flask_cors import CORS
from .utils.extensions import db, jwt


def create_app():
    app = Flask(__name__,
                template_folder='../../frontend/scr/templates',
                static_folder='../../frontend/scr/static')

    app.config.from_object('backend.config.Config')
    CORS(app)

    db.init_app(app)
    jwt.init_app(app)

    with app.app_context():
        db.create_all()

    from .blueprints.auth import auth_bp
    from .blueprints.profile import profile_bp
    from .blueprints.main import main_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(profile_bp)
    app.register_blueprint(main_bp)

    return app