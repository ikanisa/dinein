/**
 * Shared types for Edge Functions
 */

// Auth context after successful authentication
export interface AuthContext {
    user: {
        id: string;
        email?: string;
        role?: string;
    };
    isAdmin: boolean;
    isVendorMember: boolean;
    vendorId?: string;
}

// Standard API response envelope
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    details?: unknown;
    requestId: string;
}

// Audit log actions
export enum AuditAction {
    // Orders
    ORDER_CREATE = "ORDER_CREATE",
    ORDER_STATUS_UPDATE = "ORDER_STATUS_UPDATE",
    ORDER_MARK_PAID = "ORDER_MARK_PAID",
    ORDER_CANCEL = "ORDER_CANCEL",

    // Vendors
    VENDOR_CLAIM = "VENDOR_CLAIM",
    VENDOR_UPDATE = "VENDOR_UPDATE",
    VENDOR_SUSPEND = "VENDOR_SUSPEND",
    VENDOR_ACTIVATE = "VENDOR_ACTIVATE",

    // Tables
    TABLES_GENERATE = "TABLES_GENERATE",
    TABLE_UPDATE = "TABLE_UPDATE",

    // Menu
    MENU_ITEM_CREATE = "MENU_ITEM_CREATE",
    MENU_ITEM_UPDATE = "MENU_ITEM_UPDATE",
    MENU_ITEM_DELETE = "MENU_ITEM_DELETE",

    // Admin
    ADMIN_USER_CREATE = "ADMIN_USER_CREATE",
    ADMIN_USER_UPDATE = "ADMIN_USER_UPDATE",
}

// Entity types for audit logs
export enum EntityType {
    ORDER = "order",
    VENDOR = "vendor",
    TABLE = "table",
    MENU_ITEM = "menu_item",
    USER = "user",
    ADMIN_USER = "admin_user",
}

// Standard error codes
export enum ErrorCode {
    UNAUTHORIZED = "UNAUTHORIZED",
    FORBIDDEN = "FORBIDDEN",
    NOT_FOUND = "NOT_FOUND",
    VALIDATION_ERROR = "VALIDATION_ERROR",
    RATE_LIMITED = "RATE_LIMITED",
    INTERNAL_ERROR = "INTERNAL_ERROR",
    CONFLICT = "CONFLICT",
}

// Rate limit config
export interface RateLimitConfig {
    maxRequests: number;
    window: string; // e.g., "1 hour"
    endpoint: string;
}
