-- Migration: 20260116_allocate_menus
-- Description: Cleans up invalid scraped vendors and populates empty vendors with demo menu data.

-- 1. DELETE INVALID VENDORS
-- These are artifacts from the scraping process
DELETE FROM vendors 
WHERE name IN (
    'Language', 
    'My orders', 
    'The food you love,\ndelivered fast',
    'The food you love, delivered fast' 
);

-- 2. ALLOCATE MENUS TO EMPTY VENDORS
-- Strategy: Take the menu from 'Zion Reggae Bar' and copy it to every other active vendor that currently has 0 items.

INSERT INTO menu_items (
    vendor_id, 
    category, 
    name, 
    description, 
    price, 
    is_available, 
    image_url, 
    tags_json, 
    currency
)
SELECT 
    v.id,
    m.category,
    m.name,
    m.description,
    m.price,
    m.is_available,
    m.image_url,
    m.tags_json,
    m.currency
FROM vendors v
CROSS JOIN menu_items m
WHERE 
    v.status = 'active'
    -- Source Menu: Zion Reggae Bar
    AND m.vendor_id = (SELECT id FROM vendors WHERE name ILIKE '%Zion Reggae Bar%' LIMIT 1)
    -- Target Vendors: Must be empty
    AND NOT EXISTS (SELECT 1 FROM menu_items existing WHERE existing.vendor_id = v.id)
    -- Safety: Don't copy to self (though NOT EXISTS covers this)
    AND v.id != (SELECT id FROM vendors WHERE name ILIKE '%Zion Reggae Bar%' LIMIT 1);

-- 3. VERIFICATION
-- Log the results (pseudo-log via select)
SELECT 
    v.name, 
    count(m.id) as menu_count 
FROM vendors v 
LEFT JOIN menu_items m ON v.id = m.vendor_id 
GROUP BY v.name 
ORDER BY menu_count DESC;
