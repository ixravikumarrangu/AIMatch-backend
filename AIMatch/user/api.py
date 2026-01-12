
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
import json
from django.conf import settings
from .models import UserProfile, UserCredentials

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def upload_resume(request):
    file = request.FILES.get('resume')
    user_id = request.POST.get('user_id')
    if not file or not user_id:
        return Response({'error': 'Missing file or user_id'}, status=status.HTTP_400_BAD_REQUEST)

    # Extract text from PDF using pdfplumber only
    try:
        import pdfplumber
        import io
        with pdfplumber.open(io.BytesIO(file.read())) as pdf:
            raw_text = "\n".join(page.extract_text() or '' for page in pdf.pages)
    except Exception as e:
        return Response({'error': 'Text extraction failed', 'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Compose Gemini prompt (use your provided template)
    PROMPT_TEMPLATE = """
    You are a Senior Corporate Recruiter and a Resume Intelligence Engine.\n\nYour task is to deeply understand the provided resume text and convert all meaningful information into a structured JSON object.\nYou must read and reason through the resume like a human recruiter, not perform shallow keyword extraction.\n...\n<<RAW_RESUME_TEXT>>\n"""
    prompt = PROMPT_TEMPLATE.replace('<<RAW_RESUME_TEXT>>', raw_text)

    # Call Gemini API
    import os
    import requests
    api_url = getattr(settings, 'GEMINI_API_URL', os.getenv('GEMINI_API_URL'))
    api_key = getattr(settings, 'GEMINI_API_KEY', os.getenv('GEMINI_API_KEY'))
    if not api_url or not api_key:
        return Response({'error': 'Gemini API not configured'}, status=500)
    headers = {'Authorization': f'Bearer {api_key}'}
    payload = {
        "model": "mistralai/devstral-2512:free",
        "messages": [
            {"role": "user", "content": prompt}
        ]
    }
    try:
        send_url = api_url
        if 'openrouter.ai' in api_url and not api_url.rstrip('/').endswith('/chat/completions'):
            send_url = api_url.rstrip('/') + '/chat/completions'
        resp = requests.post(send_url, json=payload, headers=headers, timeout=120)
        resp.raise_for_status()
        resp_json = resp.json()
        output_text = None
        if isinstance(resp_json, dict):
            if 'choices' in resp_json and isinstance(resp_json['choices'], list) and resp_json['choices']:
                choice = resp_json['choices'][0]
                if 'message' in choice and 'content' in choice['message']:
                    output_text = choice['message']['content']
        if output_text is None:
            output_text = json.dumps(resp_json)
        # Try to parse JSON
        try:
            parsed = json.loads(output_text)
        except Exception:
            parsed = {"resume_text": output_text}
    except Exception as e:
        return Response({'error': 'Gemini API call failed', 'detail': str(e)}, status=502)

    # Update user profile
    try:
        profile = UserProfile.objects.get(user_id=user_id)
        profile.resume_text = json.dumps(parsed)
        profile.save()
    except UserProfile.DoesNotExist:
        return Response({'error': 'User profile not found'}, status=status.HTTP_404_NOT_FOUND)

    return Response({'success': True, 'resume_json': parsed})
from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from .models import UserCredentials, UserProfile, UserSkills, UserApplication
from .serializers import (
    UserCredentialsSerializer,
    UserProfileSerializer,
    UserSkillsSerializer,
    UserApplicationSerializer
)

class UserCredentialsViewSet(viewsets.ModelViewSet):
    queryset = UserCredentials.objects.all()
    serializer_class = UserCredentialsSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['email']

class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer

class UserSkillsViewSet(viewsets.ModelViewSet):
    queryset = UserSkills.objects.all()
    serializer_class = UserSkillsSerializer

class UserApplicationViewSet(viewsets.ModelViewSet):
    queryset = UserApplication.objects.all()
    serializer_class = UserApplicationSerializer
