

-- 1. Create Custom ENUM Type for Roles
CREATE TYPE user_role AS ENUM ('student', 'teacher', 'staff', 'admin');

-- 2. Create Core USERS Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role user_role NOT NULL DEFAULT 'student',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Create Student Profiles Table
CREATE TABLE student_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    student_number VARCHAR(50) UNIQUE NOT NULL,
    grade_level VARCHAR(20),
    enrollment_date DATE DEFAULT CURRENT_DATE
);

-- 4. Create Employee Profiles Table (Teachers & Staff)
CREATE TABLE employee_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    employee_number VARCHAR(50) UNIQUE NOT NULL,
    department VARCHAR(100),
    office_location VARCHAR(100),
    hire_date DATE DEFAULT CURRENT_DATE
);

-- 5. Automated updated_at Timestamp Trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 6. ROW LEVEL SECURITY (RLS) & POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_profiles ENABLE ROW LEVEL SECURITY;

-- --- READ POLICIES ---
-- Allow any authenticated user (logged-in team member/client) to view records
CREATE POLICY "Allow authenticated users to read users"
  ON users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to read student profiles"
  ON student_profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to read employee profiles"
  ON employee_profiles FOR SELECT
  TO authenticated
  USING (true);

-- --- WRITE POLICIES ---
-- Allow users to update their own main user record
CREATE POLICY "Allow users to update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Allow authenticated users (e.g. teachers/staff/admins) full access to create/update student profiles
CREATE POLICY "Allow teachers and staff to manage student profiles"
  ON student_profiles FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('teacher', 'staff', 'admin')
    )
  );

-- Allow admins and staff to manage employee profiles
CREATE POLICY "Allow staff and admins to manage employee profiles"
  ON employee_profiles FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('staff', 'admin')
    )
  );