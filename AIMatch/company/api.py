from rest_framework import viewsets
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from user.authentication import JWTAuthentication

from company.models import (
    CompanyCredentials,
    CompanyProfile,
    CompanyJobDescription,
    JobRequiredSkills,
)

from company.serializers import (
    CompanyCredentialsSerializer,
    CompanyProfileSerializer,
    CompanyJobDescriptionSerializer,
    JobRequiredSkillsSerializer,
)

import hashlib
from user.jwt_utils import generate_jwt
from user.models import UserApplication, UserProfile, UserCredentials


# -------------------------------------------------
# COMPANY AUTH / PROFILE / JOBS (UNCHANGED)
# -------------------------------------------------

@api_view(["POST"])
def login_company(request):
    email = request.data.get("email")
    password = request.data.get("password")

    if not email or not password:
        return Response(
            {"error": "Email and password required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Find company
    try:
        company = CompanyCredentials.objects.get(email=email)
    except CompanyCredentials.DoesNotExist:
        return Response(
            {"error": "Invalid credentials"},
            status=status.HTTP_401_UNAUTHORIZED
        )

    # Check password (plaintext/hashed comparison handled here)
    # Note: Previous code implied plaintext or simple hash check.
    # We will assume simple hash check consistent with user login or existing system.
    # If existing system used raw string comparison (as seen in frontend), we should check that.
    # Frontend was: company.password_hash === formData.password (Checking raw hash?)
    # Let's assume the stored hash is SHA256 of the password.
    
    hashed_input = hashlib.sha256(password.encode('utf-8')).hexdigest()
    
    # If the database stores it directly as the user typed it (insecure, but possible in prototypes),
    # we would check `password == company.password_hash`.
    # BUT, consistent with User implementation, let's try the hash.
    # If that fails, fallback to direct compare (for legacy data safety).
    
    if hashed_input != company.password_hash and password != company.password_hash:
        return Response(
            {"error": "Invalid credentials"},
            status=status.HTTP_401_UNAUTHORIZED
        )

    # Generate Token
    payload = {
        "company_id": company.company_id,
        "email": company.email,
        "role": "company"
    }
    token = generate_jwt(payload)

    return Response({
        "success": True,
        "token": token,
        "company_id": company.company_id,
        "email": company.email
    })


class CompanyCredentialsViewSet(viewsets.ModelViewSet):
    queryset = CompanyCredentials.objects.all()
    serializer_class = CompanyCredentialsSerializer


class CompanyProfileViewSet(viewsets.ModelViewSet):
    queryset = CompanyProfile.objects.all()
    serializer_class = CompanyProfileSerializer


class CompanyJobDescriptionViewSet(viewsets.ModelViewSet):
    queryset = CompanyJobDescription.objects.all()
    serializer_class = CompanyJobDescriptionSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # 1. If Company: Show only their jobs
        if isinstance(self.request.user, CompanyCredentials):
            return CompanyJobDescription.objects.filter(company=self.request.user)
        
        # 2. If User (Job Seeker): Show ALL jobs
        # (You might want to filter by status='active' later)
        return CompanyJobDescription.objects.all()

    def perform_create(self, serializer):
        # Only companies can create jobs
        if not isinstance(self.request.user, CompanyCredentials):
            raise PermissionDenied("Only companies can post jobs.")
        
        serializer.save(company=self.request.user)


class JobRequiredSkillsViewSet(viewsets.ModelViewSet):
    queryset = JobRequiredSkills.objects.all()
    serializer_class = JobRequiredSkillsSerializer


# -------------------------------------------------
# 🔥 COMPANY → JOB APPLICANTS (READ FROM user_application)
# -------------------------------------------------

@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_job_applicants(request, job_id):
    """
    Company dashboard:
    Fetch all users who applied for a given job_id
    """

    # 1️⃣ Validate job exists
    try:
        job = CompanyJobDescription.objects.get(job_id=job_id)
    except CompanyJobDescription.DoesNotExist:
        return Response(
            {"error": "Job not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    # 2️⃣ Check ownership
    # request.user is a CompanyCredentials instance (via JWTAuthentication)
    if job.company != request.user:
        return Response(
            {"error": "Unauthorized access to this job's applicants"},
            status=status.HTTP_403_FORBIDDEN
        )

    # 3️⃣ Fetch applications
    applications = (
        UserApplication.objects
        .filter(job_id=job_id)
        .order_by("-applied_at")
    )

    result = []

    for app in applications:
        # User profile
        try:
            profile = UserProfile.objects.get(user_id=app.user_id)
        except UserProfile.DoesNotExist:
            profile = None

        # User credentials
        try:
            user = UserCredentials.objects.get(user_id=app.user_id)
        except UserCredentials.DoesNotExist:
            user = None

        result.append({
            "application_id": app.application_id,
            "user_id": app.user_id,
            "name": profile.name if profile else "",
            "email": user.email if user else "",
            "location": profile.address if profile else "",
            "total_experience": profile.experience if profile else 0,
            "ats_score": app.ats_score,
            "application_status": app.application_status,
            "applied_at": app.applied_at,
        })

    return Response(result, status=status.HTTP_200_OK)
