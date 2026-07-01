# SkillForge Backend - Validation Rules Reference

## 📋 Quick Reference Guide

### Email Validation
```
Format: RFC 5322
Examples:
  ✅ user@example.com
  ✅ john.doe+tag@company.co.uk
  ✅ admin@skillforge.club
  ❌ invalid-email
  ❌ user@
  ❌ @example.com
  ❌ user @example.com (space)
```

### Password Validation
```
Requirements:
  - Minimum 8 characters
  - At least 1 uppercase letter (A-Z)
  - At least 1 lowercase letter (a-z)
  - At least 1 number (0-9)

Examples:
  ✅ MySecurePass123
  ✅ P@ssw0rdStrong
  ✅ SkillForge2024
  ❌ password123 (no uppercase)
  ❌ PASSWORD123 (no lowercase)
  ❌ MyPass (too short)
  ❌ MyPassword (no number)
```

### OTP Validation
```
Format: Exactly 6 digits
Expires: 10 minutes after sending

Examples:
  ✅ 123456
  ✅ 000000
  ✅ 999999
  ❌ 12345 (too short)
  ❌ 1234567 (too long)
  ❌ ABCDEF (not numeric)
  ❌ 12 34 56 (spaces)
```

### UUID Validation
```
Format: UUID v4
Pattern: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

Examples:
  ✅ 550e8400-e29b-41d4-a716-446655440000
  ✅ 6ba7b810-9dad-11d1-80b4-00c04fd430c8
  ❌ 550e8400-e29b-41d4-a716 (incomplete)
  ❌ 550e8400e29b41d4a716446655440000 (no hyphens)
  ❌ not-a-uuid
```

### Name Validation
```
Length: 2-100 characters
Type: String, trimmed

Examples:
  ✅ John Doe
  ✅ Maria Garcia Lopez
  ✅ 李明
  ❌ J (too short)
  ❌ This is a very long name that exceeds 100 characters and should not be accepted... (too long)
```

### Text Field Validation

#### Bio/Description (Max 500 chars)
```
✅ "I'm a full-stack developer with 5 years of experience."
✅ "Passionate about AI and Machine Learning"
❌ "Lorem ipsum dolor sit amet... [500+ chars]" (too long)
```

#### Event Title (Max 200 chars)
```
✅ "Web Development Workshop"
✅ "Advanced JavaScript: Async/Await Masterclass"
❌ "The most comprehensive and in-depth web development workshop covering all aspects..." (too long)
```

#### Event Description (Max 2000 chars)
```
✅ Longer descriptions are supported up to 2000 characters
❌ Text exceeding 2000 characters will be rejected
```

#### Project Title (Max 200 chars)
```
✅ "E-Commerce Platform"
✅ "AI-Powered Recommendation Engine"
❌ Very long project names that exceed the 200 character limit
```

#### Project Description (Max 2000 chars)
```
✅ Detailed project descriptions up to 2000 characters are allowed
❌ Extremely long descriptions exceeding 2000 characters
```

#### Assignment Title (Max 200 chars)
```
✅ "Build a Todo App with React"
❌ Extremely long assignment titles exceeding 200 characters limit
```

### Date/Time Validation

#### Date Format (ISO 8601)
```
Format: YYYY-MM-DD
Examples:
  ✅ 2024-06-15
  ✅ 2024-01-01
  ❌ 2024/06/15 (wrong separator)
  ❌ 15-06-2024 (wrong order)
  ❌ 2024-13-01 (invalid month)
  ❌ 2024-06-31 (invalid day for June)
```

#### Time Format (24-hour)
```
Format: HH:MM
Examples:
  ✅ 10:00
  ✅ 14:30
  ✅ 23:59
  ✅ 00:00
  ❌ 10:0 (missing leading zero)
  ❌ 25:00 (invalid hour)
  ❌ 10:60 (invalid minutes)
  ❌ 10.00 (wrong separator)
```

### Event Category Validation
```
Allowed Categories:
  - Workshop
  - Seminar
  - Hackathon
  - Meetup
  - Competition
  - Other

Examples:
  ✅ "Workshop"
  ✅ "Hackathon"
  ❌ "Webinar" (not in list)
  ❌ "workshop" (case sensitive)
  ❌ "Workshops" (plural not allowed)
```

### URL Validation
```
Format: Valid HTTP/HTTPS URL
Examples:
  ✅ https://github.com/username/project
  ✅ https://example.com
  ✅ http://localhost:3000
  ❌ github.com/username/project (missing protocol)
  ❌ ftp://example.com (not HTTP/HTTPS)
  ❌ not a url
```

### Array Field Validation

#### Tags Array
```
Type: Array of strings
Example:
  ✅ ["JavaScript", "React", "Web Development"]
  ✅ []
  ❌ ["JavaScript"] (single item is OK)
```

#### Tech Stack Array
```
Type: Array of strings
Example:
  ✅ ["React", "Node.js", "MongoDB", "Docker"]
  ✅ ["Python", "Django"]
  ❌ "React, Node.js" (must be array, not string)
```

### Capacity Validation
```
Type: Integer
Range: 1-10,000
Default: 100 (if not provided)

Examples:
  ✅ 50
  ✅ 100
  ✅ 10000
  ❌ 0 (minimum is 1)
  ❌ 10001 (maximum is 10,000)
  ❌ -50 (negative)
  ❌ 100.5 (not integer)
```

### Status Validation
```
For Events:
  ✅ "In Progress"
  ✅ "Completed"
  ✅ "Cancelled"
  ✅ "Draft"

For Projects:
  ✅ "In Progress"
  ✅ "Completed"
  ✅ "On Hold"
  ✅ "Planning"
```

### Role Validation
```
Allowed Roles:
  - student (default for new users)
  - mentor
  - admin

Examples:
  ✅ "student"
  ✅ "mentor"
  ✅ "admin"
  ❌ "STUDENT" (case sensitive)
  ❌ "admin-user" (exact match required)
```

---

## 📊 Validation by Endpoint

### Authentication Endpoints

| Field | Endpoint | Type | Rules |
|-------|----------|------|-------|
| email | send-otp | email | valid email, normalized |
| email | verify-otp | email | valid email, normalized |
| otp | verify-otp | string | exactly 6 digits |
| name | register | string | 2-100 chars |
| email | register | email | valid email |
| password | register | string | 8+ chars, upper, lower, number |
| email | login | email | valid email |
| password | login | string | required |
| name | update-profile | string | 2-100 chars (optional) |
| bio | update-profile | string | max 500 chars (optional) |
| avatar | update-profile | URL | valid URL (optional) |

### Events Endpoints

| Field | Type | Rules |
|-------|------|-------|
| title | string | max 200 chars (required) |
| description | string | max 2000 chars (optional) |
| date | date | ISO 8601 (required) |
| time | string | HH:MM format (optional) |
| venue | string | max 300 chars (required) |
| category | enum | [Workshop, Seminar, Hackathon, Meetup, Competition, Other] |
| capacity | integer | 1-10,000 (optional) |
| tags | array | strings (optional) |

### Projects Endpoints

| Field | Type | Rules |
|-------|------|-------|
| title | string | max 200 chars (required) |
| description | string | max 2000 chars (required) |
| category | string | required |
| tech_stack | array | strings (optional) |
| github_url | URL | valid URL (optional) |
| live_url | URL | valid URL (optional) |
| status | enum | [In Progress, Completed, On Hold, Planning] |

### Contact Endpoints

| Field | Type | Rules |
|-------|------|-------|
| name | string | required |
| email | email | valid email (required) |
| subject | string | required |
| message | string | required |

---

## 🔄 Common Validation Patterns

### Email Pattern
```javascript
// Accepted
user@example.com
john.doe@company.co.uk
admin+tag@skillforge.club

// Not accepted
invalid-email
user@
@example.com
user @example.com
```

### Password Pattern
```javascript
// Accepted
MyPassword123
SkillForge2024
SecurePass99

// Not accepted
password123 (no uppercase)
PASSWORD123 (no lowercase)
Password (no number)
Pass1 (too short)
```

### Phone Pattern (if used)
```javascript
// Optional format
+1-234-567-8900
+44 20 7946 0958
(555) 123-4567
```

---

## ⚠️ Error Messages

When validation fails, you'll receive a 400 error with:

```json
{
  "error": "Validation failed",
  "statusCode": 400,
  "status": "fail",
  "details": [
    {
      "value": "weak",
      "msg": "Password must be at least 8 characters",
      "param": "password",
      "location": "body"
    }
  ]
}
```

---

## 💡 Tips

1. **Always trim inputs** - Validation automatically trims whitespace
2. **Case matters** - Email is normalized, but other fields are case-sensitive
3. **Dates must be ISO 8601** - Use YYYY-MM-DD format
4. **UUIDs must be exact** - Cannot use other ID formats
5. **URLs need protocol** - Always use http:// or https://
6. **Enums are strict** - Must match exact value (case-sensitive)
7. **Arrays must be arrays** - Use [] not comma-separated strings
8. **All values are sanitized** - XSS protection applied automatically

---

**Last Updated:** 2024-01-15
**Validation Version:** 1.0
