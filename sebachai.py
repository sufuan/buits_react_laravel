#!/usr/bin/env python3
# ------------------------------------------------------------
# sebachai_post.py – exact replica of the captured POST request
# ------------------------------------------------------------

import json, sys
import requests

# ----------------------------------------------------------------------
# 1️⃣  Endpoint & payload – taken verbatim from the browser trace
# ----------------------------------------------------------------------
URL = "http://sebachai.devbd.pro/api/v1/search"

PAYLOAD = {
    "query": "artificial intelligence",
    "page": 1,
    "size": 20,
    "sort": "relevance"
}

# ----------------------------------------------------------------------
# 2️⃣  Headers – every header that arrived with the request
# ----------------------------------------------------------------------
HEADERS = {
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
    "Cookie": "session_id=abc123def456ghi789jkl012; XSRF-TOKEN=9f8e7d6c5b4a3z2y1x0w",
    "Content-Type": "application/json",
    "Accept": "application/json, text/plain, */*",
    "Origin": "http://sebachai.devbd.pro",
    "Referer": "http://sebachai.devbd.pro/",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124.0.0.0 Safari/537.36"
}

# ----------------------------------------------------------------------
# 3️⃣  Execute the request
# ----------------------------------------------------------------------
def main():
    try:
        resp = requests.post(
            URL,
            headers=HEADERS,
            json=PAYLOAD,          # requests will JSON‑encode automatically
            timeout=15
        )
        resp.raise_for_status()   # will raise for 4xx/5xx
    except requests.exceptions.RequestException as e:
        print(f"[ERROR] Request failed: {e}", file=sys.stderr)
        sys.exit(1)

    try:
        data = resp.json()
    except json.JSONDecodeError:
        print("[ERROR] Response is not valid JSON", file=sys.stderr)
        sys.exit(1)

    print(json.dumps(data, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    main()