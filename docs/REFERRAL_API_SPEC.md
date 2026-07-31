# Referral System - Backend API Spec

## Current State

The `/intended-parents/profile/me` response includes:
- `user.referralCode` — works, user can share their invite link
- `user.hasReferred: []` — **empty**, not populated
- `user.referredById: null` — **not set** when someone signs up with a referral code

The `/surrogates/profile/me` and `/agents/profile/me` should have the same fields.

## What's Needed

### 1. Track Referrals on Signup

When a user registers with a `referralCode` query param or body field:

- Look up the user who owns that referral code
- Set `referredById` on the new user to the referrer's user ID
- Add the new user's info to the referrer's `hasReferred` array

### 2. `GET /referrals` — List My Referrals

**Response:**
```json
[
  {
    "id": "uuid",
    "userName": "JaneDoe",
    "email": "jane@example.com",
    "status": "PENDING",
    "createdAt": "2026-06-10T..."
  }
]
```

**Statuses:**
- `PENDING` — signed up via referral, no qualifying action yet
- `QUALIFIED` — completed a qualifying action (subscribe, boost, purchase)
- `REWARDED` — referrer has already claimed the reward for this referral

**Qualifying actions** (any one triggers `PENDING → QUALIFIED`):
- User subscribes to a package (`POST /subscriptions/...`)
- User boosts their profile (`POST /boosts/...`)
- User makes a purchase on the platform

### 3. `POST /referrals/redeem` — Claim Rewards

**Logic:**
1. Fetch all referrals with status `QUALIFIED`
2. Calculate total: `qualifiedCount × 1000` (NGN per referral)
3. Credit the referrer's wallet
4. Mark all redeemed referrals as `REWARDED`
5. Return the result

**Response:**
```json
{
  "creditedAmount": 2000,
  "totalAmount": 2000,
  "redeemedCount": 2,
  "newBalance": 77000
}
```

### 4. Profile Response Changes

Ensure `hasReferred` is included in all three profile endpoints:
- `GET /surrogates/profile/me`
- `GET /agents/profile/me`
- `GET /intended-parents/profile/me`

The `user` object in each response should have:
```json
{
  "hasReferred": [
    {
      "id": "uuid",
      "userName": "JaneDoe",
      "email": "jane@example.com",
      "status": "PENDING",
      "createdAt": "2026-06-10T..."
    }
  ],
  "referredById": "uuid-or-null"
}
```
