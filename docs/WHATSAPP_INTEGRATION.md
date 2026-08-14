# WhatsApp Integration Design

This document details how the CollegeAI backend APIs and AI Agent services easily connect to the Meta WhatsApp Cloud API without duplicating any business logic.

---

## Future Architecture Diagram

```
[ User Phone (WhatsApp) ]
          │
          ▼
┌──────────────────────────┐
│ WhatsApp Cloud API      │
└─────────┬────────────────┘
          │ Webhook HTTP POST
          ▼
┌──────────────────────────┐
│ WhatsApp Message Gateway │
│ (Identity Resolver)      │
└─────────┬────────────────┘
          │ Resolves phone number -> User ID & JWT Context
          ▼
┌──────────────────────────┐
│ POST /api/v1/chat        │
│ (CollegeAI Backend)      │
└─────────┬────────────────┘
          │ Executes tool calculations
          ▼
┌──────────────────────────┐
│ Response Text / Payload │
└─────────┬────────────────┘
          │
          ▼
[ WhatsApp Message Sent ]
```

---

## Step-by-Step Integration Guide

### 1. Identity Resolution (Phone Number to User Mapping)
When a WhatsApp message is received, Meta sends a payload:
```json
{
  "entry": [{
    "changes": [{
      "value": {
        "messages": [{
          "from": "919876543210",
          "text": {"body": "How many classes can I miss while staying above 75%?"}
        }]
      }
    }]
  }]
}
```
1. Look up user by phone number `+91-9876543210` in `USERS_DB`.
2. Generate user JWT token or mock `user_context`.

### 2. Forwarding to Chat Endpoint
Send HTTP POST internal request to `POST /api/v1/chat`:
```json
{
  "message": "How many classes can I miss while staying above 75%?"
}
```

### 3. Response Rendering
The backend returns structured `ChatResponse`:
- Plain markdown response formatted cleanly for WhatsApp messages (bolding `*text*`, bullet points, emojis).
- Returns reply text directly to WhatsApp Cloud API send message endpoint (`https://graph.facebook.com/v19.0/{PHONE_NUMBER_ID}/messages`).

Zero business logic or mathematical calculations need to be rewritten for WhatsApp!
