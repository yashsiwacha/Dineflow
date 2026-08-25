-- =============================================================================
-- YES Standard: Initial DineFlow Schema
-- Flyway Migration V1_0__create_initial_schema.sql
-- =============================================================================

-- Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";   -- gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pg_trgm";    -- trigram text search indexes

-- 1. users table
CREATE TABLE IF NOT EXISTS users (
    id              UUID        NOT NULL DEFAULT gen_random_uuid(),
    email           TEXT        NOT NULL,
    password_hash   TEXT        NOT NULL,
    full_name       TEXT        NOT NULL,
    phone           TEXT        NOT NULL,
    role            TEXT        NOT NULL DEFAULT 'CUSTOMER', -- CUSTOMER, STAFF, KITCHEN, ADMIN
    status          TEXT        NOT NULL DEFAULT 'ACTIVE',   -- ACTIVE, SUSPENDED

    -- Mandatory audit columns
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by      TEXT        NOT NULL DEFAULT 'SYSTEM',
    version         BIGINT      NOT NULL DEFAULT 0,
    deleted_at      TIMESTAMPTZ,

    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_role_check CHECK (role IN ('CUSTOMER', 'STAFF', 'KITCHEN', 'ADMIN')),
    CONSTRAINT users_status_check CHECK (status IN ('ACTIVE', 'SUSPENDED'))
);

CREATE UNIQUE INDEX IF NOT EXISTS udx_users_email_active
    ON users(email)
    WHERE deleted_at IS NULL;

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION yes_set_updated_at();


-- 2. menu_categories table
CREATE TABLE IF NOT EXISTS menu_categories (
    id              UUID        NOT NULL DEFAULT gen_random_uuid(),
    name            TEXT        NOT NULL,
    is_active       BOOLEAN     NOT NULL DEFAULT TRUE,

    -- Mandatory audit columns
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by      TEXT        NOT NULL DEFAULT 'SYSTEM',
    version         BIGINT      NOT NULL DEFAULT 0,
    deleted_at      TIMESTAMPTZ,

    CONSTRAINT menu_categories_pkey PRIMARY KEY (id)
);

CREATE UNIQUE INDEX IF NOT EXISTS udx_menu_categories_name_active
    ON menu_categories(name)
    WHERE deleted_at IS NULL;

CREATE TRIGGER trg_menu_categories_updated_at
    BEFORE UPDATE ON menu_categories
    FOR EACH ROW
    EXECUTE FUNCTION yes_set_updated_at();


-- 3. menu_items table
CREATE TABLE IF NOT EXISTS menu_items (
    id              UUID        NOT NULL DEFAULT gen_random_uuid(),
    menu_category_id UUID       NOT NULL,
    name            TEXT        NOT NULL,
    description     TEXT        NOT NULL,
    price           NUMERIC(19,4) NOT NULL,
    is_vegetarian   BOOLEAN     NOT NULL DEFAULT TRUE,
    spice_level     INT         NOT NULL DEFAULT 0, -- 0 (not spicy) to 3 (very spicy)
    allergens       JSONB,                          -- JSON array of strings
    is_available    BOOLEAN     NOT NULL DEFAULT TRUE,
    image_url       TEXT        NOT NULL,

    -- Mandatory audit columns
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by      TEXT        NOT NULL DEFAULT 'SYSTEM',
    version         BIGINT      NOT NULL DEFAULT 0,
    deleted_at      TIMESTAMPTZ,

    CONSTRAINT menu_items_pkey PRIMARY KEY (id),
    CONSTRAINT menu_items_menu_category_id_fk FOREIGN KEY (menu_category_id) REFERENCES menu_categories(id) ON DELETE RESTRICT,
    CONSTRAINT menu_items_spice_level_check CHECK (spice_level BETWEEN 0 AND 3),
    CONSTRAINT menu_items_price_check CHECK (price >= 0)
);

CREATE INDEX IF NOT EXISTS idx_menu_items_category_id ON menu_items(menu_category_id);
CREATE UNIQUE INDEX IF NOT EXISTS udx_menu_items_name_active ON menu_items(name) WHERE deleted_at IS NULL;

CREATE TRIGGER trg_menu_items_updated_at
    BEFORE UPDATE ON menu_items
    FOR EACH ROW
    EXECUTE FUNCTION yes_set_updated_at();


-- 4. restaurant_tables table
CREATE TABLE IF NOT EXISTS restaurant_tables (
    id              UUID        NOT NULL DEFAULT gen_random_uuid(),
    table_number    INT         NOT NULL,
    seating_capacity INT        NOT NULL,
    status          TEXT        NOT NULL DEFAULT 'AVAILABLE', -- AVAILABLE, OCCUPIED

    -- Mandatory audit columns
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by      TEXT        NOT NULL DEFAULT 'SYSTEM',
    version         BIGINT      NOT NULL DEFAULT 0,
    deleted_at      TIMESTAMPTZ,

    CONSTRAINT restaurant_tables_pkey PRIMARY KEY (id),
    CONSTRAINT restaurant_tables_status_check CHECK (status IN ('AVAILABLE', 'OCCUPIED')),
    CONSTRAINT restaurant_tables_capacity_check CHECK (seating_capacity > 0)
);

CREATE UNIQUE INDEX IF NOT EXISTS udx_restaurant_tables_number_active ON restaurant_tables(table_number) WHERE deleted_at IS NULL;

CREATE TRIGGER trg_restaurant_tables_updated_at
    BEFORE UPDATE ON restaurant_tables
    FOR EACH ROW
    EXECUTE FUNCTION yes_set_updated_at();


-- 5. orders table
CREATE TABLE IF NOT EXISTS orders (
    id              UUID        NOT NULL DEFAULT gen_random_uuid(),
    table_number    INT,                                      -- For DINE_IN QR ordering
    user_id         UUID,                                     -- Optional FK to registered user
    order_type      TEXT        NOT NULL,                     -- DINE_IN, TAKEAWAY, DELIVERY
    status          TEXT        NOT NULL DEFAULT 'PLACED',    -- PLACED, CONFIRMED, PREPARING, READY, COMPLETED, OUT_FOR_DELIVERY, CANCELLED
    notes           TEXT,
    total_amount    NUMERIC(19,4) NOT NULL DEFAULT 0.0000,
    tax_amount      NUMERIC(19,4) NOT NULL DEFAULT 0.0000,
    delivery_charge NUMERIC(19,4) NOT NULL DEFAULT 0.0000,
    final_amount    NUMERIC(19,4) NOT NULL DEFAULT 0.0000,
    payment_status  TEXT        NOT NULL DEFAULT 'PENDING',   -- PENDING, COMPLETED, FAILED
    address         TEXT,                                     -- For DELIVERY
    contact_phone   TEXT        NOT NULL,
    contact_name    TEXT        NOT NULL,

    -- Mandatory audit columns
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by      TEXT        NOT NULL DEFAULT 'SYSTEM',
    version         BIGINT      NOT NULL DEFAULT 0,
    deleted_at      TIMESTAMPTZ,

    CONSTRAINT orders_pkey PRIMARY KEY (id),
    CONSTRAINT orders_user_id_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT orders_type_check CHECK (order_type IN ('DINE_IN', 'TAKEAWAY', 'DELIVERY')),
    CONSTRAINT orders_status_check CHECK (status IN ('PLACED', 'CONFIRMED', 'PREPARING', 'READY', 'COMPLETED', 'OUT_FOR_DELIVERY', 'CANCELLED')),
    CONSTRAINT orders_payment_status_check CHECK (payment_status IN ('PENDING', 'COMPLETED', 'FAILED'))
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

CREATE TRIGGER trg_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION yes_set_updated_at();


-- 6. order_items table
CREATE TABLE IF NOT EXISTS order_items (
    id              UUID        NOT NULL DEFAULT gen_random_uuid(),
    order_id        UUID        NOT NULL,
    menu_item_id    UUID        NOT NULL,
    quantity        INT         NOT NULL,
    price           NUMERIC(19,4) NOT NULL,
    special_instructions TEXT,

    -- Mandatory audit columns
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by      TEXT        NOT NULL DEFAULT 'SYSTEM',
    version         BIGINT      NOT NULL DEFAULT 0,
    deleted_at      TIMESTAMPTZ,

    CONSTRAINT order_items_pkey PRIMARY KEY (id),
    CONSTRAINT order_items_order_id_fk FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT order_items_menu_item_id_fk FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE RESTRICT,
    CONSTRAINT order_items_quantity_check CHECK (quantity > 0),
    CONSTRAINT order_items_price_check CHECK (price >= 0)
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

CREATE TRIGGER trg_order_items_updated_at
    BEFORE UPDATE ON order_items
    FOR EACH ROW
    EXECUTE FUNCTION yes_set_updated_at();


-- 7. reservations table
CREATE TABLE IF NOT EXISTS reservations (
    id              UUID        NOT NULL DEFAULT gen_random_uuid(),
    user_id         UUID,                                     -- Optional customer reference
    customer_name   TEXT        NOT NULL,
    customer_phone  TEXT        NOT NULL,
    customer_email  TEXT        NOT NULL,
    reservation_date DATE       NOT NULL,
    time_slot       TIME        NOT NULL,
    party_size      INT         NOT NULL,
    table_number    INT,                                      -- Assigned table
    status          TEXT        NOT NULL DEFAULT 'PENDING',    -- PENDING, CONFIRMED, SEATED, COMPLETED, CANCELLED, NO_SHOW

    -- Mandatory audit columns
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by      TEXT        NOT NULL DEFAULT 'SYSTEM',
    version         BIGINT      NOT NULL DEFAULT 0,
    deleted_at      TIMESTAMPTZ,

    CONSTRAINT reservations_pkey PRIMARY KEY (id),
    CONSTRAINT reservations_user_id_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT reservations_status_check CHECK (status IN ('PENDING', 'CONFIRMED', 'SEATED', 'COMPLETED', 'CANCELLED', 'NO_SHOW')),
    CONSTRAINT reservations_party_size_check CHECK (party_size > 0)
);

CREATE INDEX IF NOT EXISTS idx_reservations_date_time ON reservations(reservation_date, time_slot);
CREATE INDEX IF NOT EXISTS idx_reservations_user_id ON reservations(user_id);

CREATE TRIGGER trg_reservations_updated_at
    BEFORE UPDATE ON reservations
    FOR EACH ROW
    EXECUTE FUNCTION yes_set_updated_at();


-- 8. payments table
CREATE TABLE IF NOT EXISTS payments (
    id              UUID        NOT NULL DEFAULT gen_random_uuid(),
    order_id        UUID        NOT NULL,
    amount          NUMERIC(19,4) NOT NULL,
    payment_status  TEXT        NOT NULL,                     -- PENDING, COMPLETED, FAILED
    transaction_id  TEXT,
    payment_method  TEXT        NOT NULL,                     -- CARD, UPI, NET_BANKING, CASH

    -- Mandatory audit columns
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by      TEXT        NOT NULL DEFAULT 'SYSTEM',
    version         BIGINT      NOT NULL DEFAULT 0,
    deleted_at      TIMESTAMPTZ,

    CONSTRAINT payments_pkey PRIMARY KEY (id),
    CONSTRAINT payments_order_id_fk FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE RESTRICT,
    CONSTRAINT payments_amount_check CHECK (amount >= 0)
);

CREATE UNIQUE INDEX IF NOT EXISTS udx_payments_order_id ON payments(order_id) WHERE deleted_at IS NULL;

CREATE TRIGGER trg_payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION yes_set_updated_at();
