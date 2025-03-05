from db import users_collection
from bson import ObjectId  # Import ObjectId to convert it

class User:
    @staticmethod
    def create_user(first_name, last_name, student_id, email, password, is_admin):
        user_data = {
            "first_name": first_name,
            "last_name": last_name,
            "student_id": student_id,
            "email": email,
            "password": password,
            "is_admin": is_admin
        }
        inserted_user = users_collection.insert_one(user_data)
        user_data["_id"] = str(inserted_user.inserted_id)  # Convert ObjectId to string
        return user_data

    @staticmethod
    def find_user(email):
        user = users_collection.find_one({"email": email})
        if user:
            user["_id"] = str(user["_id"])  # Convert ObjectId to string
        return user
