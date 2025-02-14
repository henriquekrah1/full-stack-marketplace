from flask import Flask
from flask_cors import CORS
import os
from dotenv import load_dotenv
from extensions import db, bcrypt, jwt  # Import extensions
from flask_migrate import Migrate  # Import Flask-Migrate

# Load environment variables from .env file
load_dotenv()

def create_app():
    app = Flask(__name__)

    # Configure the app
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:password@localhost/marketplace'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = 'skins_marketplace'

    # Initialize extensions
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    CORS(app)

    # Initialize Flask-Migrate
    migrate = Migrate(app, db)

    # Import models to register them with SQLAlchemy
    with app.app_context():
        import models

    # Import and register blueprints
    from routes import auth
    app.register_blueprint(auth.bp)

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
