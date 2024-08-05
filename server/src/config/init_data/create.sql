-- Create the users table
CREATE TABLE IF NOT EXISTS users (
  username VARCHAR(50) PRIMARY KEY,
  password VARCHAR(256),
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  email VARCHAR(50),
  profile_img TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Added default value
  trips_taken INTEGER
);

-- Friends table
CREATE TABLE IF NOT EXISTS friendships (
  friendship_id SERIAL PRIMARY KEY,
  user1_id VARCHAR(50) REFERENCES users(username), 
  user2_id VARCHAR(50) REFERENCES users(username), 
  status VARCHAR(20) NOT NULL, -- "pending", "accepted", "rejected"
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the trip table
CREATE TABLE IF NOT EXISTS trips (
  trip_id SERIAL PRIMARY KEY,
  driver_id VARCHAR(50) REFERENCES users(username), 
  destination VARCHAR(255),
  original_location VARCHAR(255),
  active BOOLEAN DEFAULT TRUE,
  payment_req BOOLEAN,
  leaving_time TIMESTAMP,
  max_passengers INTEGER,
  current_passengers INTEGER DEFAULT 0,
  public BOOLEAN
);

-- Create the trip_requests table
CREATE TABLE IF NOT EXISTS trip_requests (
  trip_request_id SERIAL PRIMARY KEY,
  trip_id INTEGER REFERENCES trips(trip_id),
  requester_id VARCHAR(50) REFERENCES users(username),
  request_status VARCHAR(20) NOT NULL -- "pending", "accepted", "rejected"
);

-- Create the passengers table
-- CREATE TABLE IF NOT EXISTS passengers (
--   trip_id integer,
--   passenger varchar(50) REFERENCES users(username),
--   FOREIGN KEY (trip_id) REFERENCES trips(trip_id)
-- );

-- -- Create the function to update current_passengers
-- CREATE OR REPLACE FUNCTION update_current_passengers()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   -- Update the current_passengers count in the trips table
--   UPDATE trips
--   SET current_passengers = (
--     SELECT COUNT(*)
--     FROM passengers
--     WHERE trip_id = NEW.trip_id
--   )
--   WHERE trip_id = NEW.trip_id;

--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;

-- -- Create trigger for after insert on passengers
-- CREATE TRIGGER after_passenger_insert
-- AFTER INSERT ON passengers
-- FOR EACH ROW
-- EXECUTE FUNCTION update_current_passengers();

-- -- Create trigger for after delete on passengers
-- CREATE TRIGGER after_passenger_delete
-- AFTER DELETE ON passengers
-- FOR EACH ROW
-- EXECUTE FUNCTION update_current_passengers();
