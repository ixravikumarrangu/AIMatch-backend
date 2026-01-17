from rest_framework import serializers
from .models import UserCredentials, UserProfile, UserSkills, UserApplication
from company.models import CompanyJobDescription, CompanyProfile # Import from company app

class UserCredentialsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCredentials
        fields = '__all__'

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'

class UserSkillsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSkills
        fields = '__all__'

class UserApplicationSerializer(serializers.ModelSerializer):
    job_details = serializers.SerializerMethodField()
    user_name = serializers.SerializerMethodField()
    user_email = serializers.SerializerMethodField()

    class Meta:
        model = UserApplication
        fields = '__all__'
        read_only_fields = ['user', 'job', 'applied_at']

    def get_job_details(self, obj):
        job = obj.job # This is a CompanyJobDescription instance
        company_name = None
        try:
            if hasattr(job.company, 'companyprofile'):
                company_name = job.company.companyprofile.company_name
        except CompanyProfile.DoesNotExist:
            pass # Handle case where profile might not exist

        return {
            'job_id': job.job_id,
            'job_title': job.job_title,
            'location': job.location,
            'salary': job.salary,
            'company_name': company_name,
        }
    
    def get_user_name(self, obj):
        # Access userprofile through the user relationship
        if hasattr(obj.user, 'userprofile'):
            return obj.user.userprofile.name
        return None

    def get_user_email(self, obj):
        return obj.user.email # UserCredentials has email

