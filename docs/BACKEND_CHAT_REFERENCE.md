# Chat Backend API Reference

## Overview

The chat system must be **role-agnostic**. Any user (parent, surrogate, agent, support) can
start a conversation with any other user. No role-specific validation.

## Endpoints

### 1. POST /api/v1/chat/conversation

Create or retrieve an existing conversation between two users.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "otherUserId": "f84b39cf-d26f-46af-868c-90603a2ecce9"
}
```

- `otherUserId` — the auth `User.id` of the person the current user wants to chat with.
- The current user is identified by the JWT in the Authorization header.
- If a conversation between these two users already exists, return it (do not create a duplicate).

**Response (200):**
```json
{
  "id": "conv-uuid",
  "participants": [
    { "userId": "f84b39cf-...", "name": "John", "avatarUrl": "https://...", "role": "INTENDED_PARENT" },
    { "userId": "892034a1-...", "name": "Jane", "avatarUrl": "https://...", "role": "SURROGATE" }
  ],
  "lastMessage": null,
  "unreadCount": 0
}
```

- `participants[].userId` MUST be the auth `User.id`, not a profile ID.
- `participants[].avatarUrl` MUST be the user's current profile picture (absolute URL).
- `participants[].role` — one of `"INTENDED_PARENT"`, `"SURROGATE"`, `"AGENT"`, `"SUPPORT"`.

**Error (404):** `{ "message": "User not found" }` — if `otherUserId` does not exist.

---

### 2. GET /api/v1/chat

List all conversations for the authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
[
  {
    "id": "conv-uuid",
    "participants": [
      { "userId": "f84b39cf-...", "name": "John", "avatarUrl": "https://...", "role": "INTENDED_PARENT" },
      { "userId": "892034a1-...", "name": "Jane", "avatarUrl": "https://...", "role": "SURROGATE" }
    ],
    "lastMessage": {
      "content": "Hello!",
      "createdAt": "2026-07-05T12:30:00.000Z",
      "senderId": "892034a1-..."
    },
    "unreadCount": 3
  }
]
```

- `unreadCount` — number of messages in this conversation where `senderId != currentUserId` AND `readAt IS NULL`.
- `participants[].avatarUrl` and `role` are required.
- `lastMessage` can be `null` if no messages exist yet.

---

### 3. GET /api/v1/chat/messages/:conversationId

Fetch paginated messages for a conversation.

**Headers:**
```
Authorization: Bearer <token>
```

**Query params:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `take` | number | 50 | Number of messages to return |
| `skip` | number | 0 | Number of messages to skip (for pagination) |

**Response (200):**
```json
{
  "data": [
    {
      "id": "msg-uuid",
      "conversationId": "conv-uuid",
      "sender": {
        "id": "f84b39cf-...",
        "name": "John",
        "role": "INTENDED_PARENT"
      },
      "content": "Hello!",
      "attachmentUrl": null,
      "createdAt": "2026-07-05T12:30:00.000Z",
      "status": "SENT",
      "readAt": null
    }
  ]
}
```

- `sender.id` — the auth `User.id`.
- `status` — one of `"SENT"`, `"DELIVERED"`, `"READ"`. Default `"SENT"`.
- `readAt` — timestamp when the recipient read the message, or `null`.

---

### 4. POST /api/v1/chat/message

Send a message to a conversation.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "conversationId": "conv-uuid",
  "content": "Hello!",
  "attachmentUrl": "https://example.com/file.pdf"
}
```

- `attachmentUrl` is optional.

**Response (200):** The saved message object (same shape as in GET messages).

---

### 5. PATCH /api/v1/chat/messages/read

Mark messages as read.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "messageIds": ["msg-uuid-1", "msg-uuid-2"]
}
```

- Marks all listed messages as read (sets `readAt` timestamp).
- Only the recipient (not the sender) can mark messages as read. If the sender tries, return 403.

**Response (200):** `{ "success": true }`

---

## Database Schema (recommended)

```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_user_ids UUID[] NOT NULL,  -- array of exactly 2 User IDs
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id),
  sender_id UUID NOT NULL REFERENCES users(id),
  content TEXT,
  attachment_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  read_at TIMESTAMPTZ  -- null until recipient reads it
);
```

## States

```
messages.status = 
  "SENT"      →  (when created, readAt is null)
  "READ"      →  (when recipient calls PATCH /chat/messages/read, readAt is set)
  
  (Frontend local-only: "SENDING" = optimistic before API response)
```

## Key Rules

1. **No role-specific validation.** Any user can chat with any other user. Do not check for
   surrogate profiles, agent profiles, or parent profiles when creating a conversation.
2. **Conversation uniqueness.** Two users should have exactly one conversation. If one already
   exists, return it instead of creating a new one.
3. **Auth = identity.** The JWT identifies the current user. `otherUserId` identifies their
   conversation partner. Both are auth `User.id`, not profile IDs.
4. **Avatar URLs.** Always return fully resolved absolute URLs (e.g.
   `https://s3.bucket.com/profiles/avatar.jpg?signature=...`). Never relative paths.
5. **Unread count.** Computed per-conversation on every list fetch. Unread = `readAt IS NULL`
   AND `sender_id != current_user_id`.
