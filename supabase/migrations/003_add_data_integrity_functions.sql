-- Add data integrity functions

-- Function to find duplicate shopping items in the same list
CREATE OR REPLACE FUNCTION find_duplicate_shopping_items()
RETURNS TABLE (
  shopping_list_id UUID,
  name TEXT,
  count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    si.shopping_list_id,
    si.name,
    COUNT(*) as count
  FROM 
    shopping_items si
  GROUP BY 
    si.shopping_list_id, si.name
  HAVING 
    COUNT(*) > 1
  ORDER BY 
    si.shopping_list_id, si.name;
END;
$$ LANGUAGE plpgsql;

-- Function to find orphaned shopping items (items without a shopping list)
CREATE OR REPLACE FUNCTION find_orphaned_shopping_items()
RETURNS TABLE (
  id UUID,
  name TEXT,
  shopping_list_id UUID
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    si.id,
    si.name,
    si.shopping_list_id
  FROM 
    shopping_items si
  LEFT JOIN 
    shopping_lists sl ON si.shopping_list_id = sl.id
  WHERE 
    sl.id IS NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to find orphaned shopping lists (lists without a household)
CREATE OR REPLACE FUNCTION find_orphaned_shopping_lists()
RETURNS TABLE (
  id UUID,
  name TEXT,
  household_id UUID
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sl.id,
    sl.name,
    sl.household_id
  FROM 
    shopping_lists sl
  LEFT JOIN 
    households h ON sl.household_id = h.id
  WHERE 
    h.id IS NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to find shopping items with invalid status
CREATE OR REPLACE FUNCTION find_invalid_status_shopping_items()
RETURNS TABLE (
  id UUID,
  name TEXT,
  status TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    si.id,
    si.name,
    si.status
  FROM 
    shopping_items si
  WHERE 
    si.status NOT IN ('pending', 'purchased', 'not_needed');
END;
$$ LANGUAGE plpgsql;

-- Function to find appointments with invalid status
CREATE OR REPLACE FUNCTION find_invalid_status_appointments()
RETURNS TABLE (
  id UUID,
  title TEXT,
  status TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    a.title,
    a.status
  FROM 
    appointments a
  WHERE 
    a.status NOT IN ('scheduled', 'completed', 'cancelled');
END;
$$ LANGUAGE plpgsql;

-- Function to find baby names with invalid status
CREATE OR REPLACE FUNCTION find_invalid_status_baby_names()
RETURNS TABLE (
  id UUID,
  name TEXT,
  status TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    bn.id,
    bn.name,
    bn.status
  FROM 
    baby_names bn
  WHERE 
    bn.status NOT IN ('liked', 'disliked', 'maybe');
END;
$$ LANGUAGE plpgsql;

-- Function to find hospital bag items with invalid status
CREATE OR REPLACE FUNCTION find_invalid_status_hospital_bag_items()
RETURNS TABLE (
  id UUID,
  name TEXT,
  status TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    hbi.id,
    hbi.name,
    hbi.status
  FROM 
    hospital_bag_items hbi
  WHERE 
    hbi.status NOT IN ('packed', 'not_packed', 'not_needed');
END;
$$ LANGUAGE plpgsql; 