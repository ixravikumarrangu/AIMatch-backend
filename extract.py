import pdfplumber
import subprocess
import json
import re
import sys
def extract_text_from_pdf(pdf_path):
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

TARGET_SCHEMA = """
{
  "name": { "first": "", "middle": "", "last": "" },
  "contact": { "email": "", "phone": "", "location": "", "links": [] },
  "skills": [],
  "experience": [],
  "education": [],
  "projects": [],
  "certifications": [],
  "languages_known": [],
  "keywords": []
}
"""


def build_prompt(resume_text):
    return f"""
You are a resume parser.

Extract structured information from the resume text below.

STRICT RULES:
- Return ONLY valid JSON
- Match schema exactly
- No explanations
- No markdown
- No extra text

Schema:
{TARGET_SCHEMA}

Resume Text:
<<<
{resume_text}
>>>
"""

def extract_json_with_ollama(resume_text):
    prompt = build_prompt(resume_text)

    result = subprocess.run(
        ["ollama", "run", "llama3"],
        input=prompt,
        capture_output=True,
        text=True,
        encoding="utf-8",      
        errors="ignore"        
    )

    output = result.stdout.strip()

    if not output:
        raise RuntimeError("Ollama returned empty output")

    json_match = re.search(r'\{.*\}', output, re.DOTALL)

    if not json_match:
        raise ValueError("No valid JSON found in Ollama output")

    json_text = json_match.group()

    return json.loads(json_text)


def resume_pdf_to_json(pdf_path):
    resume_text = extract_text_from_pdf(pdf_path)
    return extract_json_with_ollama(resume_text)


if __name__ == "__main__":
    pdf_path = "D:/InnovaTech/resume.pdf"

    try:
        resume_json = resume_pdf_to_json(pdf_path)
        print(json.dumps(resume_json, indent=2))
    except Exception as e:
        print("Error:", e, file=sys.stderr)
