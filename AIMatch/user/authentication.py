from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from .jwt_utils import decode_jwt
from .models import UserCredentials
from company.models import CompanyCredentials

class JWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get('Authorization')
        
        if not auth_header:
            return None # No header, let AllowAny or other checks handle it
            
        try:
            # Header format: "Bearer <token>"
            prefix, token = auth_header.split(' ')
            if prefix.lower() != 'bearer':
                return None
        except ValueError:
            return None
            
        payload = decode_jwt(token)
        
        if not payload:
            raise AuthenticationFailed('Invalid or expired token')
            
        # Determine if User or Company
        # We return a tuple (user_obj, auth_token)
        
        try:
            if payload.get('role') == 'company':
                company = CompanyCredentials.objects.get(company_id=payload['company_id'])
                return (company, token)
            else:
                user = UserCredentials.objects.get(user_id=payload['user_id'])
                return (user, token)
        except Exception:
            raise AuthenticationFailed('User not found')
