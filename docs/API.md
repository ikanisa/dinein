# DineIn API Reference

> Complete reference for Edge Functions and frontend hooks.

---

## Edge Functions

All Edge Functions use `POST` method, require JSON body, and return JSON responses.

**Base URL:** `https://[PROJECT_ID].supabase.co/functions/v1/`

### Authentication

| Header | Value | Required |
|--------|-------|----------|
| `Authorization` | `Bearer <access_token>` | Most endpoints |
| `apikey` | `<anon_key>` | All endpoints |
| `x-request-id` | `<uuid>` | Optional (tracing) |

---

## 1. Order Management

### `order_create`

Create a new order for a venue.

```json
{
  "vendor_id": "uuid",
  "table_public_code": "A12",
  "items": [
    {
      "menu_item_id": "uuid",
      "quantity": 2,
      "notes": "No onions",
      "modifiers_json": {}
    }
  ],
  "notes": "Birthday celebration"
}
```

**Response:**
```json
{
  "success": true,
  "requestId": "req_xxxxx",
  "order": { "id": "uuid", "order_code": "ORD-1234", ... }
}
```

---

### `order_update_status`

Update order status (vendor/admin only).

```json
{
  "order_id": "uuid",
  "status": "served" // or "cancelled"
}
```

**Auth Required:** Vendor member or Admin

---

### `order_mark_paid`

Mark an order as paid (vendor/admin only).

```json
{
  "order_id": "uuid",
  "payment_method": "cash" // or "card", "momo", etc.
}
```

---

## 2. AI Features

### `gemini-features`

AI-powered features for search, image generation, and menu parsing.

**Actions:**

| Action | Auth | Description |
|--------|------|-------------|
| `search` | Public | Semantic venue search |
| `enrich-profile` | Authenticated | Enrich venue with web data |
| `generate-image` | Authenticated | Generate AI images |
| `parse-menu` | Authenticated | Parse menu from image |
| `smart-description` | Authenticated | Generate menu descriptions |
| `generate-asset` | Authenticated | Generate & store venue images |

**Example (search):**
```json
{
  "action": "search",
  "payload": {
    "query": "italian restaurants in valletta"
  }
}
```

---

## 3. Admin Operations

### `admin_user_management`

Admin-only operations for managing vendors and users.

**Actions:**

| Action | Payload |
|--------|---------|
| `create_vendor` | `{ name, address, country, owner_email, owner_password, ... }` |
| `update_vendor` | `{ vendor_id, name?, address?, ... }` |
| `delete_vendor` | `{ vendor_id }` |
| `list_vendors` | `{}` |
| `create_admin` | `{ email, password }` |
| `list_admins` | `{}` |

---

## 4. Venue Operations

### `vendor_claim`

Claim an existing venue as owner.

```json
{
  "vendor_id": "uuid",
  "contact_email": "owner@example.com"
}
```

### `tables_generate`

Generate QR codes for venue tables.

```json
{
  "vendor_id": "uuid",
  "count": 10,
  "prefix": "T"
}
```

---

## Frontend Hooks

### Data Fetching

| Hook | Purpose |
|------|---------|
| `useVendor(id)` | Fetch venue details |
| `useMenu(vendorId)` | Fetch menu items |
| `useOrders(vendorId)` | Fetch orders (vendor) |
| `useOrderStatus(orderId)` | Track order status |

### Mutations

| Hook | Purpose |
|------|---------|
| `useCreateOrder()` | Submit new order |
| `useUpdateOrderStatus()` | Update order status |
| `useCallEdgeFunction(name)` | Generic Edge Function call |

---

## Error Codes

| Status | Error | Description |
|--------|-------|-------------|
| 400 | `VALIDATION_ERROR` | Invalid request data |
| 401 | `UNAUTHORIZED` | Missing/invalid auth |
| 403 | `FORBIDDEN` | Insufficient permissions |
| 404 | `NOT_FOUND` | Resource not found |
| 429 | `RATE_LIMITED` | Too many requests |
| 500 | `INTERNAL_ERROR` | Server error |

---

## Rate Limits

| Endpoint | Authenticated | Anonymous |
|----------|--------------|-----------|
| `gemini-features` | 30/hour | 10/hour |
| `order_create` | 60/hour | N/A |
| `admin_*` | 60/hour | N/A |
