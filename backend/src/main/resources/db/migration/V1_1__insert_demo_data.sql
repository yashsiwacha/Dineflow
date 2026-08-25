-- =============================================================================
-- YES Standard: DineFlow Demo Data Seeding
-- Flyway Migration V1_1__insert_demo_data.sql
-- =============================================================================

-- 1. Insert Menu Categories
INSERT INTO menu_categories (id, name, is_active, created_by) VALUES
('c0000000-0000-0000-0000-000000000001', 'Starters', true, 'SYSTEM'),
('c0000000-0000-0000-0000-000000000002', 'Tandoor', true, 'SYSTEM'),
('c0000000-0000-0000-0000-000000000003', 'Main Course', true, 'SYSTEM'),
('c0000000-0000-0000-0000-000000000004', 'Breads', true, 'SYSTEM'),
('c0000000-0000-0000-0000-000000000005', 'Rice', true, 'SYSTEM'),
('c0000000-0000-0000-0000-000000000006', 'Desserts', true, 'SYSTEM'),
('c0000000-0000-0000-0000-000000000007', 'Beverages', true, 'SYSTEM');

-- 2. Insert Menu Items (31 dishes)
INSERT INTO menu_items (id, menu_category_id, name, description, price, is_vegetarian, spice_level, allergens, is_available, image_url, created_by) VALUES
-- Starters
('a0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Avocado Bhel', 'A premium street food twist featuring fresh Hass avocados puffed rice, peanuts, and tang of tamarind-mint chutney.', 450.0000, true, 1, '["peanuts", "gluten"]', true, '/assets/food/starter_avocado_bhel.webp', 'SYSTEM'),
('a0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'Beetroot Galouti Kebab', 'Pan-seared smoked beetroot patties infused with traditional aromatic spices and rose petals, served with ulta tawa paratha.', 490.0000, true, 1, '["gluten", "dairy"]', true, '/assets/food/starter_beetroot_galouti.webp', 'SYSTEM'),
('a0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000001', 'Modern Dahi Puri', 'Crispy wheat shells filled with potato mash, sweetened yogurt mousse, and raspberry reduction bubbles.', 390.0000, true, 0, '["gluten", "dairy"]', true, '/assets/food/starter_dahi_puri.webp', 'SYSTEM'),
('a0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000001', 'Crispy Lotus Stem', 'Crisp lotus root slices tossed in sweet chili plum glaze, spiced with home-grown Kashmiri red pepper.', 420.0000, true, 2, '["sesame"]', true, '/assets/food/starter_lotus_stem.webp', 'SYSTEM'),

-- Tandoor
('a0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000002', 'Truffle Malai Paneer Tikka', 'Clay-oven roasted cottage cheese blocks marinated with heavy cream, cardamom, and finished with white truffle oil drizzle.', 595.0000, true, 0, '["dairy"]', true, '/assets/food/tandoor_malai_tikka.webp', 'SYSTEM'),
('a0000000-0000-0000-0000-000000000006', 'c0000000-0000-0000-0000-000000000002', 'Bhatti Ka Paneer', 'Rustic cottage cheese slabs skewered and charred over open coals with a spicy curd-mustard paste.', 565.0000, true, 2, '["dairy", "mustard"]', true, '/assets/food/tandoor_bhatti_paneer.webp', 'SYSTEM'),
('a0000000-0000-0000-0000-000000000007', 'c0000000-0000-0000-0000-000000000002', 'Tandoori Broccoli', 'Fresh broccoli florets marinated in spiced cheese mix, roasted golden and topped with toasted almond flakes.', 520.0000, true, 1, '["dairy", "nuts"]', true, '/assets/food/tandoor_tandoori_broccoli.webp', 'SYSTEM'),
('a0000000-0000-0000-0000-000000000008', 'c0000000-0000-0000-0000-000000000002', 'Seekh Kebab', 'Minced tender lamb leg combined with hand-pressed spices, fresh coriander leaves, and skewered to perfection.', 690.0000, false, 2, '[]', true, '/assets/food/tandoor_seekh_kebab.webp', 'SYSTEM'),
('a0000000-0000-0000-0000-000000000027', 'c0000000-0000-0000-0000-000000000002', 'Tandoori Pomfret', 'Whole fresh Pomfret fish marinated in yellow chili yoghurt marinade, roasted in traditional clay oven.', 890.0000, false, 2, '["fish", "dairy"]', true, '/assets/food/tandoor_tandoori_pomfret.webp', 'SYSTEM'),

-- Main Course
('a0000000-0000-0000-0000-000000000009', 'c0000000-0000-0000-0000-000000000003', 'DineFlow Butter Chicken', 'Signature recipe. Boneless tandoori chicken cooked in a rich, buttery, satin gravy of ripe tomatoes and cashew paste.', 695.0000, false, 1, '["dairy", "nuts"]', true, '/assets/food/main_butter_chicken.webp', 'SYSTEM'),
('a0000000-0000-0000-0000-000000000010', 'c0000000-0000-0000-0000-000000000003', 'Slow-Cooked Dal Makhani', 'Black lentils slow-cooked for 24 hours with butter, fresh tomato puree, finished with hand-churned white butter.', 520.0000, true, 0, '["dairy"]', true, '/assets/food/main_dal_makhani.webp', 'SYSTEM'),
('a0000000-0000-0000-0000-000000000011', 'c0000000-0000-0000-0000-000000000003', 'Paneer Lababdar', 'Soft paneer cubes simmered in onion-tomato-cashew gravy with grated cottage cheese and green bell peppers.', 595.0000, true, 1, '["dairy", "nuts"]', true, '/assets/food/main_paneer_lababdar.webp', 'SYSTEM'),
('a0000000-0000-0000-0000-000000000012', 'c0000000-0000-0000-0000-000000000003', 'Nalli Nihari', 'Slow-braised tender lamb shank in a rich bone marrow flour-thickened broth, topped with ginger strips.', 890.0000, false, 3, '["gluten"]', true, '/assets/food/main_nalli_nihari.webp', 'SYSTEM'),
('a0000000-0000-0000-0000-000000000026', 'c0000000-0000-0000-0000-000000000003', 'Murgh Methi Malai', 'Succulent chicken pieces cooked with fresh fenugreek leaves in a creamy cashew and yogurt sauce.', 675.0000, false, 1, '["dairy", "nuts"]', true, '/assets/food/main_murgh_methi.webp', 'SYSTEM'),
('a0000000-0000-0000-0000-000000000028', 'c0000000-0000-0000-0000-000000000003', 'Peshawari Chole', 'Robust chickpeas simmered in a dark, spice-rich gravy cooked with dried pomegranate seeds and amla.', 450.0000, true, 2, '[]', true, '/assets/food/main_peshawari_chole.webp', 'SYSTEM'),

-- Breads
('a0000000-0000-0000-0000-000000000016', 'c0000000-0000-0000-0000-000000000004', 'Truffle & Cheese Naan', 'Leavened clay-oven baked bread stuffed with mozzarella cheese, baked golden and brushed with truffle oil.', 240.0000, true, 0, '["dairy", "gluten"]', true, '/assets/food/bread_truffle_naan.webp', 'SYSTEM'),
('a0000000-0000-0000-0000-000000000017', 'c0000000-0000-0000-0000-000000000004', 'Garlic Naan', 'Classic flatbread topped with finely minced garlic, roasted golden brown and finished with pure ghee.', 150.0000, true, 0, '["dairy", "gluten"]', true, '/assets/food/bread_garlic_naan.webp', 'SYSTEM'),
('a0000000-0000-0000-0000-000000000018', 'c0000000-0000-0000-0000-000000000004', 'Laccha Paratha', 'Multi-layered flaky wheat bread baked in tandoor and brushed with butter.', 130.0000, true, 0, '["dairy", "gluten"]', true, '/assets/food/bread_laccha_paratha.webp', 'SYSTEM'),
('a0000000-0000-0000-0000-000000000019', 'c0000000-0000-0000-0000-000000000004', 'Tandoori Roti', 'Whole wheat flatbread baked on the walls of the clay oven.', 90.0000, true, 0, '["gluten"]', true, '/assets/food/bread_roti.webp', 'SYSTEM'),

-- Rice
('a0000000-0000-0000-0000-000000000013', 'c0000000-0000-0000-0000-000000000005', 'Jackfruit Biryani (Kathal)', 'Tender raw jackfruit chunks marinated in yoghurt and aromatic herbs, dum-cooked with long grain basmati rice.', 595.0000, true, 2, '["dairy"]', true, '/assets/food/rice_jackfruit_biryani.webp', 'SYSTEM'),
('a0000000-0000-0000-0000-000000000014', 'c0000000-0000-0000-0000-000000000005', 'Awadhi Mutton Biryani', 'Fragrant basmati rice layered with juicy mutton chops marinated in secret spices, finished with saffron water.', 795.0000, false, 2, '["dairy"]', true, '/assets/food/rice_mutton_biryani.webp', 'SYSTEM'),
('a0000000-0000-0000-0000-000000000015', 'c0000000-0000-0000-0000-000000000005', 'Subz Dum Biryani', 'Seasonal garden vegetables cooked in slow fire with spices, basmati rice, layered with fried onions.', 550.0000, true, 1, '["dairy"]', true, '/assets/food/rice_subz_biryani.webp', 'SYSTEM'),
('a0000000-0000-0000-0000-000000000031', 'c0000000-0000-0000-0000-000000000005', 'Jeera Pulao', 'Fragrant basmati rice tempered with toasted cumin seeds and ghee.', 290.0000, true, 0, '["dairy"]', true, '/assets/food/rice_jeera_pulao.webp', 'SYSTEM'),

-- Desserts
('a0000000-0000-0000-0000-000000000020', 'c0000000-0000-0000-0000-000000000006', 'Rasmalai Tres Leches', 'A fusion marvel of soft rasmalai sponges soaked in three milk reductions flavored with cardamom and saffron.', 420.0000, true, 0, '["dairy", "nuts", "gluten"]', true, '/assets/food/dessert_rasmalai_tres_leches.webp', 'SYSTEM'),
('a0000000-0000-0000-0000-000000000021', 'c0000000-0000-0000-0000-000000000006', 'Shahi Tukda (Modern)', 'Crispy saffron-soaked bread logs served over a pool of condensed rabri, finished with gold leaf sheets.', 390.0000, true, 0, '["dairy", "nuts", "gluten"]', true, '/assets/food/dessert_shahi_tukda.webp', 'SYSTEM'),
('a0000000-0000-0000-0000-000000000022', 'c0000000-0000-0000-0000-000000000006', 'Gulab Jamun with Rabri', 'Warm sugar-soaked berry-sized milk solids served with chilled rich saffron-cardamom rabri.', 350.0000, true, 0, '["dairy", "nuts", "gluten"]', true, '/assets/food/dessert_gulab_jamun.webp', 'SYSTEM'),
('a0000000-0000-0000-0000-000000000029', 'c0000000-0000-0000-0000-000000000006', 'Kulfi Falooda', 'Traditional malai kulfi served with cornstarch noodles, sweetened rose syrup, and basil seeds.', 390.0000, true, 0, '["dairy", "nuts"]', true, '/assets/food/dessert_kulfi_falooda.webp', 'SYSTEM'),

-- Beverages
('a0000000-0000-0000-0000-000000000023', 'c0000000-0000-0000-0000-000000000007', 'Mango Lassi with Saffron', 'Chilled churned creamy yogurt blend with ripe Alphonso mangoes, flavored with rosewater and saffron strands.', 250.0000, true, 0, '["dairy"]', true, '/assets/food/beverage_mango_lassi.webp', 'SYSTEM'),
('a0000000-0000-0000-0000-000000000024', 'c0000000-0000-0000-0000-000000000007', 'Kokum Mocktail', 'A refreshing coastal cooler of wild mangosteen rind reduction, soda, lime, and black salt.', 220.0000, true, 0, '[]', true, '/assets/food/beverage_kokum_cooler.webp', 'SYSTEM'),
('a0000000-0000-0000-0000-000000000025', 'c0000000-0000-0000-0000-000000000007', 'Spiced Masala Chai', 'Traditional slow-brewed strong Assam tea with milk, fresh ginger, cardamom pods, and crushed pepper.', 180.0000, true, 0, '["dairy"]', true, '/assets/food/beverage_masala_chai.webp', 'SYSTEM'),
('a0000000-0000-0000-0000-000000000030', 'c0000000-0000-0000-0000-000000000007', 'Fresh Lime Soda', 'Carbonated water combined with hand-squeezed key limes, choice of sugar syrup or black rock salt.', 150.0000, true, 0, '[]', true, '/assets/food/beverage_lime_soda.webp', 'SYSTEM');


-- 3. Insert Restaurant Tables (10 Tables)
INSERT INTO restaurant_tables (id, table_number, seating_capacity, status, created_by) VALUES
('b0000000-0000-0000-0000-000000000001', 1, 2, 'AVAILABLE', 'SYSTEM'),
('b0000000-0000-0000-0000-000000000002', 2, 2, 'AVAILABLE', 'SYSTEM'),
('b0000000-0000-0000-0000-000000000003', 3, 4, 'AVAILABLE', 'SYSTEM'),
('b0000000-0000-0000-0000-000000000004', 4, 4, 'AVAILABLE', 'SYSTEM'),
('b0000000-0000-0000-0000-000000000005', 5, 4, 'AVAILABLE', 'SYSTEM'),
('b0000000-0000-0000-0000-000000000006', 6, 6, 'AVAILABLE', 'SYSTEM'),
('b0000000-0000-0000-0000-000000000007', 7, 6, 'AVAILABLE', 'SYSTEM'),
('b0000000-0000-0000-0000-000000000008', 8, 8, 'AVAILABLE', 'SYSTEM'),
('b0000000-0000-0000-0000-000000000009', 9, 8, 'AVAILABLE', 'SYSTEM'),
('b0000000-0000-0000-0000-000000000010', 10, 10, 'AVAILABLE', 'SYSTEM');


-- 4. Insert Seeding Users (including staff roles and customers)
-- All users share password hash for 'password' -> '$2a$10$vD2qXG4Kx7eHqA6Zf7gTNuB37sP.2e1q1/pE8hQkI7m35jE8g6nPy'
INSERT INTO users (id, email, password_hash, full_name, phone, role, status, created_by) VALUES
('e0000000-0000-0000-0000-000000000001', 'admin@dineflow.com', '$2a$10$vD2qXG4Kx7eHqA6Zf7gTNuB37sP.2e1q1/pE8hQkI7m35jE8g6nPy', 'Executive Admin', '+919999900001', 'ADMIN', 'ACTIVE', 'SYSTEM'),
('e0000000-0000-0000-0000-000000000002', 'kitchen@dineflow.com', '$2a$10$vD2qXG4Kx7eHqA6Zf7gTNuB37sP.2e1q1/pE8hQkI7m35jE8g6nPy', 'Head Chef Kabir', '+919999900002', 'KITCHEN', 'ACTIVE', 'SYSTEM'),
('e0000000-0000-0000-0000-000000000003', 'staff@dineflow.com', '$2a$10$vD2qXG4Kx7eHqA6Zf7gTNuB37sP.2e1q1/pE8hQkI7m35jE8g6nPy', 'Floor Manager Neha', '+919999900003', 'STAFF', 'ACTIVE', 'SYSTEM');

-- Generate customer accounts
INSERT INTO users (id, email, password_hash, full_name, phone, role, status, created_by)
SELECT
    ('e0000000-0000-0000-0000-000000000' || LPAD(i::text, 3, '0'))::UUID as id,
    'customer' || i || '@gmail.com' as email,
    '$2a$10$vD2qXG4Kx7eHqA6Zf7gTNuB37sP.2e1q1/pE8hQkI7m35jE8g6nPy' as password_hash,
    'Customer ' || i as full_name,
    '+9198100' || LPAD((10000 + i)::text, 5, '0') as phone,
    'CUSTOMER' as role,
    'ACTIVE' as status,
    'SYSTEM' as created_by
FROM generate_series(10, 59) as i; -- 50 customer profiles


-- 5. Insert Orders & Order Items (30 Orders)
-- Let's insert a couple of orders explicitly with items, and then seed the rest programmatically
-- Order 1: Completed
INSERT INTO orders (id, table_number, user_id, order_type, status, notes, total_amount, tax_amount, delivery_charge, final_amount, payment_status, contact_phone, contact_name, created_by) VALUES
('f0000000-0000-0000-0000-000000000001', 3, 'e0000000-0000-0000-0000-000000000010', 'DINE_IN', 'COMPLETED', 'Make butter chicken medium spicy', 1215.0000, 60.7500, 0.0000, 1275.7500, 'COMPLETED', '+919810010010', 'Customer 10', 'SYSTEM');

INSERT INTO order_items (id, order_id, menu_item_id, quantity, price, special_instructions, created_by) VALUES
('d0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000009', 1, 695.0000, 'medium spicy please', 'SYSTEM'),
('d0000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000010', 1, 520.0000, 'extra butter', 'SYSTEM');

INSERT INTO payments (id, order_id, amount, payment_status, transaction_id, payment_method, created_by) VALUES
('d5000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', 1275.7500, 'COMPLETED', 'txn_172839281', 'UPI', 'SYSTEM');

-- Order 2: Preparing
INSERT INTO orders (id, table_number, user_id, order_type, status, notes, total_amount, tax_amount, delivery_charge, final_amount, payment_status, contact_phone, contact_name, created_by) VALUES
('f0000000-0000-0000-0000-000000000002', 5, 'e0000000-0000-0000-0000-000000000011', 'DINE_IN', 'PREPARING', 'No onion no garlic in Paneer', 1190.0000, 59.5000, 0.0000, 1249.5000, 'COMPLETED', '+919810010011', 'Customer 11', 'SYSTEM');

INSERT INTO order_items (id, order_id, menu_item_id, quantity, price, special_instructions, created_by) VALUES
('d0000000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000011', 2, 595.0000, 'No onion no garlic', 'SYSTEM');

INSERT INTO payments (id, order_id, amount, payment_status, transaction_id, payment_method, created_by) VALUES
('d5000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000002', 1249.5000, 'COMPLETED', 'txn_172839282', 'CARD', 'SYSTEM');

-- Seed remaining 28 orders programmatically with various states, totals, and users to hit 30 orders
INSERT INTO orders (id, table_number, user_id, order_type, status, notes, total_amount, tax_amount, delivery_charge, final_amount, payment_status, contact_phone, contact_name, created_by, created_at)
SELECT
    ('f0000000-0000-0000-0000-000000000' || LPAD((i + 2)::text, 3, '0'))::UUID as id,
    CASE WHEN i % 3 = 0 THEN (1 + (i % 10)) ELSE NULL END as table_number,
    ('e0000000-0000-0000-0000-000000000' || LPAD((12 + i)::text, 3, '0'))::UUID as user_id,
    CASE WHEN i % 3 = 0 THEN 'DINE_IN' WHEN i % 3 = 1 THEN 'TAKEAWAY' ELSE 'DELIVERY' END as order_type,
    CASE WHEN i % 5 = 0 THEN 'PLACED' WHEN i % 5 = 1 THEN 'CONFIRMED' WHEN i % 5 = 2 THEN 'PREPARING' WHEN i % 5 = 3 THEN 'READY' ELSE 'COMPLETED' END as status,
    'Aromatic dishes' as notes,
    600.0000 + i * 20.0000 as total_amount,
    (600.0000 + i * 20.0000) * 0.05 as tax_amount,
    CASE WHEN i % 3 = 2 THEN 50.0000 ELSE 0.0000 END as delivery_charge,
    (600.0000 + i * 20.0000) * 1.05 + (CASE WHEN i % 3 = 2 THEN 50.0000 ELSE 0.0000 END) as final_amount,
    CASE WHEN i % 4 = 0 THEN 'PENDING' ELSE 'COMPLETED' END as payment_status,
    '+9198100100' || LPAD((12 + i)::text, 2, '0') as contact_phone,
    'Customer ' || (12 + i) as contact_name,
    'SYSTEM' as created_by,
    NOW() - (i || ' hours')::interval as created_at
FROM generate_series(1, 28) as i;

-- Insert order items for programmatically seeded orders
INSERT INTO order_items (id, order_id, menu_item_id, quantity, price, special_instructions, created_by)
SELECT
    ('d0000000-0000-0000-0000-000000000' || LPAD((i + 3)::text, 3, '0'))::UUID as id,
    ('f0000000-0000-0000-0000-000000000' || LPAD((i + 2)::text, 3, '0'))::UUID as order_id,
    (CASE WHEN i % 2 = 0 THEN 'a0000000-0000-0000-0000-000000000009' ELSE 'a0000000-0000-0000-0000-000000000010' END)::UUID as menu_item_id,
    1 + (i % 3) as quantity,
    CASE WHEN i % 2 = 0 THEN 695.0000 ELSE 520.0000 END as price,
    'Garnish nicely' as special_instructions,
    'SYSTEM' as created_by
FROM generate_series(1, 28) as i;


-- 6. Insert Reservations (15 Reservations)
INSERT INTO reservations (id, user_id, customer_name, customer_phone, customer_email, reservation_date, time_slot, party_size, table_number, status, created_by, created_at) VALUES
('c1000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000012', 'Customer 12', '+919810010012', 'customer12@gmail.com', CURRENT_DATE + 1, '19:00:00', 4, 3, 'CONFIRMED', 'SYSTEM', NOW()),
('c1000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000013', 'Customer 13', '+919810010013', 'customer13@gmail.com', CURRENT_DATE + 1, '20:30:00', 2, 1, 'CONFIRMED', 'SYSTEM', NOW()),
('c1000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000014', 'Customer 14', '+919810010014', 'customer14@gmail.com', CURRENT_DATE, '13:00:00', 6, 6, 'SEATED', 'SYSTEM', NOW()),
('c1000000-0000-0000-0000-000000000004', 'e0000000-0000-0000-0000-000000000015', 'Customer 15', '+919810010015', 'customer15@gmail.com', CURRENT_DATE, '21:00:00', 4, 4, 'PENDING', 'SYSTEM', NOW());

-- Seed remaining 11 reservations programmatically to reach 15 reservations
INSERT INTO reservations (id, user_id, customer_name, customer_phone, customer_email, reservation_date, time_slot, party_size, table_number, status, created_by, created_at)
SELECT
    ('c1000000-0000-0000-0000-000000000' || LPAD((i + 4)::text, 3, '0'))::UUID as id,
    ('e0000000-0000-0000-0000-000000000' || LPAD((16 + i)::text, 3, '0'))::UUID as user_id,
    'Customer ' || (16 + i) as customer_name,
    '+9198100100' || (16 + i) as customer_phone,
    'customer' || (16 + i) || '@gmail.com' as customer_email,
    CURRENT_DATE + (i % 3) as reservation_date,
    CAST(CASE WHEN i % 2 = 0 THEN '19:30:00' ELSE '21:30:00' END as TIME) as time_slot,
    2 + (i % 5) as party_size,
    2 + (i % 7) as table_number,
    CASE WHEN i % 3 = 0 THEN 'PENDING' WHEN i % 3 = 1 THEN 'CONFIRMED' ELSE 'CANCELLED' END as status,
    'SYSTEM' as created_by,
    NOW() - (i || ' days')::interval as created_at
FROM generate_series(1, 11) as i;
