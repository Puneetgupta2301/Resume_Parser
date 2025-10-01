from fastapi import APIRouter, UploadFile, File, Form
import io 
import docx2txt
from backend.test import calculate_match

router = APIRouter()
job_description_text = ""  # global variable to store JD


# API 1 - Upload Resume
@router.post("/upload_doc")
async def upload_doc(file: UploadFile = File(...)):
    global job_description_text
    contents = await file.read()
    resume_text = docx2txt.process(io.BytesIO(contents))

    result = calculate_match(resume_text, job_description_text)

    return {
        "filename": file.filename,
        "predicted_role": result["predicted_role"],
        "match_percentage": result["match_percentage"]
    }


# API 2 - Set Job Description (from frontend text box / form)
@router.post("/set_job_description")
async def set_job_description(jd: str = Form(...)):
    global job_description_text
    job_description_text = jd
    return {"message": "Job description set successfully", "jd": job_description_text}


# API 3 - Get Job Description (for display in UI if needed)
@router.get("/get_data")
async def get_data():
    global job_description_text
    return {"text": job_description_text}
