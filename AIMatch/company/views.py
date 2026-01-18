from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.apps import apps

from .models import CompanyJobDescription, JobApplicant, Shortlist
from .serializers import ShortlistSerializer

@api_view(['POST'])
@permission_classes([IsAuthenticated]) # Or appropriate permission for company users
def send_shortlist_emails_view(request):
    print(f"DEBUG: Incoming request data: {request.data}")
    
    applicant_ids = request.data.get('applicant_ids')

    # Handle single 'applicant_id' for backward compatibility
    if applicant_ids is None:
        applicant_id = request.data.get('applicant_id')
        if applicant_id:
            applicant_ids = [applicant_id]
        else:
            return Response({"error": "applicant_ids (list) or applicant_id is required."}, status=status.HTTP_400_BAD_REQUEST)
    
    if not isinstance(applicant_ids, list):
        return Response({"error": "applicant_ids must be a list."}, status=status.HTTP_400_BAD_REQUEST)

    UserCredentials = apps.get_model('user', 'UserCredentials')
    
    results = []

    from django.db import transaction

    for applicant_id in applicant_ids:
        result = {"applicant_id": applicant_id, "status": "failed", "message": ""}
        
        try:
            with transaction.atomic():
                try:
                    applicant = JobApplicant.objects.get(applicant_id=applicant_id)
                except JobApplicant.DoesNotExist:
                    result["message"] = "Applicant not found."
                    results.append(result)
                    continue

                # --- Update JobApplicant status regardless of UserCredentials ---
                # We do this first so it reflects in the dashboard even if the user isn't registered
                applicant.status = 'Shortlisted'
                applicant.save()

                # --- Find UserCredentials based on applicant's email (Case Insensitive) ---
                user_credential = UserCredentials.objects.filter(email__iexact=applicant.email).first()
                
                if not user_credential:
                    print(f"DEBUG: UserCredentials not found for email: {applicant.email}. Applicant marked as Shortlisted.")
                    result["message"] = f"Applicant marked as Shortlisted, but no registered user account found for email: {applicant.email}. Shortlist entry skipped."
                    result["status"] = "success" # Considered success for the dashboard update
                    results.append(result)
                    continue

                job = applicant.job 

                # Check if already shortlisted
                if Shortlist.objects.filter(user=user_credential, job=job).exists():
                    result["status"] = "success"
                    result["message"] = "User is already shortlisted for this job."
                    results.append(result)
                    continue

                # Create Shortlist Entry
                data = {'user': user_credential.pk, 'job': job.pk}
                serializer = ShortlistSerializer(data=data)

                if serializer.is_valid():
                    serializer.save()
                    
                    # TODO: Implement email sending logic here
                    print(f"DEBUG: Shortlisted applicant {applicant_id} (User: {user_credential.user_id}) for job {job.job_id}.")
                    result["status"] = "success"
                    result["data"] = serializer.data
                else:
                    print(f"DEBUG: ShortlistSerializer errors: {serializer.errors}")
                    # If Shortlist creation fails, should we revert the Applicant status update?
                    # Probably yes, to keep things consistent. But the user complained about data not updating.
                    # Let's revert if it's a code/data error, but if it's just missing user, we already handled that.
                    # Since we are in transaction.atomic(), raising an exception would rollback.
                    result["message"] = f"Failed to create Shortlist entry: {str(serializer.errors)}"
                    result["status"] = "failed"
                    # To rollback the applicant.status change:
                    raise Exception(f"Shortlist serializer error: {serializer.errors}")
                    
        except Exception as e:
            print(f"DEBUG: Exception processing applicant {applicant_id}: {str(e)}")
            result["message"] = f"Internal error: {str(e)}"
        
        results.append(result)

    # Return 200 with results list
    return Response(results, status=status.HTTP_200_OK)
