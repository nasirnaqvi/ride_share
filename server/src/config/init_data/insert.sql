INSERT INTO users (username,password,first_name,last_name,email,created_at,trips_taken) 
VALUES 
    ('admin', '$2b$10$KOpRpi609tq1y3HQXZAjfOjxkef8D1uJCdq.tiBysyS71S4HyG/8m', 'admin', 'admin', 'admin@gmail.com', '2000-01-01 00:00:00', 0),
    ('user1', '$2b$10$sXYwkk7jjYA5dMg/HVAK2uNCce0/m3yw0V19ajo4PGWMoJLqXrr9C', 'user1', 'user1', 'user1@gmail.com', '2000-01-01 00:00:00', 0),
    ('user2', '$2b$10$sXYwkk7jjYA5dMg/HVAK2uNCce0/m3yw0V19ajo4PGWMoJLqXrr9C', 'user2', 'user2', 'user2@gmail.com', '2000-01-01 00:00:00', 0),
    ('user3', '$2b$10$sXYwkk7jjYA5dMg/HVAK2uNCce0/m3yw0V19ajo4PGWMoJLqXrr9C', 'user3', 'user3', 'user3@gmail.com', '2000-01-01 00:00:00', 0),
    ('user4', '$2b$10$sXYwkk7jjYA5dMg/HVAK2uNCce0/m3yw0V19ajo4PGWMoJLqXrr9C', 'user4', 'user4', 'user4@gmail.com', '2000-01-01 00:00:00', 0),
    ('user5', '$2b$10$sXYwkk7jjYA5dMg/HVAK2uNCce0/m3yw0V19ajo4PGWMoJLqXrr9C', 'user5', 'user5', 'user5@gmail.com', '2000-01-01 00:00:00', 0);

-- Demo trip data for initialization
INSERT INTO trips (driver_id, destination_location, original_location, destination_latlong, original_latlong, active, payment_req, leaving_time, max_passengers)
VALUES 
  ('user1', 'Boulder, CO', 'Red Rocks Amphitheatre, Golden, CO', ARRAY[-105.2705, 40.0150], ARRAY[-105.2052, 39.6655], TRUE, TRUE, '2024-06-01 10:00:00', 3),
  ('user2', 'Lakewood, CO', 'Silverthorne, CO', ARRAY[-105.0814, 39.7047], ARRAY[-106.0713, 39.6296], TRUE, FALSE, '2024-06-02 08:30:00', 4),
  ('user3', 'Fort Collins, CO', 'Cheyenne, WY', ARRAY[-105.0844, 40.5853], ARRAY[-104.8202, 41.1400], TRUE, TRUE, '2024-06-03 11:45:00', 5),
  ('user4', 'Colorado Springs, CO', 'Durango, CO', ARRAY[-104.8214, 38.8339], ARRAY[-107.8801, 37.2753], FALSE, TRUE, '2024-06-04 09:15:00', 2),
  ('user5', 'Boulder, CO', 'Nederland, CO', ARRAY[-105.2705, 40.0150], ARRAY[-105.5108, 39.9614], TRUE, FALSE, '2024-06-05 14:00:00', 1);

-- Adding friendships between user1, user3, and user5
INSERT INTO friendships (user1_id, user2_id, status)
VALUES ('user1', 'user3', 'accepted'),
       ('user1', 'user5', 'accepted'),
       ('user2', 'user4', 'accepted');

-- Demo passenger data for initialization
INSERT INTO passengers (trip_id, passenger)
VALUES (1, 'user2'),
       (1, 'user3');