-- Create the users table
CREATE TABLE IF NOT EXISTS users (
  username varchar(50) PRIMARY KEY,
  password varchar(256),
  first_name varchar(50),
  last_name varchar(50),
  email varchar(50),
  profile_img BYTEA,
  created_at timestamp,
  trips_taken integer
);
