from company.models import CompanyCredentials
import hashlib

def fix_company_passwords():
    updated = 0
    for cred in CompanyCredentials.objects.all():
        if cred.password_hash and (len(cred.password_hash) != 64 or not all(c in '0123456789abcdef' for c in cred.password_hash.lower())):
            cred.password_hash = hashlib.sha256(cred.password_hash.encode('utf-8')).hexdigest()
            cred.save()
            updated += 1
    print(f"Updated {updated} company credentials to hashed passwords.")

if __name__ == "__main__":
    fix_company_passwords()
