from db import workflows_collection

class Workflow:
    @staticmethod
    def create_workflow(name, tasks):
        workflow_data = {"name": name, "tasks": tasks}
        workflow_id = workflows_collection.insert_one(workflow_data).inserted_id
        return str(workflow_id)

    @staticmethod
    def get_all_workflows():
        return list(workflows_collection.find({}, {"_id": 0}))

    @staticmethod
    def get_workflow_by_name(name):
        return workflows_collection.find_one({"name": name}, {"_id": 0})
