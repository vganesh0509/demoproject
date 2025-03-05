from pyspark.sql import SparkSession

# ✅ Create a Spark Session
spark = SparkSession.builder.appName("TestPySpark").getOrCreate()

# ✅ Create a Sample DataFrame
data = [("Alice", 25), ("Bob", 30), ("Charlie", 35)]
columns = ["Name", "Age"]
df = spark.createDataFrame(data, columns)

# ✅ Show the DataFrame
df.show()

# ✅ Stop Spark Session
spark.stop()
