# Vendor Dashboard User Guide

Complete guide for using the DineIn Malta Vendor Dashboard.

## Overview

The Vendor Dashboard is a lightweight, mobile-first operational dashboard designed for bar and restaurant staff to manage orders, menus, and operations in real-time during service hours.

## Getting Started

### Login

1. Navigate to `/vendor/login`
2. Enter your email and password (provided by your admin)
3. Click "Login"
4. You'll be redirected to the **Live Dashboard** (`/vendor/live`)

## Main Interface: Live Dashboard

The Live Dashboard (`/vendor/live`) is your primary workspace during service hours.

### Header Section

- **Venue Name**: Your restaurant/bar name
- **Live Indicator**: Green dot shows you're connected to real-time updates
- **Settings Button**: ⚙️ Access settings

### Today's Stats

Quick overview of today's performance:
- **Revenue**: Total sales today (€)
- **Orders**: Number of orders today
- **Avg Order**: Average order value

### Quick Actions

One-tap access to common tasks:
- **🚫 86 Item**: Quickly disable menu items that are out of stock
- **📋 View Menu**: Open full menu management
- **📊 Today's Stats**: View detailed analytics
- **🖨️ Print QR**: Generate QR codes for tables

### Incoming Orders

Real-time feed of active orders:

#### Order Card Colors
- **🔴 Red Border**: New orders (needs attention)
- **🟡 Yellow Border**: Orders being prepared
- **🟢 Green Border**: Orders ready for pickup
- **Gray**: Completed orders (automatically removed from queue)

#### Order Actions

**New Orders**:
- **✓ Accept**: Move order to "Preparing" status
- **✕ Cancel**: Cancel the order (with confirmation)

**Preparing Orders**:
- **✓ Mark Ready**: Order is ready for customer pickup

**Ready Orders**:
- **✓ Complete**: Order has been delivered/completed

#### Order Information

Each order card shows:
- **Order Number**: #1234
- **Table Number**: Which table the order is for
- **Time**: How long ago the order was placed (e.g., "2 min ago")
- **Items**: List of items with quantities
- **Total Amount**: €XX.XX
- **Payment Status**: PAID (green) or UNPAID (red, pulsing)
- **Customer Notes**: Special requests (yellow highlight)

### Table Status

Visual grid showing all your tables:
- **🟢 Green**: Available
- **🔴 Red**: Occupied
- **🟡 Yellow**: Has active order

Click a table to view details or filter orders by table.

## Menu Management

Navigate to `/vendor/menu` or click "View Menu" from Quick Actions.

### Features

- **Search**: Find items quickly by name
- **Category Filter**: Filter by category (All, Drinks, Food, etc.)
- **Status Filter**: Show All, Active only, or Hidden items
- **Sales Stats**: See how many of each item sold today

### Quick Actions

- **Toggle Availability**: Tap the switch on any item to instantly disable/enable it
  - **Green switch**: Item is available
  - **Gray switch**: Item is "86'd" (out of stock)
- **Edit Item**: Tap "✏️ Edit" to modify price, description, etc.
- **Add New Item**: Click "+ Add Item" button

### Bulk Operations

- **🚫 Disable All Specials**: Quickly disable all items tagged as "special"
- **✅ Enable All Items**: Re-enable all disabled items

### Sales Data

Each menu item shows:
- How many sold today
- Quick visual indicator of popularity

## Analytics & History

Navigate to `/vendor/history` to view performance data.

### Overview Stats

- **Total Revenue**: Revenue for selected time period
- **Orders**: Number of orders
- **Avg Order Value**: Average spend per order

### Date Range Selector

Choose your time period:
- **Today**: Today's data only
- **Last 7 Days**: Past week
- **Last Month**: Past 30 days
- **Custom**: Pick your own date range

### Revenue Chart

Visual breakdown of revenue by hour:
- Shows which hours are busiest
- Helps with staffing decisions

### Top Sellers

List of your best-performing items:
- Ranked by revenue
- Shows quantity sold and total revenue
- Visual progress bars for quick comparison

### Order History

Recent orders with:
- Order number and status
- Table number
- Total amount
- Date and time
- Number of items

### Export Data

- **📄 Export CSV**: Download order data as spreadsheet
- Use for accounting, inventory, or analysis

## Settings

Navigate to `/vendor/settings` or click ⚙️ in the header.

### Venue Information

Edit your venue details:
- Name
- Address
- Phone number
- Click "Save Venue Settings" to update

### Notifications

Control how you're alerted:

**Sound Alerts**
- Plays sound when new orders arrive
- Default: Enabled
- Recommended for busy periods

**Push Notifications**
- Receive notifications even when app is closed
- Requires browser permission
- Great for when you're away from the tablet

**Email Daily Summary**
- Receive daily report of revenue and orders
- Sent at end of business day

### Account & Security

- **Change Password**: Update your login password
- **Sign Out**: Log out of the dashboard

## Order Status Workflow

Understanding the order lifecycle:

1. **NEW** (🔴)
   - Order just placed by customer
   - Needs immediate attention
   - Action: Accept or Cancel

2. **PREPARING** (🟡)
   - Order has been accepted
   - Kitchen/bar is working on it
   - Action: Mark as Ready when done

3. **READY** (🟢)
   - Order is complete
   - Waiting for pickup/delivery
   - Action: Complete when delivered

4. **COMPLETED** (Gray)
   - Order finished
   - Automatically removed from active queue
   - Still visible in history

5. **CANCELLED** (Red)
   - Order cancelled
   - Removed from queue
   - Recorded in history

## Tips for Efficient Operation

### During Rush Hour

1. **Focus on Live Dashboard**: Keep it on the primary screen
2. **Accept Orders Quickly**: Tap "Accept" as soon as you see new orders
3. **Use Sound Alerts**: Keep enabled to never miss an order
4. **86 Items Immediately**: If something runs out, disable it right away

### Menu Updates

- **Quick Toggle**: One tap to disable/enable items
- **Search First**: Use search to find items quickly
- **Bulk Actions**: Use bulk operations for specials or menu changes

### Customer Service

- **Check Notes**: Always read customer notes (yellow highlight)
- **Payment Status**: Keep an eye on unpaid orders
- **Table Numbers**: Verify table numbers before delivery

### End of Day

1. **Review Analytics**: Check today's performance
2. **Export Data**: Download CSV for records
3. **Check Settings**: Ensure notifications are configured correctly

## Keyboard Shortcuts (Coming Soon)

- `1` - Navigate to Live Dashboard
- `2` - Navigate to Menu
- `3` - Navigate to History
- `R` - Refresh orders

## Troubleshooting

### Orders Not Appearing

- Check connection indicator (should be green "Live")
- Refresh the page
- Verify you're logged in correctly

### Sound Not Playing

- Check Settings → Notifications → Sound Alerts is enabled
- Browser may require user interaction first
- Check device volume

### Can't Update Order Status

- Ensure you have vendor permissions
- Check internet connection
- Refresh and try again

### Menu Changes Not Saving

- Check internet connection
- Verify you have edit permissions
- Try refreshing the page

## Mobile Usage

The dashboard is optimized for tablets and mobile devices:

- **Large Touch Targets**: All buttons are easy to tap
- **Swipe to Refresh**: Pull down on order list to refresh
- **Responsive Design**: Works on any screen size
- **Offline Support**: Queues actions when offline, syncs when back online

## Best Practices

1. **Keep Dashboard Open**: During service hours, keep the Live Dashboard visible
2. **Update Status Promptly**: Keep order status current so customers know progress
3. **Regular Menu Updates**: Keep menu availability accurate
4. **Monitor Today's Stats**: Track performance throughout the day
5. **Use Quick Actions**: Save time with one-tap actions

## Support

If you need help:
1. Check this guide first
2. Contact your admin/manager
3. Review the troubleshooting section

## FAQ

**Q: How do I disable an item quickly?**
A: Go to Menu Management, find the item, and tap the toggle switch. Or use Quick Actions → "86 Item".

**Q: Can I see past orders?**
A: Yes, go to History & Analytics to view all past orders with date filters.

**Q: What if I accidentally cancel an order?**
A: Contact the customer directly. Cancelled orders cannot be uncancelled through the dashboard.

**Q: How do I print QR codes?**
A: Use Quick Actions → "Print QR" or go to the Tables tab in the old dashboard.

**Q: Can multiple staff use the dashboard?**
A: Yes, all staff with vendor accounts can access it. Changes sync in real-time.

---

**Version**: 2.0  
**Last Updated**: January 2025  
**Dashboard**: Live Service Dashboard
