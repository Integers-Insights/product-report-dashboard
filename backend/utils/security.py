import re
import bcrypt
from passlib.context import CryptContext
import requests

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """
    Hash a password using bcrypt.
    Truncates passwords longer than 72 bytes to avoid bcrypt limitations.
    """
    # bcrypt has a 72-byte limit, truncate if necessary
    if len(password.encode('utf-8')) > 72:
        password = password.encode('utf-8')[:72].decode('utf-8', errors='ignore')
    
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain password against a hashed password.
    """
    # Handle truncated passwords for verification too
    if len(plain_password.encode('utf-8')) > 72:
        plain_password = plain_password.encode('utf-8')[:72].decode('utf-8', errors='ignore')
    
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def generate_slug(name: str) -> str:
    """
    Converts company name into URL-friendly slug.
    Example:
    "PQR Pvt Ltd" -> "pqr-pvt-ltd"
    """

    # Lowercase
    slug = name.lower()

    # Replace non-alphanumeric with hyphen
    slug = re.sub(r'[^a-z0-9]+', '-', slug)

    # Remove leading/trailing hyphens
    slug = slug.strip('-')

    return slug

def get_public_ip():

    try:
        response = requests.get(
            "https://api64.ipify.org?format=json",
            timeout=3
        ).json()

        return response.get("ip")

    except:
        return None