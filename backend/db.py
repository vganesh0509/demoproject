from pymongo import MongoClient

client = MongoClient("mongodb+srv://ganeshvasa71:1QoflHLiCUo5vAaW@cluster0.d4k31.mongodb.net/")
db = client["bigdatatutor"]
users_collection = db["users"]
workflows_collection = db["workflows"]

