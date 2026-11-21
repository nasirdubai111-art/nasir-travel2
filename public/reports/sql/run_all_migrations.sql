-- ============================================================================
-- BHARATYATRA COMPLETE DATABASE INITIALIZATION RUNNER
-- Executes all 12 SQL scripts in exact topological dependency order.
-- ============================================================================

\ir 01_schema_extensions.sql
\ir 02_root_tables.sql
\ir 03_customer_partner_tables.sql
\ir 04_booking_inventory_tables.sql
\ir 05_payment_finance_tables.sql
\ir 06_foreign_keys_indexes.sql
\ir 07_functions_triggers.sql
\ir 08_views_reporting.sql
\ir 09_rls_policies.sql
\ir 10_rbac_roles_permissions.sql
\ir 11_master_seed_data.sql
\ir 12_database_validation.sql
