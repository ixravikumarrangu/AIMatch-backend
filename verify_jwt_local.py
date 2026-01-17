
import os
import sys
import django
from django.conf import settings

# Setup Django standalone
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'AIMatch.settings')
django.setup()

from user.jwt_utils import generate_jwt, decode_jwt

print(f"SECRET_KEY being used: {settings.SECRET_KEY[:5]}... (masked)")

payload = {"user_id": 123, "email": "test@example.com", "role": "user"}
token = generate_jwt(payload)
print(f"Generated Token: {token}")

decoded = decode_jwt(token)
print(f"Decoded Payload: {decoded}")

if decoded and decoded['user_id'] == 123:
    print("SUCCESS: Token generated and verified correctly.")
else:
    print("FAILURE: Token verification failed.")
