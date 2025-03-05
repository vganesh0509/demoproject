import os
from bson import ObjectId
from flask import Blueprint, request, jsonify
from db import workflows_collection
# from pyspark.sql import SparkSession, Row
# from pyspark_ai import SparkAI  # ✅ Import PySpark-AI
# from langchain.llms import HuggingFaceHub  # ✅ Use Correct Hugging Face Chat Model (Fix Import)

# ✅ Initialize Flask Blueprint
workflow_bp = Blueprint("workflow", __name__)

# # ✅ Initialize Spark Session
# spark = SparkSession.builder.appName("PySparkAI").getOrCreate()

# # ✅ Load Hugging Face API Key
# HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY")
# if not HUGGINGFACE_API_KEY:
#     print("⚠️ WARNING: Hugging Face API Key is missing! Set it in ~/.zshrc or environment variables.")

# # ✅ Use a Hugging Face Chat-Compatible Model (Fix for BaseChatModel Error)
# try:
#     llm = HuggingFaceHub(
#         repo_id="mistralai/Mistral-7B-Instruct-v0.1",  # ✅ A Chat-based LLM that works with SparkAI
#         model_kwargs={"temperature": 0.5, "max_length": 512},
#         huggingfacehub_api_token=HUGGINGFACE_API_KEY
#     )
#     print("✅ Hugging Face Chat Model Loaded Successfully!")
# except Exception as e:
#     print(f"❌ Error loading Hugging Face LLM: {e}")
#     llm = None  # Prevent breaking the app

# # ✅ Initialize SparkAI with Hugging Face Chat LLM
# if llm:
#     try:
#         spark_ai = SparkAI(llm=llm, spark_session=spark, verbose=True)
#         spark_ai.activate()
#         print("✅ SparkAI Initialized Successfully!")
#     except Exception as e:
#         print(f"❌ Error initializing SparkAI: {e}")
#         spark_ai = None
# else:
#     print("⚠️ SparkAI not initialized due to missing LLM.")

@workflow_bp.route("/workflows", methods=["POST"])
def create_workflow():
    """Creates a new workflow and saves it to MongoDB."""
    data = request.json
    workflow_id = workflows_collection.insert_one(data).inserted_id
    return jsonify({"message": "Workflow created", "id": str(workflow_id)}), 201

@workflow_bp.route("/workflows", methods=["GET"])
def get_workflows():
    """Fetches all workflows from MongoDB."""
    workflows = list(workflows_collection.find({}, {"_id": 1, "name": 1, "tasks": 1}))
    for workflow in workflows:
        workflow["_id"] = str(workflow["_id"])  # Convert _id to string
    return jsonify(workflows)

@workflow_bp.route("/workflows/run", methods=["POST"])
def run_workflow():
    """Executes a stored workflow."""
    if not spark_ai:
        return jsonify({"error": "SparkAI is not initialized properly"}), 500

    data = request.json
    workflow_name = data.get("name")
    workflow = workflows_collection.find_one({"name": workflow_name}, {"_id": 0})

    if workflow:
        try:
            # ✅ Create a Sample DataFrame Before Running
            sample_data = [Row(name="Alice", age=25), Row(name="Bob", age=30), Row(name="Charlie", age=35)]
            df = spark.createDataFrame(sample_data)

            # ✅ Run the Transformation
            result = spark_ai.transform_df(df, desc=workflow["tasks"])
            return jsonify({"result": result._jdf.toString()})

        except Exception as e:
            return jsonify({"error": "Failed to execute workflow", "details": str(e)}), 500

    return jsonify({"error": "Workflow not found"}), 404

@workflow_bp.route("/workflows/<workflow_id>", methods=["DELETE"])
def delete_workflow(workflow_id):
    """Deletes a workflow from MongoDB."""
    result = workflows_collection.delete_one({"_id": ObjectId(workflow_id)})

    if result.deleted_count == 1:
        return jsonify({"message": "Workflow deleted successfully"}), 200
    else:
        return jsonify({"error": "Workflow not found"}), 404

# @workflow_bp.route("/generate_code", methods=["POST"])
# def generate_code():
#     """Generate PySpark code from a human description using Hugging Face LLM."""
#     if not spark_ai:
#         return jsonify({"error": "SparkAI is not initialized properly"}), 500

#     data = request.json
#     user_input = data.get("workflow_description")

#     if not user_input:
#         return jsonify({"error": "No workflow description provided"}), 400

#     try:
#         # ✅ Create Sample DataFrame
#         sample_data = [Row(name="Alice", age=25), Row(name="Bob", age=30), Row(name="Charlie", age=35)]
#         df = spark.createDataFrame(sample_data)

#         # ✅ Transform DataFrame using Hugging Face LLM
#         transformed_df = spark_ai.transform_df(df, desc=user_input)

#         # ✅ Convert DataFrame to String for JSON Response
#         return jsonify({"generated_code": transformed_df._jdf.toString()})

#     except Exception as e:
#         return jsonify({"error": "Failed to generate code", "details": str(e)}), 500
