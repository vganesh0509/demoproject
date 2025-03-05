from pyspark_ai import SparkAI
from pyspark.sql import SparkSession

# ✅ Initialize Spark
spark = SparkSession.builder.appName("PySparkAI").getOrCreate()

# ✅ Initialize PySpark-AI
spark_ai = SparkAI(spark_session=spark, verbose=True)

# ✅ Print available attributes/methods
print(dir(spark_ai))
