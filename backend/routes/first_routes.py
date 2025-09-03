from fastapi import APIRouter, UploadFile, File

text = """About the Role:
We are seeking a highly skilled and motivated Data Scientist to join our team. The candidate will leverage statistical analysis, machine learning, and data visualization to derive actionable insights and help solve complex business problems. The role involves collaborating with cross-functional teams to design data-driven strategies, build predictive models, and optimize decision-making processes.

Key Responsibilities:
- Collect, clean, and preprocess structured and unstructured data.
- Perform exploratory data analysis to identify patterns, trends, and business opportunities.
- Design and implement machine learning models.
- Evaluate model performance using statistical and business metrics.
- Develop dashboards and visualizations to communicate insights.
- Collaborate with stakeholders to provide data-driven solutions.
- Stay updated with advancements in AI, ML, and data science tools.

Required Skills & Qualifications:
- Bachelor’s/Master’s degree in Computer Science, Statistics, Mathematics, Data Science, or related field.
- Strong proficiency in Python (Pandas, NumPy, Scikit-learn, TensorFlow/PyTorch).
- Experience with SQL and relational databases.
- Familiarity with data visualization tools (Power BI, Tableau, Matplotlib, Seaborn).
- Solid understanding of statistics, probability, and machine learning algorithms.
- Knowledge of big data frameworks (Spark, Hadoop) is a plus.
- Excellent problem-solving and communication skills.

Preferred Qualifications:
- Experience with cloud platforms (AWS, Azure, GCP).
- Familiarity with MLOps practices.
- Experience with NLP, recommender systems, or time-series analysis.

What We Offer:
- Competitive salary and performance-based bonuses.
- Health, wellness, and retirement benefits.
- Opportunities for professional growth.
- Collaborative and innovative work environment.
- Flexible work arrangements (remote/hybrid options)
"""

router = APIRouter()

# API 1 - Upload Document
@router.post("/upload_doc")
async def upload_doc(file: UploadFile = File(...)):
    return {"filename": file.filename, "message": "Document uploaded successfully"}

# API 2 - Get Data (JD text)
@router.get("/get_data")
async def get_data():
    return {"text": text}
