-- =============================================================================
-- YES Standard: Auto-update updated_at trigger
-- Flyway Migration V0_1__create_audit_trigger.sql
-- =============================================================================

CREATE OR REPLACE FUNCTION yes_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
