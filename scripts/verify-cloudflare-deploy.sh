#!/bin/bash
# =============================================================================
# Cloudflare Pages Deploy Verification Script
# Verifies SPA routing configuration before deployment
# =============================================================================

set -e

echo "🔍 Cloudflare Pages Deploy Verification"
echo "========================================"
echo ""

# Navigate to web app (scripts is at repo root, apps/web is sibling)
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
WEB_APP_DIR="$REPO_ROOT/apps/web"

cd "$WEB_APP_DIR" || {
    echo "❌ ERROR: Could not find apps/web directory at $WEB_APP_DIR"
    exit 1
}

# Check if dist exists
if [ ! -d "dist" ]; then
    echo "⚠️  dist/ directory not found. Running build..."
    npm run build
fi

echo "✓ dist/ directory exists"
echo ""

# Check _redirects
echo "📄 Checking _redirects..."
if [ -f "dist/_redirects" ]; then
    echo "✓ dist/_redirects exists"
    
    # Check for SPA fallback rule
    if grep -q "/\*.*index\.html.*200" "dist/_redirects"; then
        echo "✓ SPA fallback rule found: /* → /index.html 200"
    else
        echo "❌ ERROR: SPA fallback rule missing!"
        echo "   Add this to public/_redirects:"
        echo "   /*  /index.html  200"
        exit 1
    fi
else
    echo "❌ ERROR: dist/_redirects not found!"
    echo "   Create public/_redirects with SPA routing rules"
    exit 1
fi
echo ""

# Check index.html
echo "📄 Checking index.html..."
if [ -f "dist/index.html" ]; then
    echo "✓ dist/index.html exists ($(wc -c < dist/index.html | tr -d ' ') bytes)"
else
    echo "❌ ERROR: dist/index.html not found!"
    exit 1
fi
echo ""

# Check _headers (optional but recommended)
echo "📄 Checking _headers..."
if [ -f "dist/_headers" ]; then
    echo "✓ dist/_headers exists"
    
    # Check for security headers
    if grep -q "X-Content-Type-Options" "dist/_headers"; then
        echo "✓ Security headers configured"
    fi
    
    # Check for no-cache on HTML
    if grep -q "no-cache.*no-store" "dist/_headers"; then
        echo "✓ HTML cache-busting configured"
    fi
else
    echo "⚠️  dist/_headers not found (optional)"
fi
echo ""

# Check assets
echo "📦 Checking assets..."
ASSET_COUNT=$(find dist/assets -type f 2>/dev/null | wc -l | tr -d ' ')
if [ "$ASSET_COUNT" -gt 0 ]; then
    echo "✓ $ASSET_COUNT asset files found"
else
    echo "⚠️  No assets found in dist/assets/"
fi
echo ""

# Summary
echo "========================================"
echo "✅ All checks passed! Ready for deployment."
echo ""
echo "Deploy with:"
echo "  npx wrangler pages deploy dist --project-name=dinein-malta"
echo ""
echo "Or push to your connected Git branch for automatic deployment."
