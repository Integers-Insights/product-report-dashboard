import boto3
import os
from botocore.exceptions import ClientError
from dotenv import load_dotenv
load_dotenv()

async def send_verification_email(email: str, token: str):
    try:
        # ─────────────────────────────────────
        # 1️⃣ ENV VALIDATION
        # ─────────────────────────────────────
        AWS_REGION = os.getenv("AWS_REGION")
        AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
        AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
        SMTP_USER = os.getenv("SMTP_USER")
        APP_DOMAIN = os.getenv("APP_DOMAIN")

        if not all([AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, SMTP_USER]):
            print("EMAIL ERROR: Missing environment variables")
            return   # ❗ Don't raise → background task safe

        verification_link = f"{APP_DOMAIN}/verify-email?token={token}"

        # ─────────────────────────────────────
        # 2️⃣ SES CLIENT
        # ─────────────────────────────────────
        ses = boto3.client(
            "ses",
            region_name=AWS_REGION,
            aws_access_key_id=AWS_ACCESS_KEY_ID,
            aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        )

        # ─────────────────────────────────────
        # 3️⃣ EMAIL BODY
        # ─────────────────────────────────────
        html_body = f"""
        <html>
        <body style="font-family: Arial, sans-serif; background:#f5f7fa; padding:20px;">
        <div style="max-width:500px;margin:auto;background:#ffffff;padding:30px;border-radius:10px">
            <h2 style="color:#0F172A;">Verify your email</h2>

            <p>Hello,</p>

            <p>
            Thank you for signing up. Please confirm your email address by clicking below.
            </p>

            <div style="text-align:center;margin:30px 0;">
                <a href="{verification_link}"
                style="background:#0284c7;color:white;padding:12px 24px;
                text-decoration:none;border-radius:6px;font-weight:bold;">
                Verify Email
                </a>
            </div>

            <p>If button doesn't work:</p>
            <a href="{verification_link}">{verification_link}</a>

            <p style="font-size:12px;color:#64748B;margin-top:30px;">
            This link expires in 12 hours.
            </p>
        </div>
        </body>
        </html>
        """

        text_body = f"""
        Verify your email:

        {verification_link}

        Link expires in 12 hours.
        """

        # ─────────────────────────────────────
        # 4️⃣ SEND EMAIL
        # ─────────────────────────────────────
        response = ses.send_email(
            Source=SMTP_USER,
            Destination={"ToAddresses": [email]},
            Message={
                "Subject": {"Data": "Verify your account"},
                "Body": {
                    "Html": {"Data": html_body},
                    "Text": {"Data": text_body},
                },
            },
        )

        print(f"✅ Email sent to {email} | MessageId: {response.get('MessageId')}")

    except ClientError as e:
        print(f"❌ SES ClientError: {e.response['Error']['Message']}")

    except Exception as e:
        print(f"❌ EMAIL FAILED (unexpected): {str(e)}")