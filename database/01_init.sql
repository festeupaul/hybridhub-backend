CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role VARCHAR(20) DEFAULT 'employee'
);

CREATE TABLE desks (
    id SERIAL PRIMARY KEY,
    label VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE reservations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    desk_id INTEGER REFERENCES desks(id) ON DELETE CASCADE,
    reservation_date DATE NOT NULL,
    UNIQUE(desk_id, reservation_date) 
);

INSERT INTO users (name, email, role) VALUES 
('Paul Festeu', 'paul@hybridhub.com', 'admin'),
('Andrei Popescu', 'andrei@hybridhub.com', 'employee');

INSERT INTO desks (label) VALUES 
('Birou A1 - Geam'), ('Birou A2 - Mijloc'), ('Sala Ședințe - Etaj 1'); 