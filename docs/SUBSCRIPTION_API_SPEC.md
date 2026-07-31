# Subscription API Specification

## Overview

Generic subscription system supporting multiple roles (AGENT, PARENT, etc.).
Role and region are auto-detected from the JWT — no query params needed.

## Data Model

### Plan (generic)

```json
{
  "id": "plan_monthly_agent_ng",
  "name": "Agent Monthly Basic",
  "description": "Monthly subscription for agents in Nigeria",
  "role": "AGENT",
  "interval": "MONTHLY",
  "intervalCount": 1,
  "isActive": true,
  "features": [
    { "key": "listed_active", "label": "Listed as active agent", "enabled": true },
    { "key": "priority_search", "label": "Priority visibility in search results", "enabled": true },
    { "key": "direct_contact", "label": "Direct contact with intended parents", "enabled": true },
    { "key": "analytics", "label": "Advanced analytics", "enabled": true }
  ],
  "regions": [
    { "region": "NG", "currency": "NGN", "price": 4999, "symbol": "₦" },
    { "region": "KE", "currency": "KES", "price": 15000, "symbol": "KSh" },
    { "region": "US", "currency": "USD", "price": 10, "symbol": "$" }
  ],
  "createdAt": "2026-07-18T10:00:00.000Z",
  "updatedAt": "2026-07-18T10:00:00.000Z"
}
```

### PlanFeature

| Field | Type | Description |
|-------|------|-------------|
| `key` | string | Machine-readable key (e.g. `"priority_search"`) |
| `label` | string | User-facing label (e.g. `"Priority in search results"`) |
| `enabled` | boolean | Whether this feature is included |

### PlanRegion

| Field | Type | Description |
|-------|------|-------------|
| `region` | string | ISO country code (e.g. `"NG"`, `"KE"`, `"US"`) |
| `currency` | string | ISO currency code (e.g. `"NGN"`, `"USD"`) |
| `price` | number | Price in smallest currency unit (e.g. `4999` = ₦4,999) |
| `symbol` | string | Currency symbol for display (e.g. `"₦"`, `"$"`) |

### SubscriptionStatus (GET /subscription/active)

```json
{
  "isSubscribed": true,
  "planId": "plan_monthly_agent_ng",
  "planName": "Agent Monthly Basic",
  "expiresAt": "2026-08-18T10:00:00.000Z",
  "activatedAt": "2026-07-18T10:00:00.000Z"
}
```

### ActivateResponse (POST /subscription/activate)

```json
{
  "expiresAt": "2026-08-18T10:00:00.000Z",
  "cost": 4999,
  "newBalance": 50001,
  "planId": "plan_monthly_agent_ng"
}
```

## Endpoints

### User-facing

#### `GET /api/v1/subscription/plans`

Returns available plans for the authenticated user, filtered by their role and region.

**Auth**: User (any role)
**Response**: `{ plans: SubscriptionPlan[] }`

**Behavior**:
1. Read `user.role` from JWT
2. Read `user.country` or `user.region` from JWT
3. Return all `isActive: true` plans where `plan.role === user.role` and `plan.regions[].region === user.region`
4. If no plans match, return empty array (not 404)

#### `GET /api/v1/subscription/active`

Returns the authenticated user's active subscription status.

**Auth**: User
**Response**: `SubscriptionStatus`

**Behavior**:
- If no subscription or expired: `{ isSubscribed: false }`
- If active: full status with `expiresAt`

#### `POST /api/v1/subscription/activate`

Activates a subscription for the authenticated user by deducting from wallet.

**Auth**: User
**Body**: `{ planId: string }`
**Response**: `ActivateResponse`

**Behavior**:
1. Validate plan exists, isActive, matches user's role+region
2. Find the price from `plan.regions[].price` matching user's region
3. Check wallet balance >= price
4. Deduct from wallet
5. Set `subscription.expiresAt` (extend if already subscribed)
6. Create DEBIT wallet transaction
7. Return `{ expiresAt, cost, newBalance, planId }`
8. Error if insufficient balance

### Admin-only

#### `POST /api/v1/admin/subscription-plans`

Creates a new subscription plan.

**Auth**: Admin
**Body**: Full plan object (excluding `id`, `createdAt`, `updatedAt`)
**Response**: The created plan with generated `id`

#### `GET /api/v1/admin/subscription-plans`

Lists all plans (including inactive). Supports optional `?role=AGENT` filter.

**Auth**: Admin
**Response**: `{ plans: SubscriptionPlan[] }`

#### `PATCH /api/v1/admin/subscription-plans/:id`

Updates a plan's fields (name, description, price, features, regions, active status, etc.).

**Auth**: Admin
**Body**: Partial plan object
**Response**: Updated plan

#### `DELETE /api/v1/admin/subscription-plans/:id`

Archives (soft-deletes) a plan by setting `isActive: false`.

**Auth**: Admin
**Response**: `{ success: true }`

## Error Codes

| Code | Message | HTTP Status |
|------|---------|-------------|
| `PLAN_NOT_FOUND` | Subscription plan not found | 404 |
| `INSUFFICIENT_BALANCE` | Wallet balance is insufficient | 400 |
| `SUBSCRIPTION_EXISTS` | Already subscribed to this plan | 400 |
| `PLAN_INACTIVE` | This plan is no longer available | 400 |
| `ROLE_MISMATCH` | Plan does not apply to your role | 400 |

## Migration Notes

- Existing plans should be migrated to the new model (add `role`, `features[]`, `regions[]` fields)
- `GET /profile/subscription/pricing` → removed, replaced by `GET /subscription/plans`
- `GET /profile/subscription/active` → removed, replaced by `GET /subscription/active`
