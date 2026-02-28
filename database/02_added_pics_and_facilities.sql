ALTER TABLE desks ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE desks ADD COLUMN IF NOT EXISTS facilities TEXT[];

UPDATE desks
SET 
    image_url = 'https://images.unsplash.com/photo-1618939979101-263e3f03f202?auto=format&fit=crop&w=800&q=80',
    facilities = ARRAY['Scaun Ergonomic', 'Lumină Naturală']
WHERE id = 1;

UPDATE desks
SET 
    image_url = 'https://images.unsplash.com/photo-1531973576160-7125cd663d86?auto=format&fit=crop&w=800&q=80',
    facilities = ARRAY['Scaun Ergonomic', 'Liniște']
WHERE id = 2;

UPDATE desks
SET 
    image_url = 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80',
    facilities = ARRAY['Scaun Ergonomic', 'Monitor 4K', 'Privat']
WHERE id = 3;