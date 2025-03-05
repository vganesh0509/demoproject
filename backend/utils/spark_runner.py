from pyspark.sql import SparkSession

class SparkRunner:
    def __init__(self):
        self.spark = SparkSession.builder.appName("BigDataTutor").getOrCreate()

    def run_word_count(self, text_file_path):
        # Read text file
        text_file = self.spark.read.text(text_file_path)

        # Word count logic
        word_counts = text_file.rdd.flatMap(lambda line: line.value.split(" ")) \
                                   .map(lambda word: (word, 1)) \
                                   .reduceByKey(lambda a, b: a + b)
        
        # Collect result
        result = word_counts.collect()
        return result

    def run_custom_workflow(self, workflow):
        """ Execute workflow steps in Spark """
        df = None
        for step in workflow:
            if step["action"] == "read":
                df = self.spark.read.text(step["source"])
            elif step["action"] == "filter":
                df = df.filter(df.value.contains(step["keyword"]))
            elif step["action"] == "count":
                count = df.count()
                return {"result": count}

        return {"status": "Completed"}
