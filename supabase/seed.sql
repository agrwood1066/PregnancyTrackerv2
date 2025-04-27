-- This is a seed file for testing purposes
-- It will be run when you reset your database

-- Insert sample households
INSERT INTO public.households (id, name)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Smith Family'),
  ('00000000-0000-0000-0000-000000000002', 'Johnson Family');

-- Note: The following inserts will only work after users have been created
-- and their profiles have been automatically created by the trigger

-- Sample data will be inserted when users are created and households are assigned 