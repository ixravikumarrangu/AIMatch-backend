# # # from rest_framework.decorators import api_view, parser_classes, action
# # # from rest_framework.parsers import MultiPartParser, FormParser
# # # from rest_framework.response import Response
# # # from rest_framework import status, viewsets
# # # from user.ats_engine import compute_from_parsed
# # # from django.shortcuts import get_object_or_404

# # # import json
# # # import requests
# # # import io
# # # import pdfplumber

# # # from django.conf import settings
# # # from django.shortcuts import get_object_or_404
# # # from django_filters.rest_framework import DjangoFilterBackend

# # # from user.models import UserProfile, UserCredentials, UserSkills, UserApplication
# # # from company.models import CompanyJobDescription

# # # from .serializers import (
# # #     UserCredentialsSerializer,
# # #     UserProfileSerializer,
# # #     UserSkillsSerializer,
# # #     UserApplicationSerializer
# # # )

# # # # --------------------------------------------------
# # # # SAFE JSON EXTRACTOR (🔥 CRITICAL)
# # # # --------------------------------------------------
# # # def extract_resume_json(text: str) -> dict:
# # #     try:
# # #         text = text.replace("```json", "").replace("```", "").strip()
# # #         data = json.loads(text)

# # #         if isinstance(data, dict) and "resume_text" in data:
# # #             inner = data["resume_text"]
# # #             if isinstance(inner, str):
# # #                 return json.loads(inner)

# # #         return data if isinstance(data, dict) else {}
# # #     except Exception:
# # #         return {}

# # # # --------------------------------------------------
# # # # RESUME UPLOAD API
# # # # --------------------------------------------------
# # # @api_view(["POST"])
# # # @parser_classes([MultiPartParser, FormParser])
# # # def upload_resume(request):
# # #     file = request.FILES.get("resume")
# # #     user_id = request.POST.get("user_id")

# # #     if not file or not user_id:
# # #         return Response(
# # #             {"error": "resume and user_id required"},
# # #             status=status.HTTP_400_BAD_REQUEST
# # #         )

# # #     # --- Extract PDF text
# # #     try:
# # #         with pdfplumber.open(io.BytesIO(file.read())) as pdf:
# # #             raw_text = "\n".join(page.extract_text() or "" for page in pdf.pages)
# # #     except Exception as e:
# # #         return Response(
# # #             {"error": "PDF extraction failed", "detail": str(e)},
# # #             status=status.HTTP_500_INTERNAL_SERVER_ERROR
# # #         )

# # #     # --- Validate LLM config
# # #     if not settings.GEMINI_API_URL or not settings.GEMINI_API_KEY:
# # #         return Response(
# # #             {"error": "LLM API config missing"},
# # #             status=status.HTTP_500_INTERNAL_SERVER_ERROR
# # #         )

# # #     # --- Prompt
# # #     prompt = """  You are a Senior Corporate Recruiter and a Resume Intelligence Engine.

# # # Your task is to deeply understand the provided resume text and convert all meaningful information into a structured JSON object.
# # # You must read and reason through the resume like a human recruiter, not perform shallow keyword extraction.

# # # ====================
# # # CORE EXTRACTION RULES
# # # ====================

# # # 1. Understand the resume line-by-line and section-by-section.
# # # 2. Extract ALL meaningful information even if formatting is poor or informal.
# # # 3. Do NOT hallucinate, infer, or fabricate information.
# # # 4. If a value is missing:
# # #    - Use "" for text fields
# # #    - Use [] for list fields
# # # 5. Normalize extracted values for consistency.
# # # 6. Output ONLY valid JSON. No explanations. No markdown.

# # # ====================
# # # CRITICAL SEPARATION RULES (VERY IMPORTANT)
# # # ====================

# # # You MUST STRICTLY separate information by category.

# # # 🚫 The following MUST NEVER appear in:
# # # - skills
# # # - keywords

# # # ❌ Degrees (B.Tech, Bachelor, Intermediate, MPC, etc.)
# # # ❌ College / University names
# # # ❌ School names
# # # ❌ Education boards
# # # ❌ Locations (cities, states, countries)
# # # ❌ Platforms (CodeChef, HackerRank, LeetCode, GitHub)
# # # ❌ Job levels like "fresher", "student", "volunteer"
# # # ❌ Generic words like "training", "coursework", "learning"

# # # If any of the above are found:
# # # ✔ Place them ONLY in education, contact, or experience
# # # ❌ NEVER place them in skills or keywords

# # # Violation of this rule is considered an extraction error.

# # # ====================
# # # NORMALIZATION RULES (MANDATORY)
# # # ====================

# # # Normalize synonymous and abbreviated technical terms.

# # # Examples:
# # # - js → JavaScript
# # # - javascript → JavaScript
# # # - ts → TypeScript
# # # - py → Python
# # # - node → Node.js
# # # - reactjs / react.js → React
# # # - angularjs → Angular
# # # - vuejs → Vue.js
# # # - ml → Machine Learning
# # # - ai → Artificial Intelligence
# # # - rdbms / sql db → SQL
# # # - nosql db → NoSQL
# # # - aws cloud → AWS

# # # Remove duplicates AFTER normalization.

# # # ====================
# # # SECTION-SPECIFIC RULES
# # # ====================

# # # NAME
# # # - Split full names into first, middle, last intelligently.

# # # CONTACT
# # # - Extract email, phone, location, links.
# # # - Normalize phone numbers.
# # # - Extract URLs (LinkedIn, GitHub, Portfolio).

# # # SKILLS (TECHNICAL ONLY)
# # # - Include ONLY:
# # #   ✔ Programming languages
# # #   ✔ Frameworks
# # #   ✔ Libraries
# # #   ✔ Databases
# # #   ✔ Cloud & DevOps tools
# # #   ✔ Core CS concepts (DSA, OOP, OS, DBMS)
# # #   ✔ AI/ML techniques

# # # - Convert descriptions into atomic skills.
# # # - Exclude:
# # #   ❌ Education terms
# # #   ❌ Institutions
# # #   ❌ Platforms
# # #   ❌ Soft skills

# # # EXPERIENCE
# # # - Extract job roles, companies, dates, responsibilities.
# # # - Convert paragraphs into concise bullet points.
# # # - Extract tools/technologies used (but do NOT duplicate education data).

# # # EDUCATION
# # # - Extract degrees, field of study, institutions, years.
# # # - Education-related terms MUST stay here only.

# # # PROJECTS
# # # - Extract project name, purpose, technologies used.
# # # - Projects embedded in experience must still be extracted.

# # # CERTIFICATIONS
# # # - Extract certifications and providers only.

# # # LANGUAGES KNOWN
# # # - Spoken human languages ONLY.
# # # - NEVER include programming languages here.

# # # KEYWORDS (STRICT ATS FILTER)
# # # - Include ONLY:
# # #   ✔ Job titles (e.g., Software Engineer, Data Scientist)
# # #   ✔ Core technical skills
# # #   ✔ Frameworks
# # #   ✔ Methodologies (Agile, Scrum, DevOps)

# # # - MUST NOT include:
# # #   ❌ Colleges
# # #   ❌ Degrees
# # #   ❌ Locations
# # #   ❌ Platforms (CodeChef, HackerRank, etc.)
# # #   ❌ Education terms

# # # Keywords must be searchable professional terms used by recruiters.

# # # ====================
# # # OUTPUT JSON SCHEMA (DO NOT CHANGE)
# # # ====================

# # # {
# # #   "name": {
# # #     "first": "",
# # #     "middle": "",
# # #     "last": ""
# # #   },
# # #   "contact": {
# # #     "email": "",
# # #     "phone": "",
# # #     "location": "",
# # #     "links": []
# # #   },
# # #   "skills": [],
# # #   "experience": [
# # #     {
# # #       "job_title": "",
# # #       "company": "",
# # #       "location": "",
# # #       "start_date": "",
# # #       "end_date": "",
# # #       "description": []
# # #     }
# # #   ],
# # #   "education": [
# # #     {
# # #       "degree": "",
# # #       "field_of_study": "",
# # #       "institution": "",
# # #       "start_year": "",
# # #       "end_year": ""
# # #     }
# # #   ],
# # #   "projects": [
# # #     {
# # #       "name": "",
# # #       "description": "",
# # #       "technologies": []
# # #     }
# # #   ],
# # #   "certifications": [],
# # #   "languages_known": [],
# # #   "keywords": [],
# # #   "metadata": {
# # #     "last_updated": ""
# # #   }
# # # }

# # # ====================
# # # METADATA RULE
# # # ====================

# # # - last_updated must be today’s date in YYYY-MM-DD format

# # # ====================
# # # INPUT
# # # ====================

# # # <<RAW_RESUME_TEXT>>"""

# # #     payload = {
# # #         "model": "mistralai/devstral-2512:free",
# # #         "messages": [{"role": "user", "content": prompt}],
# # #     }

# # #     headers = {
# # #         "Authorization": f"Bearer {settings.GEMINI_API_KEY}"
# # #     }

# # #     try:
# # #         resp = requests.post(
# # #             settings.GEMINI_API_URL,
# # #             json=payload,
# # #             headers=headers,
# # #             timeout=120
# # #         )
# # #         resp.raise_for_status()
# # #         output_text = resp.json()["choices"][0]["message"]["content"]
# # #     except Exception as e:
# # #         return Response(
# # #             {"error": "LLM request failed", "detail": str(e)},
# # #             status=status.HTTP_500_INTERNAL_SERVER_ERROR
# # #         )

# # #     parsed = extract_resume_json(output_text)

# # #     if not parsed:
# # #         return Response(
# # #             {"error": "Invalid JSON from LLM"},
# # #             status=status.HTTP_500_INTERNAL_SERVER_ERROR
# # #         )

# # #     # --- Save resume
# # #     #profile = get_object_or_404(UserProfile, user_id=user_id)
# # #     user = get_object_or_404(UserCredentials, user_id=user_id)

# # #     profile, created = UserProfile.objects.get_or_create(
# # #         user=user,
# # #         defaults={
# # #             "email": user.email,
# # #             "name": ""
# # #         }
# # #     )
# # #     profile.resume_text = json.dumps(parsed)
# # #     profile.save()

# # #     #return Response({"success": True}, status=status.HTTP_200_OK)
# # #     return Response(
# # #         {
# # #             "success": True,
# # #             "resume_json": parsed
# # #         },
# # #         status=status.HTTP_200_OK
# # #     )

# # # # --------------------------------------------------
# # # # VIEWSETS
# # # # --------------------------------------------------
# # # class UserCredentialsViewSet(viewsets.ModelViewSet):
# # #     queryset = UserCredentials.objects.all()
# # #     serializer_class = UserCredentialsSerializer
# # #     filter_backends = [DjangoFilterBackend]
# # #     filterset_fields = ["email"]


# # # class UserProfileViewSet(viewsets.ModelViewSet):
# # #     queryset = UserProfile.objects.all()
# # #     serializer_class = UserProfileSerializer
# # #     lookup_field = "user_id"

# # # class UserSkillsViewSet(viewsets.ModelViewSet):
# # #     queryset = UserSkills.objects.all()
# # #     serializer_class = UserSkillsSerializer


# # # class UserApplicationViewSet(viewsets.ModelViewSet):
# # #     queryset = UserApplication.objects.all()
# # #     serializer_class = UserApplicationSerializer

# # #     @action(detail=False, methods=["post"], url_path="prepare-ats")
# # #     def prepare_ats(self, request):
# # #         user_id = request.data.get("user_id")
# # #         job_id = request.data.get("job_id")

# # #         if not user_id or not job_id:
# # #             return Response(
# # #                 {"error": "user_id and job_id required"},
# # #                 status=status.HTTP_400_BAD_REQUEST
# # #             )

# # #         profile = get_object_or_404(UserProfile, user_id=user_id)
# # #         resume_data = extract_resume_json(profile.resume_text)

# # #         if not resume_data:
# # #             return Response(
# # #                 {"error": "Resume JSON invalid"},
# # #                 status=status.HTTP_400_BAD_REQUEST
# # #             )

# # #         resume_keywords = resume_data.get("keywords") or resume_data.get("skills") or []

# # #         job = get_object_or_404(CompanyJobDescription, job_id=job_id)
# # #         required_skills = (
# # #             [s.strip() for s in job.skills.split(",") if s.strip()]
# # #             if job.skills else []
# # #         )
# # #         # ---------------------------
# # #         # ATS SCORE CALCULATION
# # #         # ---------------------------

# # #         parsed_for_ats = {
# # #             "keywords": resume_keywords
# # #         }

# # #         ats_result = compute_from_parsed(
# # #             parsed=parsed_for_ats,
# # #             required_skills_input=required_skills,
# # #             user_experience=0,  # later: calculate from experience
# # #             required_experience=int(job.experience_level or 0),
# # #             job_role=job.job_title,
# # #             prev_role=""
# # #         )

# # #         ats_score = ats_result["ats_score"]
# # #         # ---------------------------
# # #         # SAVE APPLICATION + ATS SCORE
# # #         # ---------------------------

# # #         application, created = UserApplication.objects.get_or_create(
# # #             user_id=user_id,
# # #             job_id=job_id,
# # #             defaults={
# # #                 "application_status": "applied",
# # #                 "ats_score": ats_score
# # #             }
# # #         )

# # #         # If user already applied, update ATS score
# # #         if not created:
# # #             application.ats_score = ats_score
# # #             application.save()


# # #         return Response(
# # #             {
# # #                 "application_id": application.application_id,
# # #                 "ats_score": ats_score,
# # #                 "normalized_resume_skills": ats_result["user_skills_normalized"],
# # #                 "normalized_required_skills": ats_result["required_skills_normalized"],
# # #                 "application_status": application.application_status,
# # #             },
# # #             status=status.HTTP_200_OK
# # # )

# from rest_framework.decorators import api_view, parser_classes
# from rest_framework.parsers import MultiPartParser, FormParser
# from rest_framework.response import Response
# from rest_framework import status
# import json
# from django.conf import settings
# from .models import UserProfile, UserCredentials

# @api_view(['POST'])
# @parser_classes([MultiPartParser, FormParser])
# def upload_resume(request):
#     file = request.FILES.get('resume')
#     user_id = request.POST.get('user_id')
#     if not file or not user_id:
#         return Response({'error': 'Missing file or user_id'}, status=status.HTTP_400_BAD_REQUEST)

#     # Extract text from PDF using pdfplumber only
#     try:
#         import pdfplumber
#         import io
#         with pdfplumber.open(io.BytesIO(file.read())) as pdf:
#             raw_text = "\n".join(page.extract_text() or '' for page in pdf.pages)
#     except Exception as e:
#         return Response({'error': 'Text extraction failed', 'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#     # Compose Gemini prompt (use your provided template)
#     PROMPT_TEMPLATE = """
#     You are a Senior Corporate Recruiter and a Resume Intelligence Engine.

#     Your task is to deeply understand the provided resume text and convert all meaningful information into a structured JSON object.
#     You must read and reason through the resume like a human recruiter, not perform shallow keyword extraction.

#     ====================
#     CORE EXTRACTION RULES
#     ====================

#     1. Understand the resume line-by-line and section-by-section.
#     2. Extract ALL meaningful information even if formatting is poor or informal.
#     3. Do NOT hallucinate, infer, or fabricate information.
#     4. If a value is missing:
#     - Use "" for text fields
#     - Use [] for list fields
#     5. Normalize extracted values for consistency.
#     6. Output ONLY valid JSON. No explanations. No markdown.

#     ====================
#     CRITICAL SEPARATION RULES (VERY IMPORTANT)
#     ====================

#     You MUST STRICTLY separate information by category.

#     🚫 The following MUST NEVER appear in:
#     - skills
#     - keywords

#     ❌ Degrees (B.Tech, Bachelor, Intermediate, MPC, etc.)
#     ❌ College / University names
#     ❌ School names
#     ❌ Education boards
#     ❌ Locations (cities, states, countries)
#     ❌ Platforms (CodeChef, HackerRank, LeetCode, GitHub)
#     ❌ Job levels like "fresher", "student", "volunteer"
#     ❌ Generic words like "training", "coursework", "learning"

#     If any of the above are found:
#     ✔ Place them ONLY in education, contact, or experience
#     ❌ NEVER place them in skills or keywords

#     Violation of this rule is considered an extraction error.

#     ====================
#     NORMALIZATION RULES (MANDATORY)
#     ====================

#     Normalize synonymous and abbreviated technical terms.

#     Examples:
#     - js → JavaScript
#     - javascript → JavaScript
#     - ts → TypeScript
#     - py → Python
#     - node → Node.js
#     - reactjs / react.js → React
#     - angularjs → Angular
#     - vuejs → Vue.js
#     - ml → Machine Learning
#     - ai → Artificial Intelligence
#     - rdbms / sql db → SQL
#     - nosql db → NoSQL
#     - aws cloud → AWS

#     Remove duplicates AFTER normalization.

#     ====================
#     SECTION-SPECIFIC RULES
#     ====================

#     NAME
#     - Split full names into first, middle, last intelligently.

#     CONTACT
#     - Extract email, phone, location, links.
#     - Normalize phone numbers.
#     - Extract URLs (LinkedIn, GitHub, Portfolio).

#     SKILLS (TECHNICAL ONLY)
#     - Include ONLY:
#     ✔ Programming languages
#     ✔ Frameworks
#     ✔ Libraries
#     ✔ Databases
#     ✔ Cloud & DevOps tools
#     ✔ Core CS concepts (DSA, OOP, OS, DBMS)
#     ✔ AI/ML techniques

#     - Convert descriptions into atomic skills.
#     - Exclude:
#     ❌ Education terms
#     ❌ Institutions
#     ❌ Platforms
#     ❌ Soft skills

#     EXPERIENCE
#     - Extract job roles, companies, dates, responsibilities.
#     - Convert paragraphs into concise bullet points.
#     - Extract tools/technologies used (but do NOT duplicate education data).

#     EDUCATION
#     - Extract degrees, field of study, institutions, years.
#     - Education-related terms MUST stay here only.

#     PROJECTS
#     - Extract project name, purpose, technologies used.
#     - Projects embedded in experience must still be extracted.

#     CERTIFICATIONS
#     - Extract certifications and providers only.

#     LANGUAGES KNOWN
#     - Spoken human languages ONLY.
#     - NEVER include programming languages here.

#     KEYWORDS (STRICT ATS FILTER)
#     - Include ONLY:
#     ✔ Job titles (e.g., Software Engineer, Data Scientist)
#     ✔ Core technical skills
#     ✔ Frameworks
#     ✔ Methodologies (Agile, Scrum, DevOps)

#     - MUST NOT include:
#     ❌ Colleges
#     ❌ Degrees
#     ❌ Locations
#     ❌ Platforms (CodeChef, HackerRank, etc.)
#     ❌ Education terms

#     Keywords must be searchable professional terms used by recruiters.

#     ====================
#     OUTPUT JSON SCHEMA (DO NOT CHANGE)
#     ====================

#     {
#     "name": {
#         "first": "",
#         "middle": "",
#         "last": ""
#     },
#     "contact": {
#         "email": "",
#         "phone": "",
#         "location": "",
#         "links": []
#     },
#     "skills": [],
#     "experience": [
#         {
#         "job_title": "",
#         "company": "",
#         "location": "",
#         "start_date": "",
#         "end_date": "",
#         "description": []
#         }
#     ],
#     "education": [
#         {
#         "degree": "",
#         "field_of_study": "",
#         "institution": "",
#         "start_year": "",
#         "end_year": ""
#         }
#     ],
#     "projects": [
#         {
#         "name": "",
#         "description": "",
#         "technologies": []
#         }
#     ],
#     "certifications": [],
#     "languages_known": [],
#     "keywords": [],
#     "metadata": {
#         "last_updated": ""
#     }
#     }

#     ====================
#     METADATA RULE
#     ====================

#     - last_updated must be today’s date in YYYY-MM-DD format
#     <<RAW_RESUME_TEXT>>
#     """
#     prompt = PROMPT_TEMPLATE.replace('<<RAW_RESUME_TEXT>>', raw_text)

#     # Call Gemini API
#     import os
#     import requests
#     api_url = getattr(settings, 'GEMINI_API_URL', os.getenv('GEMINI_API_URL'))
#     api_key = getattr(settings, 'GEMINI_API_KEY', os.getenv('GEMINI_API_KEY'))
#     if not api_url or not api_key:
#         return Response({'error': 'Gemini API not configured'}, status=500)
#     headers = {'Authorization': f'Bearer {api_key}'}
#     payload = {
#         "model": "mistralai/devstral-2512:free",
#         "messages": [
#             {"role": "user", "content": prompt}
#         ]
#     }
#     try:
#         send_url = api_url
#         if 'openrouter.ai' in api_url and not api_url.rstrip('/').endswith('/chat/completions'):
#             send_url = api_url.rstrip('/') + '/chat/completions'
#         resp = requests.post(send_url, json=payload, headers=headers, timeout=120)
#         resp.raise_for_status()
#         resp_json = resp.json()
#         output_text = None
#         if isinstance(resp_json, dict):
#             if 'choices' in resp_json and isinstance(resp_json['choices'], list) and resp_json['choices']:
#                 choice = resp_json['choices'][0]
#                 if 'message' in choice and 'content' in choice['message']:
#                     output_text = choice['message']['content']
#         if output_text is None:
#             output_text = json.dumps(resp_json)
#         # Try to parse JSON
#         try:
#             parsed = json.loads(output_text)
#         except Exception:
#             parsed = {"resume_text": output_text}
#     except Exception as e:
#         return Response({'error': 'Gemini API call failed', 'detail': str(e)}, status=502)

#     # Update user profile
#     try:
#         profile = UserProfile.objects.get(user_id=user_id)
#         profile.resume_text = json.dumps(parsed)
#         profile.save()
#     except UserProfile.DoesNotExist:
#         return Response({'error': 'User profile not found'}, status=status.HTTP_404_NOT_FOUND)

#     return Response({'success': True, 'resume_json': parsed})
# from rest_framework import viewsets
# from django_filters.rest_framework import DjangoFilterBackend
# from .models import UserCredentials, UserProfile, UserSkills, UserApplication
# from .serializers import (
#     UserCredentialsSerializer,
#     UserProfileSerializer,
#     UserSkillsSerializer,
#     UserApplicationSerializer
# )

# class UserCredentialsViewSet(viewsets.ModelViewSet):
#     queryset = UserCredentials.objects.all()
#     serializer_class = UserCredentialsSerializer
#     filter_backends = [DjangoFilterBackend]
#     filterset_fields = ['email']

# class UserProfileViewSet(viewsets.ModelViewSet):
#     queryset = UserProfile.objects.all()
#     serializer_class = UserProfileSerializer

# class UserSkillsViewSet(viewsets.ModelViewSet):
#     queryset = UserSkills.objects.all()
#     serializer_class = UserSkillsSerializer

# class UserApplicationViewSet(viewsets.ModelViewSet):
#     queryset = UserApplication.objects.all()
#     serializer_class = UserApplicationSerializer




from rest_framework.decorators import api_view, parser_classes, action
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status, viewsets
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from django.conf import settings

import json
import requests
import io
import os
import pdfplumber
from datetime import date

from user.ats_engine import compute_from_parsed
from user.models import UserProfile, UserCredentials, UserSkills, UserApplication
from company.models import CompanyJobDescription
from .serializers import (
    UserCredentialsSerializer,
    UserProfileSerializer,
    UserSkillsSerializer,
    UserApplicationSerializer
)

# --------------------------------------------------
# SAFE JSON EXTRACTOR (🔥 CRITICAL)
# --------------------------------------------------
def extract_resume_json(text: str) -> dict:
    try:
        text = text.replace("```json", "").replace("```", "").strip()
        data = json.loads(text)

        if isinstance(data, dict) and "resume_text" in data:
            inner = data["resume_text"]
            if isinstance(inner, str):
                return json.loads(inner)

        return data if isinstance(data, dict) else {}
    except Exception:
        return {}

# --------------------------------------------------
# RESUME UPLOAD API (✅ FIXED & STABLE)
# --------------------------------------------------
@api_view(["POST"])
@parser_classes([MultiPartParser, FormParser])
def upload_resume(request):
    file = request.FILES.get("resume")
    user_id = request.POST.get("user_id")

    if not file or not user_id:
        return Response(
            {"error": "resume and user_id required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # ---------- PDF TEXT EXTRACTION ----------
    try:
        with pdfplumber.open(io.BytesIO(file.read())) as pdf:
            raw_text = "\n".join(page.extract_text() or "" for page in pdf.pages)
    except Exception as e:
        return Response(
            {"error": "PDF extraction failed", "detail": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    # ---------- PROMPT ----------
    PROMPT_TEMPLATE = """
    You are a Senior Corporate Recruiter and a Resume Intelligence Engine.

    Your task is to deeply understand the provided resume text and convert all meaningful information into a structured JSON object.
    You must read and reason through the resume like a human recruiter, not perform shallow keyword extraction.

    ====================
    CORE EXTRACTION RULES
    ====================

    1. Understand the resume line-by-line and section-by-section.
    2. Extract ALL meaningful information even if formatting is poor or informal.
    3. Do NOT hallucinate, infer, or fabricate information.
    4. If a value is missing:
    - Use "" for text fields
    - Use [] for list fields
    5. Normalize extracted values for consistency.
    6. Output ONLY valid JSON. No explanations. No markdown.

    ====================
    CRITICAL SEPARATION RULES (VERY IMPORTANT)
    ====================

    You MUST STRICTLY separate information by category.

    🚫 The following MUST NEVER appear in:
    - skills
    - keywords

    ❌ Degrees (B.Tech, Bachelor, Intermediate, MPC, etc.)
    ❌ College / University names
    ❌ School names
    ❌ Education boards
    ❌ Locations (cities, states, countries)
    ❌ Platforms (CodeChef, HackerRank, LeetCode, GitHub)
    ❌ Job levels like "fresher", "student", "volunteer"
    ❌ Generic words like "training", "coursework", "learning"

    If any of the above are found:
    ✔ Place them ONLY in education, contact, or experience
    ❌ NEVER place them in skills or keywords

    Violation of this rule is considered an extraction error.

    ====================
    NORMALIZATION RULES (MANDATORY)
    ====================

    Normalize synonymous and abbreviated technical terms.

    Examples:
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
    - rdbms / sql db → SQL
    - nosql db → NoSQL
    - aws cloud → AWS

    Remove duplicates AFTER normalization.

    ====================
    SECTION-SPECIFIC RULES
    ====================

    NAME
    - Split full names into first, middle, last intelligently.

    CONTACT
    - Extract email, phone, location, links.
    - Normalize phone numbers.
    - Extract URLs (LinkedIn, GitHub, Portfolio).

    SKILLS (TECHNICAL ONLY)
    - Include ONLY:
    ✔ Programming languages
    ✔ Frameworks
    ✔ Libraries
    ✔ Databases
    ✔ Cloud & DevOps tools
    ✔ Core CS concepts (DSA, OOP, OS, DBMS)
    ✔ AI/ML techniques

    - Convert descriptions into atomic skills.
    - Exclude:
    ❌ Education terms
    ❌ Institutions
    ❌ Platforms
    ❌ Soft skills

    EXPERIENCE
    - Extract job roles, companies, dates, responsibilities.
    - Convert paragraphs into concise bullet points.
    - Extract tools/technologies used (but do NOT duplicate education data).

    EDUCATION
    - Extract degrees, field of study, institutions, years.
    - Education-related terms MUST stay here only.

    PROJECTS
    - Extract project name, purpose, technologies used.
    - Projects embedded in experience must still be extracted.

    CERTIFICATIONS
    - Extract certifications and providers only.

    LANGUAGES KNOWN
    - Spoken human languages ONLY.
    - NEVER include programming languages here.

    KEYWORDS (STRICT ATS FILTER)
    - Include ONLY:
    ✔ Job titles (e.g., Software Engineer, Data Scientist)
    ✔ Core technical skills
    ✔ Frameworks
    ✔ Methodologies (Agile, Scrum, DevOps)

    - MUST NOT include:
    ❌ Colleges
    ❌ Degrees
    ❌ Locations
    ❌ Platforms (CodeChef, HackerRank, etc.)
    ❌ Education terms

    Keywords must be searchable professional terms used by recruiters.

    ====================
    OUTPUT JSON SCHEMA (DO NOT CHANGE)
    ====================

    {
    "name": {
        "first": "",
        "middle": "",
        "last": ""
    },
    "contact": {
        "email": "",
        "phone": "",
        "location": "",
        "links": []
    },
    "skills": [],
    "experience": [
        {
        "job_title": "",
        "company": "",
        "location": "",
        "start_date": "",
        "end_date": "",
        "description": []
        }
    ],
    "education": [
        {
        "degree": "",
        "field_of_study": "",
        "institution": "",
        "start_year": "",
        "end_year": ""
        }
    ],
    "projects": [
        {
        "name": "",
        "description": "",
        "technologies": []
        }
    ],
    "certifications": [],
    "languages_known": [],
    "keywords": [],
    "metadata": {
        "last_updated": ""
    }
    }

    ====================
    METADATA RULE
    ====================

    - last_updated must be today’s date in YYYY-MM-DD format
    <<RAW_RESUME_TEXT>>
    """

    prompt = PROMPT_TEMPLATE.replace("<<RAW_RESUME_TEXT>>", raw_text)

    # ---------- LLM CONFIG ----------
    api_url = getattr(settings, "GEMINI_API_URL", os.getenv("GEMINI_API_URL"))
    api_key = getattr(settings, "GEMINI_API_KEY", os.getenv("GEMINI_API_KEY"))

    if not api_url or not api_key:
        return Response({"error": "LLM config missing"}, status=500)

    if "openrouter.ai" in api_url and not api_url.endswith("/chat/completions"):
        api_url = api_url.rstrip("/") + "/chat/completions"

    headers = {"Authorization": f"Bearer {api_key}"}
    payload = {
        "model": "mistralai/devstral-2512:free",
        "messages": [{"role": "user", "content": prompt}]
    }

    # ---------- LLM CALL ----------
    try:
        resp = requests.post(api_url, json=payload, headers=headers, timeout=120)
        resp.raise_for_status()
        llm_json = resp.json()
        output_text = llm_json["choices"][0]["message"]["content"]
    except Exception as e:
        return Response(
            {"error": "LLM request failed", "detail": str(e)},
            status=status.HTTP_502_BAD_GATEWAY
        )

    parsed = extract_resume_json(output_text)
    if not parsed:
        return Response({"error": "Invalid JSON from LLM"}, status=500)

    parsed.setdefault("metadata", {})
    parsed["metadata"]["last_updated"] = date.today().isoformat()

    # ---------- SAVE PROFILE (🔥 FIXED: NO DUPLICATES) ----------
    profile, _ = UserProfile.objects.get_or_create(
        user_id=user_id
    )
    profile.resume_text = json.dumps(parsed)
    profile.save()

    return Response(
        {"success": True, "resume_json": parsed},
        status=status.HTTP_200_OK
    )

# --------------------------------------------------
# VIEWSETS
# --------------------------------------------------
class UserCredentialsViewSet(viewsets.ModelViewSet):
    queryset = UserCredentials.objects.all()
    serializer_class = UserCredentialsSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["email"]

class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    lookup_field = "user_id"   # 🔥 IMPORTANT

class UserSkillsViewSet(viewsets.ModelViewSet):
    queryset = UserSkills.objects.all()
    serializer_class = UserSkillsSerializer

class UserApplicationViewSet(viewsets.ModelViewSet):
    queryset = UserApplication.objects.all()
    serializer_class = UserApplicationSerializer

    @action(detail=False, methods=["post"], url_path="prepare-ats")
    def prepare_ats(self, request):
        user_id = request.data.get("user_id")
        job_id = request.data.get("job_id")

        if not user_id or not job_id:
            return Response(
                {"error": "user_id and job_id required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        profile = get_object_or_404(UserProfile, user_id=user_id)
        resume_data = extract_resume_json(profile.resume_text)

        resume_keywords = resume_data.get("keywords") or resume_data.get("skills") or []

        job = get_object_or_404(CompanyJobDescription, job_id=job_id)
        required_skills = (
            [s.strip() for s in job.skills.split(",") if s.strip()]
            if job.skills else []
        )

        ats_result = compute_from_parsed(
            parsed={"keywords": resume_keywords},
            required_skills_input=required_skills,
            user_experience=0,
            required_experience=int(job.experience_level or 0),
            job_role=job.job_title,
            prev_role=""
        )

        application, _ = UserApplication.objects.get_or_create(
            user_id=user_id,
            job_id=job_id,
            defaults={
                "application_status": "applied",
                "ats_score": ats_result["ats_score"]
            }
        )

        application.ats_score = ats_result["ats_score"]
        application.save()

        return Response({
            "application_id": application.application_id,
            "ats_score": ats_result["ats_score"],
            "application_status": application.application_status,
        })
