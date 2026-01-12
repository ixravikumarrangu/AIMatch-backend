from rest_framework import serializers
from .models import UserCredentials, UserProfile, UserSkills, UserApplication

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
    class Meta:
        model = UserApplication
        fields = '__all__'
