import os
import json
import re
import pdfplumber
import requests
from dotenv import load_dotenv

# -----------------------------
# Load environment variables
# -----------------------------
load_dotenv()
OPENROUTER_API_KEY = os.getenv("open_router_api_key")

if not OPENROUTER_API_KEY:
    raise RuntimeError("OPENROUTER_API_KEY not found in .env file")


# -----------------------------
# Target JSON Schema
# -----------------------------
TARGET_SCHEMA = {
    "name": {"first": "", "middle": "", "last": ""},
    "contact": {"email": "", "phone": "", "location": "", "links": []},
    "skills": [],
    "experience": [],
    "education": [],
    "projects": [],
    "certifications": [],
    "languages_known": [],
    "keywords": []
}


# -----------------------------
# Step 1: PDF → Text
# -----------------------------
def extract_text_from_pdf(pdf_path):
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""
    text = re.sub(r"\s+", " ", text)
    return text.strip()


# -----------------------------
# Step 2: Call OpenRouter
# -----------------------------
def extract_json_with_openrouter(resume_text):
    prompt = f"""
You are a Senior Corporate Recruiter and a Resume Intelligence Engine.

Your task is to deeply understand the provided resume text and convert all meaningful information into a structured JSON object.
You must read and reason through the resume like a human recruiter, not perform shallow keyword extraction.

====================
CORE EXTRACTION RULES
====================

1. Understand the resume line-by-line and section-by-section.
2. Extract ALL meaningful information, even if:
   - formatting is poor
   - sections are merged
   - information is written informally
3. Do NOT hallucinate or invent data.
4. If a value is missing, unclear, or not present:
   - Use empty string "" for text fields
   - Use empty array [] for list fields
5. Normalize extracted values for consistency and accuracy.
6. Output ONLY valid JSON. No explanations, no markdown.

====================
NORMALIZATION RULES (CRITICAL)
====================

You MUST normalize synonymous and abbreviated terms into their standard form.

Examples (not limited to):
- js → JavaScript
- javascript → JavaScript
- ts → TypeScript
- py → Python
- node → Node.js
- reactjs / react.js → React
- angularjs → Angular
- vuejs → Vue.js
- ml → Machine Learning
- ai → Artificial Intelligence
- sql db / rdbms → SQL
- nosql db → NoSQL
- aws cloud → AWS

Remove duplicates after normalization.

====================
SECTION-SPECIFIC RULES
====================

NAME
- Intelligently split full names into first, middle, last
- Handle initials and single-name formats

CONTACT
- Extract email, phone number, location even if embedded in text
- Normalize phone numbers
- Extract ALL URLs (LinkedIn, GitHub, Portfolio, Coding profiles)

SKILLS (VERY IMPORTANT)
- Extract BOTH explicit and implicit skills
- Convert descriptive sentences into atomic skills
  Example:
  "Built frontend apps using js and react"
  → ["JavaScript", "React", "Frontend Development"]
- Exclude soft skills unless they represent a professional competency
- Remove duplicates after normalization

EXPERIENCE
- Identify job roles and companies even if poorly formatted
- Convert paragraphs into bullet-style responsibility points
- Extract tools, technologies, and methods used
- Preserve original meaning while making text concise
- Use "Present" if role is ongoing

EDUCATION
- Normalize degrees (B.Tech, Bachelor’s, Engineering, etc.)
- Extract institutions and years even if inconsistently written

PROJECTS
- Extract academic, personal, and professional projects
- Identify project purpose and technologies used
- Extract projects even if embedded inside experience sections

CERTIFICATIONS
- Extract all certifications, online courses, and bootcamps
- Normalize provider names (AWS, Google, Coursera, Udemy, etc.)

LANGUAGES KNOWN
- Extract ONLY spoken human languages
- Do NOT include programming languages here

KEYWORDS
- Include normalized, high-value resume keywords:
  - Job titles
  - Core technologies
  - Frameworks
  - Methodologies
- Keywords should improve search and filtering accuracy

Schema:
{json.dumps(TARGET_SCHEMA)}

Resume Text:
<<<
{resume_text}
>>>
"""

    response = requests.post(
        url="https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost",
            "X-Title": "Resume Parser Hackathon"
        },
        json={
            "model":"mistralai/mistral-7b-instruct:free",
            "messages": [
                {
                    "role": "user",
                    "content": [{"type": "text", "text": prompt}]
                }
            ],
            "temperature": 0.1
        }
    )

    if response.status_code != 200:
        raise RuntimeError(f"OpenRouter API error: {response.text}")

    result = response.json()
    output_text = result["choices"][0]["message"]["content"]

    return json.loads(output_text)


# -----------------------------
# Step 3: Full Pipeline
# -----------------------------
def resume_pdf_to_json(pdf_path):
    resume_text = extract_text_from_pdf(pdf_path)
    return extract_json_with_openrouter(resume_text)


# -----------------------------
# Run
# -----------------------------
if __name__ == "__main__":
    pdf_path = "D:/InnovaTech/resume.pdf"

    try:
        resume_json = resume_pdf_to_json(pdf_path)
        print(json.dumps(resume_json, indent=2))
    except Exception as e:
        print("Error:", e)
