from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

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

from user.models import UserApplication, UserProfile, UserCredentials


# -------------------------------------------------
# COMPANY AUTH / PROFILE / JOBS (UNCHANGED)
# -------------------------------------------------

class CompanyCredentialsViewSet(viewsets.ModelViewSet):
    queryset = CompanyCredentials.objects.all()
    serializer_class = CompanyCredentialsSerializer


class CompanyProfileViewSet(viewsets.ModelViewSet):
    queryset = CompanyProfile.objects.all()
    serializer_class = CompanyProfileSerializer


class CompanyJobDescriptionViewSet(viewsets.ModelViewSet):
    queryset = CompanyJobDescription.objects.all()
    serializer_class = CompanyJobDescriptionSerializer


class JobRequiredSkillsViewSet(viewsets.ModelViewSet):
    queryset = JobRequiredSkills.objects.all()
    serializer_class = JobRequiredSkillsSerializer


# -------------------------------------------------
# 🔥 COMPANY → JOB APPLICANTS (READ FROM user_application)
# -------------------------------------------------

@api_view(["GET"])
def get_job_applicants(request, job_id):
    """
    Company dashboard:
    Fetch all users who applied for a given job_id
    """

    # 1️⃣ Validate job exists
    try:
        CompanyJobDescription.objects.get(job_id=job_id)
    except CompanyJobDescription.DoesNotExist:
        return Response(
            {"error": "Job not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    # 2️⃣ Fetch applications
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
