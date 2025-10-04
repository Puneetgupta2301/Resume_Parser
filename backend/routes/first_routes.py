from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
import io 
import pdfplumber
import docx2txt
from test import calculate_match

router = APIRouter()

# Dictionary to store role-specific JDs (in-memory; use DB for persistence)
job_descriptions = {
    "Data Scientist": """Job Title: Data Scientist

Job Summary:
We are seeking a talented Data Scientist to join our innovative team. You will play a key role in analyzing complex datasets, building predictive models, and deriving actionable insights to drive business decisions.

Key Responsibilities:
- Collect, clean, and preprocess large datasets from various sources.
- Develop and implement machine learning algorithms and statistical models.
- Perform exploratory data analysis to identify trends and patterns.
- Collaborate with cross-functional teams to define data requirements and success metrics.
- Communicate findings through visualizations and reports.
- Stay updated with the latest advancements in data science and AI.

Required Qualifications:
- Bachelor's or Master's degree in Computer Science, Statistics, Mathematics, or related field.
- 3+ years of experience in data science or related roles.
- Proficiency in Python or R for data manipulation and modeling (e.g., Pandas, NumPy, Scikit-learn).
- Experience with SQL and data visualization tools (e.g., Tableau, Matplotlib).
- Strong problem-solving skills and attention to detail.
- Excellent communication and teamwork abilities.

Preferred Skills:
- Experience with big data technologies (e.g., Hadoop, Spark).
- Knowledge of deep learning frameworks (e.g., TensorFlow, PyTorch).
- Familiarity with cloud platforms (e.g., AWS, GCP).

What We Offer:
- Competitive salary and benefits package.
- Opportunities for professional growth and development.
- Collaborative and inclusive work environment.

If you are passionate about data and ready to make an impact, apply today!""",
    "QA Automation": """Job Title: QA Automation Engineer

Job Summary:
We are seeking a skilled QA Automation Engineer to join our dynamic team. You will be responsible for developing and implementing automated testing frameworks to ensure the quality and reliability of our software products.

Key Responsibilities:
- Design and develop automated test scripts using tools like Selenium, Appium, or similar.
- Execute automated tests and analyze results to identify defects.
- Collaborate with developers to understand requirements and create comprehensive test plans.
- Maintain and update test automation frameworks for regression testing.
- Integrate automated tests into CI/CD pipelines for continuous quality assurance.
- Report test results, metrics, and defects to stakeholders and development teams.

Required Qualifications:
- Bachelor's degree in Computer Science, Information Technology, or related field.
- 2+ years of experience in QA automation engineering.
- Proficiency in programming languages such as Java, Python, or JavaScript.
- Hands-on experience with automation tools (e.g., Selenium, JUnit, TestNG).
- Knowledge of testing methodologies, including unit, integration, and end-to-end testing.
- Familiarity with version control systems like Git.

Preferred Skills:
- Experience with cloud-based testing platforms (e.g., AWS Device Farm, BrowserStack).
- Knowledge of Agile/Scrum methodologies and behavior-driven development (BDD).
- ISTQB or similar certification in software testing.
- Experience with API testing tools (e.g., Postman, REST Assured).

What We Offer:
- Competitive salary and comprehensive benefits package.
- Opportunities for continuous learning and certification support.
- Collaborative and innovative work environment.

If you are passionate about quality assurance and automation, apply today!""",
    "Backend Developer": """Job Title: Backend Developer

Job Summary:
We are looking for a talented Backend Developer to join our engineering team. You will build and maintain robust server-side applications, ensuring seamless integration and high performance for our web services.

Key Responsibilities:
- Develop and maintain server-side logic, APIs, and databases to support frontend applications.
- Design, implement, and optimize database schemas for efficient data storage and retrieval.
- Integrate third-party services and handle authentication, authorization, and data security.
- Collaborate with frontend developers and stakeholders to define API contracts and requirements.
- Write clean, scalable code and perform unit testing to ensure reliability.
- Monitor and troubleshoot application performance and scalability issues.

Required Qualifications:
- Bachelor's degree in Computer Science or related field.
- 3+ years of experience in backend development.
- Proficiency in server-side languages like Node.js, Python, Java, or Ruby.
- Experience with relational databases (e.g., PostgreSQL, MySQL) and NoSQL (e.g., MongoDB).
- Strong understanding of RESTful APIs, microservices, and web fundamentals.
- Familiarity with version control (Git) and containerization (Docker).

Preferred Skills:
- Experience with cloud platforms (e.g., AWS, Azure, GCP) and serverless architectures.
- Knowledge of message queues (e.g., RabbitMQ, Kafka) and caching mechanisms (e.g., Redis).
- Exposure to DevOps practices and CI/CD pipelines.
- Understanding of security best practices and OAuth/JWT implementation.

What We Offer:
- Competitive salary and benefits package.
- Opportunities for professional growth and mentorship.
- Collaborative and inclusive work environment.

If you are passionate about building scalable backend systems, apply today!""",
    "Frontend Developer": """Job Title: Frontend Developer

Job Summary:
We are seeking a creative Frontend Developer to join our web development team. You will translate design concepts into responsive, user-friendly interfaces that enhance the overall user experience.

Key Responsibilities:
- Develop and maintain interactive and responsive web interfaces using modern frontend technologies.
- Collaborate with UI/UX designers to implement pixel-perfect designs and ensure cross-browser compatibility.
- Integrate frontend code with backend APIs to create dynamic, data-driven applications.
- Optimize application performance for speed and scalability across devices.
- Write clean, semantic HTML, CSS, and JavaScript code following best practices.
- Conduct usability testing and gather feedback to iterate on user interfaces.

Required Qualifications:
- Bachelor's degree in Computer Science, Graphic Design, or related field.
- 2+ years of experience in frontend development.
- Proficiency in HTML5, CSS3, JavaScript, and frameworks like React, Vue, or Angular.
- Experience with responsive design principles and tools (e.g., Bootstrap, Tailwind CSS).
- Understanding of version control (Git) and basic backend integration.
- Strong attention to detail and problem-solving skills.

Preferred Skills:
- Knowledge of state management (e.g., Redux, Vuex) and performance optimization techniques.
- Familiarity with TypeScript, Webpack, or other build tools.
- Experience with accessibility (a11y) standards and SEO best practices.
- Exposure to GraphQL or advanced CSS preprocessors (e.g., SASS).

What We Offer:
- Competitive salary and comprehensive benefits.
- Opportunities for creative projects and skill development.
- Collaborative and supportive work environment.

If you are passionate about crafting exceptional user experiences, apply today!""",
    # Add defaults for other roles if needed
}

# -------- Helper: Extract text based on file type --------
def extract_text_from_file(file: UploadFile, contents: bytes) -> str:
    filename = file.filename.lower()

    # --- Handle TXT ---
    if filename.endswith(".txt"):
        try:
            return contents.decode("utf-8")
        except UnicodeDecodeError:
            raise HTTPException(status_code=400, detail="Unable to decode TXT file. Please upload UTF-8 text.")

    # --- Handle PDF using pdfplumber ---
    elif filename.endswith(".pdf"):
        try:
            text = ""
            with pdfplumber.open(io.BytesIO(contents)) as pdf:
                for page in pdf.pages:
                    text += page.extract_text() or ""
            return text
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error reading PDF: {str(e)}")

    # --- Handle DOCX ---
    elif filename.endswith(".docx"):
        try:
            with io.BytesIO(contents) as docx_file:
                text = docx2txt.process(docx_file)
            return text
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error reading DOCX: {str(e)}")

    else:
        raise HTTPException(status_code=400, detail="Unsupported file format. Please upload PDF, DOCX, or TXT.")


# -------- Upload Resume and Match JD --------
@router.post("/upload_doc")
async def upload_doc(
    file: UploadFile = File(...),
    role: str = Form(...)
):
    if not file:
        raise HTTPException(status_code=400, detail="No file uploaded")

    # Get JD for the role
    jd_text = job_descriptions.get(role)
    if not jd_text:
        raise HTTPException(status_code=404, detail=f"No Job Description found for role: {role}")

    contents = await file.read()
    resume_text = extract_text_from_file(file, contents)

    if not resume_text.strip():
        raise HTTPException(status_code=400, detail="Could not extract any text from the uploaded file")

    # Compare JD with resume
    result = calculate_match(resume_text, jd_text)

    return JSONResponse(
        content={
            "filename": file.filename,
            "role": role,
            "predicted_role": result.get("predicted_role"),
            "match_percentage": result.get("match_percentage")
        }
    )


# -------- Get JD by role --------
@router.get("/get_data")
async def get_data(role: str = None):
    if role:
        jd_text = job_descriptions.get(role, "")
        if not jd_text:
            raise HTTPException(status_code=404, detail=f"No Job Description found for role: {role}")
        return {"role": role, "text": jd_text}
    else:
        # Return the first available JD as fallback
        return {"text": list(job_descriptions.values())[0] if job_descriptions else ""}