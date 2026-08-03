SELECT 
    'CREATE TABLE ' || table_name || ' (' || 
    string_agg(column_name || ' ' || data_type || 
        CASE WHEN is_nullable = 'NO' THEN ' NOT NULL' ELSE '' END, ', ') || ');' AS schema_sql
FROM information_schema.columns
WHERE table_schema = 'public'
GROUP BY table_name;