const userData = [ //Do not change name
    {
        "username": "admin",
        "password": "$2b$10$KOpRpi609tq1y3HQXZAjfOjxkef8D1uJCdq.tiBysyS71S4HyG/8m",
        "firstName": "admin",
        "lastName": "admin",
        "email": "admin@gmail.com",
        "createdAt": { "$date": "2000-01-01T00:00:00Z" },
        "trips_taken": 0
    },
    {
        "username": "user1",
        "password": "$2b$10$sXYwkk7jjYA5dMg/HVAK2uNCce0/m3yw0V19ajo4PGWMoJLqXrr9C",
        "firstName": "user1",
        "lastName": "user1",
        "email": "user1@gmail.com",
        "createdAt": { "$date": "2000-01-01T00:00:00Z" },
        "trips_taken": 0
    },
    {
        "username": "user2",
        "password": "$2b$10$sXYwkk7jjYA5dMg/HVAK2uNCce0/m3yw0V19ajo4PGWMoJLqXrr9C",
        "firstName": "user2",
        "lastName": "user2",
        "email": "user2@gmail.com",
        "createdAt": { "$date": "2000-01-02T00:00:00Z" },
        "trips_taken": 0
    },
    {
        "username": "user3",
        "password": "$2b$10$sXYwkk7jjYA5dMg/HVAK2uNCce0/m3yw0V19ajo4PGWMoJLqXrr9C",
        "firstName": "user3",
        "lastName": "user3",
        "email": "user3@gmail.com",
        "createdAt": { "$date": "2000-01-03T00:00:00Z" },
        "trips_taken": 0
    },
    {
        "username": "user4",
        "password": "$2b$10$sXYwkk7jjYA5dMg/HVAK2uNCce0/m3yw0V19ajo4PGWMoJLqXrr9C",
        "firstName": "user4",
        "lastName": "user4",
        "email": "user4@gmail.com",
        "createdAt": { "$date": "2000-01-04T00:00:00Z" },
        "trips_taken": 0
    },
    {
        "username": "user5",
        "password": "$2b$10$sXYwkk7jjYA5dMg/HVAK2uNCce0/m3yw0V19ajo4PGWMoJLqXrr9C",
        "firstName": "user5",
        "lastName": "user5",
        "email": "user5@gmail.com",
        "createdAt": { "$date": "2000-01-05T00:00:00Z" },
        "trips_taken": 0
    }
];
const tripData = [ //Do not change name
    {
        "driverID": { "$oid": "6657ce63230a6eec300a21d6" },
        "destination": "New York City",
        "origin": "Boston",
        "departureTime": { "$date": "2024-06-01T08:00:00Z" },
        "arrivalTime": { "$date": "2024-06-01T12:00:00Z" },
        "active": true,
        "otherUsers": [
            { "$oid": "6657ce63230a6eec300a21d7" },
            { "$oid": "6657ce63230a6eec300a21d8" }
        ],
        "public": true
    },
    {
        "driverID": { "$oid": "6657ce63230a6eec300a21d7" },
        "destination": "Los Angeles",
        "origin": "San Francisco",
        "departureTime": { "$date": "2024-06-02T09:00:00Z" },
        "arrivalTime": { "$date": "2024-06-02T15:00:00Z" },
        "active": false,
        "otherUsers": [
            { "$oid": "6657ce63230a6eec300a21d9" },
            { "$oid": "6657ce63230a6eec300a21da" }
        ],
        "public": false
    },
    {
        "driverID": { "$oid": "6657ce63230a6eec300a21d8" },
        "destination": "Chicago",
        "origin": "Detroit",
        "departureTime": { "$date": "2024-06-03T07:00:00Z" },
        "arrivalTime": { "$date": "2024-06-03T10:00:00Z" },
        "active": true,
        "otherUsers": [
            { "$oid": "6657ce63230a6eec300a21d6" },
            { "$oid": "6657ce63230a6eec300a21da" }
        ],
        "public": true
    }
];

module.exports = { userData, tripData };
