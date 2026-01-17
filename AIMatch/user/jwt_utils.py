import json
import hmac
import hashlib
import base64
from django.conf import settings
from datetime import datetime, timedelta

def urlsafe_b64encode(data):
    """Encodes data to Base64URL without padding."""
    return base64.urlsafe_b64encode(data).rstrip(b'=')

def generate_jwt(payload):
    """Generates a HS256 JWT token."""
    header = {"alg": "HS256", "typ": "JWT"}
    
    # Ensure expiration
    if 'exp' not in payload:
        # Default 1 day expiration
        payload['exp'] = int((datetime.utcnow() + timedelta(days=1)).timestamp())
        
    header_json = json.dumps(header, separators=(',', ':')).encode('utf-8')
    payload_json = json.dumps(payload, separators=(',', ':')).encode('utf-8')
    
    header_b64 = urlsafe_b64encode(header_json)
    payload_b64 = urlsafe_b64encode(payload_json)
    
    signature_input = header_b64 + b'.' + payload_b64
    signature = hmac.new(
        settings.SECRET_KEY.encode('utf-8'),
        signature_input,
        hashlib.sha256
    ).digest()
    
    signature_b64 = urlsafe_b64encode(signature)
    
    return (header_b64 + b'.' + payload_b64 + b'.' + signature_b64).decode('utf-8')

def decode_jwt(token):
    """Decodes and verifies a HS256 JWT token."""
    try:
        parts = token.split('.')
        if len(parts) != 3:
            return None
            
        header_b64, payload_b64, signature_b64 = [p.encode('utf-8') for p in parts]
        
        # Verify signature
        signature_input = header_b64 + b'.' + payload_b64
        expected_signature = hmac.new(
            settings.SECRET_KEY.encode('utf-8'),
            signature_input,
            hashlib.sha256
        ).digest()
        
        if not hmac.compare_digest(urlsafe_b64encode(expected_signature), signature_b64):
            return None
            
        # Decode payload
        # Add padding back if needed for standard b64 decode, 
        # though urlsafe_b64decode handles missing padding in some versions, 
        # manual padding is safer.
        rem = len(payload_b64) % 4
        if rem > 0:
            payload_b64 += b'=' * (4 - rem)
            
        payload_json = base64.urlsafe_b64decode(payload_b64)
        payload = json.loads(payload_json)
        
        # Check expiration
        if 'exp' in payload:
            if datetime.utcnow().timestamp() > payload['exp']:
                return None # Expired
                
        return payload
    except Exception:
        return None
