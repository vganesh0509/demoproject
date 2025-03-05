from flask import Flask
from flask_cors import CORS  # ✅ Import CORS
from routes.auth import auth_bp
from routes.workflow import workflow_bp

app = Flask(__name__)

# ✅ Allow CORS for all domains (fixes 403 Forbidden issue)
CORS(app, resources={r"/*": {"origins": "*"}})

app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(workflow_bp, url_prefix="/api")

if __name__ == "__main__":
    print("🚀 Server running on http://127.0.0.1:5000")
    app.run(debug=True)
