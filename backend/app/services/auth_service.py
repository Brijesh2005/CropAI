import os
import sqlite3
import hashlib
import hmac
import base64
import json
import secrets
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Optional, Dict, Any, Tuple

from ..core.config import BASE_DIR

DB_DIR = BASE_DIR / "data"
DB_DIR.mkdir(parents=True, exist_ok=True)
DB_PATH = DB_DIR / "users.db"

SECRET_KEY = os.getenv("TERRAVISION_AUTH_SECRET", "terravision-dakshina-kannada-secret-key-2026")

class AuthService:
    def __init__(self, db_path: Path = DB_PATH):
        self.db_path = db_path
        self._init_db()

    def _get_connection(self) -> sqlite3.Connection:
        conn = sqlite3.connect(str(self.db_path))
        conn.row_factory = sqlite3.Row
        return conn

    def _init_db(self):
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    email TEXT UNIQUE NOT NULL,
                    username TEXT UNIQUE NOT NULL,
                    full_name TEXT NOT NULL,
                    password_hash TEXT NOT NULL,
                    salt TEXT NOT NULL,
                    taluk TEXT DEFAULT 'Puttur',
                    role TEXT DEFAULT 'farmer',
                    phone TEXT,
                    created_at TEXT NOT NULL
                )
            """)
            conn.commit()

    @staticmethod
    def _hash_password(password: str, salt: Optional[str] = None) -> Tuple[str, str]:
        if not salt:
            salt = secrets.token_hex(16)
        pwd_hash = hashlib.pbkdf2_hmac(
            'sha256',
            password.encode('utf-8'),
            salt.encode('utf-8'),
            100000
        ).hex()
        return pwd_hash, salt

    @staticmethod
    def _create_token(user_id: int, email: str, expires_in_days: int = 7) -> str:
        payload = {
            "sub": user_id,
            "email": email,
            "exp": int((datetime.now(timezone.utc) + timedelta(days=expires_in_days)).timestamp())
        }
        raw_json = json.dumps(payload, separators=(',', ':')).encode('utf-8')
        b64_payload = base64.urlsafe_b64encode(raw_json).decode('utf-8').rstrip('=')
        signature = hmac.new(
            SECRET_KEY.encode('utf-8'),
            b64_payload.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()
        return f"{b64_payload}.{signature}"

    @staticmethod
    def verify_token(token: str) -> Optional[Dict[str, Any]]:
        try:
            parts = token.split('.')
            if len(parts) != 2:
                return None
            b64_payload, signature = parts
            expected_sig = hmac.new(
                SECRET_KEY.encode('utf-8'),
                b64_payload.encode('utf-8'),
                hashlib.sha256
            ).hexdigest()
            if not hmac.compare_digest(signature, expected_sig):
                return None
            
            # Add back base64 padding
            padding = '=' * (4 - len(b64_payload) % 4) if len(b64_payload) % 4 else ''
            payload_json = base64.urlsafe_b64decode(b64_payload + padding).decode('utf-8')
            payload = json.loads(payload_json)
            
            if payload.get("exp", 0) < int(datetime.now(timezone.utc).timestamp()):
                return None
            return payload
        except Exception:
            return None

    def register_user(
        self,
        password: str,
        email: Optional[str] = None,
        username: Optional[str] = None,
        full_name: Optional[str] = None,
        taluk: str = "Puttur",
        role: str = "farmer",
        phone: Optional[str] = None
    ) -> Dict[str, Any]:
        # Normalize fields
        if not email and not username:
            raise ValueError("Either email or username must be provided.")

        if not email:
            email = f"{username.lower().replace(' ', '')}@terravision.local"
        email = email.strip().lower()

        if not username:
            username = email.split('@')[0]
        username = username.strip().lower()

        if not full_name:
            full_name = username.capitalize()
        full_name = full_name.strip()

        if not password or len(password) < 4:
            raise ValueError("Password must be at least 4 characters.")

        pwd_hash, salt = self._hash_password(password)
        created_at = datetime.now(timezone.utc).isoformat() + "Z"

        with self._get_connection() as conn:
            cursor = conn.cursor()
            # Check existing email
            cursor.execute("SELECT id FROM users WHERE email = ? OR username = ?", (email, username))
            if cursor.fetchone():
                raise ValueError("A user with this email or username already exists.")

            cursor.execute("""
                INSERT INTO users (email, username, full_name, password_hash, salt, taluk, role, phone, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (email, username, full_name, pwd_hash, salt, taluk or "Puttur", role or "farmer", phone, created_at))
            conn.commit()
            user_id = cursor.lastrowid

        user_data = {
            "id": user_id,
            "email": email,
            "username": username,
            "full_name": full_name,
            "taluk": taluk or "Puttur",
            "role": role or "farmer",
            "phone": phone,
            "created_at": created_at
        }
        token = self._create_token(user_id, email)
        return {"user": user_data, "token": token}

    def authenticate_user(self, login_identifier: str, password: str) -> Dict[str, Any]:
        login_identifier = login_identifier.strip().lower()
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT id, email, username, full_name, password_hash, salt, taluk, role, phone, created_at
                FROM users
                WHERE email = ? OR username = ?
            """, (login_identifier, login_identifier))
            row = cursor.fetchone()

        if not row:
            raise ValueError("Invalid email/username or password.")

        expected_hash, _ = self._hash_password(password, row["salt"])
        if not hmac.compare_digest(expected_hash, row["password_hash"]):
            raise ValueError("Invalid email/username or password.")

        user_data = {
            "id": row["id"],
            "email": row["email"],
            "username": row["username"],
            "full_name": row["full_name"],
            "taluk": row["taluk"],
            "role": row["role"],
            "phone": row["phone"],
            "created_at": row["created_at"]
        }
        token = self._create_token(row["id"], row["email"])
        return {"user": user_data, "token": token}

    def get_user_by_id(self, user_id: int) -> Optional[Dict[str, Any]]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
                SELECT id, email, username, full_name, taluk, role, phone, created_at
                FROM users WHERE id = ?
            """, (user_id,))
            row = cursor.fetchone()
        if not row:
            return None
        return dict(row)

auth_service = AuthService()

