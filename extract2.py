import os
import json
import re
import pdfplumber
from openai import OpenAI

MODEL = "gpt-4.1-mini"  

TARGET_SCHEMA = {
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

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def extract_text_from_pdf(pdf_path):
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def extract_json_with_openai(resume_text):
    prompt = f"""
Extract resume information and return ONLY valid JSON.

STRICT RULES:
- Output ONLY JSON
- Match the schema exactly
- No explanations
- No markdown
- Use empty string or empty list if data is missing

Schema:
{json.dumps(TARGET_SCHEMA)}

Resume Text:
<<<
{resume_text}
>>>
"""

    response = client.responses.create(
        model=MODEL,
        input=prompt,
        max_output_tokens=800
    )

    output = response.output_text.strip()

    match = re.search(r"\{.*\}", output, re.DOTALL)
    if not match:
        raise ValueError("No valid JSON returned by OpenAI")

    return json.loads(match.group())


def resume_pdf_to_json(pdf_path):
    text = extract_text_from_pdf(pdf_path)
    return extract_json_with_openai(text)


if __name__ == "__main__":
    pdf_path = "resume.pdf"  # <-- change this

    try:
        result = resume_pdf_to_json(pdf_path)
        print(json.dumps(result, indent=2))
    except Exception as e:
        print("Error:", e)
