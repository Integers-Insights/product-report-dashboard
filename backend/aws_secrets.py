import boto3
import json
import os

def load_secrets(secret_name="intrade24/prod", region="eu-north-1"):
    """Load secrets from AWS Secrets Manager into environment variables."""
    try:
        client = boto3.client("secretsmanager", region_name=region)
        response = client.get_secret_value(SecretId=secret_name)
        secrets = json.loads(response["SecretString"])

        for key, value in secrets.items():
            if not os.environ.get(key):
                os.environ[key] = str(value)

        print(f"✅ Secrets loaded from AWS Secrets Manager")
        return secrets

    except Exception as e:
        print(f"⚠️ Failed to load secrets from AWS: {e}")
        # fallback to .env for local development
        from dotenv import load_dotenv
        load_dotenv()
        print("✅ Loaded from .env fallback")