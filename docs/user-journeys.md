# User Journeys

## Client Journey

### Browse & Discover
1. **Open App** → Anonymous session auto-initialized
2. **Scan QR Code** → Opens `/v/:vendorSlug/t/:tableCode`
3. **View Menu** → Direct access via link or QR

### Order Flow
1. **Browse Menu** → Add items to cart
2. **Review Cart** → Check items, quantities, total
3. **Place Order** → Creates order in DB with `client_auth_user_id` (anonymous session)
4. **Order Confirmation** → Shows order code, estimated time
5. **Payment** → 
   - Option A: Revolut deep link (if vendor has `revolut_link`)
   - Option B: Cash on delivery
6. **Track Order** → `/order/:id` shows status (received → served/cancelled)

### Reservation Flow
1. **Select Venue** → From saved list or manual search
2. **Make Reservation** → Choose date/time, party size
3. **Submit** → Creates reservation with status `pending`
4. **Vendor Response** → Vendor accepts/declines
5. **Confirmation** → Client sees updated status

## Vendor Journey

### Login
1. **Access Portal** → `/vendor/login`
2. **Enter Credentials** → Email/password (must be provisioned by admin)
3. **Authenticate** → Supabase validates, checks `vendor_users` table
4. **Dashboard** → Redirects to `/vendor/live` (Live Service Dashboard)

### Manage Orders (Live Dashboard)
1. **View Live Dashboard** → `/vendor/live` shows real-time order queue
2. **Order Status Workflow** → 
   - **NEW** (🔴): Tap "Accept" to start preparing
   - **PREPARING** (🟡): Tap "Mark Ready" when order is complete
   - **READY** (🟢): Tap "Complete" after delivery
   - **Cancel**: Cancel order at any time (emergency only)
3. **Real-time Updates** → Orders appear instantly with sound/visual alerts
4. **Mark Paid** → Tap payment status badge to mark as paid
5. **Today's Stats** → View revenue, order count, avg order value at a glance
6. **Table Status** → See which tables are occupied/have orders

### Manage Menu
1. **View Menu** → `/vendor/menu` or Quick Action "View Menu"
2. **Quick Toggle Availability** → One-tap switch to disable/enable items ("86" an item)
3. **Search & Filter** → Search by name, filter by category or status
4. **Sales Stats** → See how many of each item sold today
5. **Add Item** → Tap "+ Add Item" button
6. **Edit Item** → Tap "✏️ Edit" on any item
7. **Bulk Actions** → Disable all specials, enable all items
8. **Bulk Import** → (Optional) Upload menu image, parse via Gemini

### Manage Tables
1. **View Tables** → `/vendor/tables` shows all tables
2. **Create Tables** → Bulk create N tables with QR codes
3. **Generate QR** → Each table gets unique `public_code`
4. **Print/Share** → Download QR codes as PDF or images
5. **Deactivate** → Mark table as inactive if needed

### Manage Reservations
1. **View Reservations** → See all pending/accepted reservations
2. **Accept/Decline** → Update reservation status
3. **Filter** → By date, status, party size

## Admin Journey

### Login
1. **Access Portal** → `/admin/login`
2. **Google OAuth** → Click "Sign in with Google"
3. **Authenticate** → Supabase validates, checks `admin_users` table
4. **Dashboard** → Redirects to `/admin/dashboard`

### Create Vendor
1. **Add Vendor** → Manual entry in `/admin/vendors`
2. **Enter Details** → 
   - Name, address
   - Set status: `pending` or `active`
   - Add contact info (phone, website, WhatsApp)
3. **Save** → Creates vendor record in DB
4. **Activate** → Change status to `active` when ready

### Manage Vendor Users
1. **View Vendors** → `/admin/vendors` shows all vendors
2. **Select Vendor** → Choose vendor to manage
3. **Add Manager** → 
   - Create Supabase auth user (email invite)
   - Create `vendor_users` record
   - Assign role: `owner`, `manager`, or `staff`
4. **Edit Roles** → Update user roles or deactivate
5. **Remove User** → Deactivate user access

### System Management
1. **View System** → `/admin/system` shows system stats
2. **Monitor** → View orders, users, vendors counts
3. **Audit Logs** → Review admin actions
4. **Settings** → Configure system-wide settings

## Key Constraints

### Client
- Cannot access `/vendor/*` or `/admin/*` routes
- Can only see active vendors in menu
- Can only create orders for themselves
- Anonymous session is sufficient for ordering

### Vendor
- Cannot access `/admin/*` routes
- Can only see/manage their assigned vendor's data
- Cannot create new vendors (admin-only)
- Must be provisioned by admin first

### Admin
- Can access all routes
- Can create vendors
- Can assign vendor users
- Can suspend vendors/users
- Full system access

## Error States

### Client
- **Vendor Inactive** → Show "Coming soon" message
- **Order Failed** → Show error, retry option
- **Offline** → Queue orders, sync when online

### Vendor
- **No Orders** → Show empty state
- **Login Failed** → Show error message
- **Unauthorized** → Redirect to login
- **Network Error** → Show retry option

### Admin
- **Not Admin** → Redirect to login
- **OAuth Failed** → Show error, retry
- **Vendor Creation Failed** → Show error details




