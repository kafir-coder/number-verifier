# Number Verifier API

Phone number verification service using Twilio Verify. Sends an SMS code and validates it.

**Base URL:** `https://number-verifier.onrender.com`

## Endpoints

### Send verification code

```
POST /send-code
```

**Request body:**

```json
{
  "phoneNumber": "+244954420524"
}
```

- `phoneNumber` — required, must be in E.164 format (`+` followed by country code and number)

**Response (200):**

```json
{
  "message": "Verification code sent"
}
```

**Errors:**

| Status | Response | Reason |
|--------|----------|--------|
| 400 | `{ "error": "Phone number is required" }` | Missing `phoneNumber` in body |
| 500 | `{ "error": "Failed to send verification code" }` | Twilio API failure |

---

### Verify code

```
POST /verify-code
```

**Request body:**

```json
{
  "phoneNumber": "+244954420524",
  "code": "758909"
}
```

- `phoneNumber` — required, same number the code was sent to
- `code` — required, the 6-digit code received via SMS

**Response (200):**

```json
{
  "phoneNumber": "+244954420524",
  "message": "Phone number verified"
}
```

**Errors:**

| Status | Response | Reason |
|--------|----------|--------|
| 400 | `{ "error": "Phone number and code are required" }` | Missing fields |
| 400 | `{ "error": "Invalid verification code" }` | Wrong code |
| 400 | `{ "error": "Invalid or expired verification code" }` | Code expired or already used |

## Usage example

```bash
# 1. Send code
curl -X POST https://number-verifier.onrender.com/send-code \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+244954420524"}'

# 2. Verify code
curl -X POST https://number-verifier.onrender.com/verify-code \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+244954420524", "code": "123456"}'
```

## Notes

- Verification codes expire after **10 minutes**
- Phone numbers must include the country code (e.g. `+244` for Angola, `+55` for Brazil, `+1` for US)
- Each code can only be used **once**

## Local development

```bash
cp .env.example .env
# Fill in your Twilio credentials in .env
npm install
npm run dev
```

## Environment variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 3000) |
| `TWILIO_ACCOUNT_SID` | Twilio Account SID |
| `TWILIO_AUTH_TOKEN` | Twilio Auth Token |
| `TWILIO_VERIFY_SID` | Twilio Verify Service SID |
