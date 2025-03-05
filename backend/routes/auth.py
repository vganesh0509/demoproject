from flask import Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
from models.user import User
from db import users_collection  # 🔹 Import users_collection to fix NameError

auth_bp = Blueprint("auth", __name__)
bcrypt = Bcrypt()

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json

    user = users_collection.find_one({"email": data["email"]})

    if( user ):
        return jsonify({
                    "message": "User Already Exists. Please Login",
                    "success": False
                }), 201
    

    print( data )
    # Check if the required fields are provided
    required_fields = ["firstName", "lastName", "studentId", "email", "password"]
    for field in required_fields:
        if field not in data:
            return jsonify({"message": f"{field} is required"}), 400

    # Hash the password
    hashed_password = bcrypt.generate_password_hash(data["password"]).decode("utf-8")

    # Create the user
    user_data = User.create_user(
        first_name=data["firstName"],
        last_name=data["lastName"],
        student_id=data["studentId"],
        email=data["email"],
        password=hashed_password,
        is_admin=data.get("isAdmin", False)  # Default to False if not provided
    )

    # Return JSON-safe response
    return jsonify({
        "success": True,
        "message": "User registered successfully",
        "user": {
            "id": user_data["_id"],  # Send the converted ObjectId
            "firstName": user_data["first_name"],
            "lastName": user_data["last_name"],
            "studentId": user_data["student_id"],
            "email": user_data["email"],
            "isAdmin": user_data["is_admin"]
        }
    }), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    print(  data )
    # 🔹 Fetch user from MongoDB
    user = users_collection.find_one({"email": data["email"]})
    
    print( data )
    if user and bcrypt.check_password_hash(user["password"], data["password"]):
        if(data['isAdmin'] == user['is_admin'] ):
            if( user['is_admin'] ):
                return jsonify({"message": "Login successful", "role": "instructor"})
            else:
                return jsonify({"message": "Login successful", "role": "student"})
    
    return jsonify({"error": "Invalid credentials"}), 401
