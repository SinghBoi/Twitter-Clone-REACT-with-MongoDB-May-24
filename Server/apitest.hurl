# Sign up user 1
POST http://localhost:9000/signup
{
"name": "User 1",
"email": "user1@gmail.com",
"password": "TopSecret1!",
"username": "user1",
"about": "I am a developer",
"employment": "Developer",
"hometown": "Göteborg",
"website": "https://www.developer.com"
}
HTTP 201
[Asserts]
jsonpath "$.userId" != null
[Captures]
user-id-1: jsonpath "$.userId"

# Sign up user 2
POST http://localhost:9000/signup
{
"name": "User 2",
"email": "user2@gmail.com",
"password": "TopSecret2!",
"username": "user2",
"about": "I am a tester",
"employment": "Tester",
"hometown": "Landvetter",
"website": "https://www.tester.com"
}
HTTP 201
[Asserts]
jsonpath "$.userId" != null
[Captures]
user-id-2: jsonpath "$.userId"

# Login user 1
POST http://localhost:9000/login
{
"email": "user1@gmail.com",
"password": "TopSecret1!"
}
HTTP 200

# Get user profile
GET http://localhost:9000/profile
Authorization: Bearer {{user-id-1}}
HTTP 200
[Asserts]
jsonpath "$.name" == "User 1"
jsonpath "$.email" == "user1@gmail.com"
jsonpath "$.username" == "user1"
jsonpath "$.about" == "I am a developer"
jsonpath "$.employment" == "Developer"
jsonpath "$.hometown" == "Göteborg"
jsonpath "$.website" == "https://www.developer.com"

# Get user profile by ID
GET http://localhost:9000/users/{{user-id-2}}
Authorization: Bearer {{user-id-1}}
HTTP 200
[Asserts]
jsonpath "$.name" == "User 2"
jsonpath "$.email" == "user2@gmail.com"
jsonpath "$.username" == "user2"
jsonpath "$.about" == "I am a tester"
jsonpath "$.employment" == "Tester"
jsonpath "$.hometown" == "Landvetter"
jsonpath "$.website" == "https://www.tester.com"

# Post a new tweet
POST http://localhost:9000/tweets
Authorization: Bearer {{user-id-1}}
{
"text": "Hello, world! #first"
}
HTTP 201
[Asserts]
jsonpath "$.text" == "Hello, world! #first"

# Post a second tweet
POST http://localhost:9000/tweets
Authorization: Bearer {{user-id-1}}
{
"text": "I like dogs #dogsarethebest"
}
HTTP 201
[Asserts]
jsonpath "$.text" == "I like dogs #dogsarethebest"

# Post a third tweet
POST http://localhost:9000/tweets
Authorization: Bearer {{user-id-1}}
{
"text": "Poodles are the best dogs #poodles #dogsarethebest"
}
HTTP 201
[Asserts]
jsonpath "$.text" == "Poodles are the best dogs #poodles #dogsarethebest"

# Login user 2
POST http://localhost:9000/login
{
"email": "user2@gmail.com",
"password": "TopSecret2!"
}
HTTP 200

# Follow user 1
POST http://localhost:9000/users/{{user-id-1}}/follow
Authorization: Bearer {{user-id-2}}
HTTP 200

# Get recent tweets from followed users
GET http://localhost:9000/tweets
Authorization: Bearer {{user-id-2}}
HTTP 200
[Asserts]
jsonpath "$[0].text" == "Poodles are the best dogs #poodles #dogsarethebest"
jsonpath "$[0].name" == "User 1"
jsonpath "$[0].username" == "user1"

# Unfollow user 1
POST http://localhost:9000/users/{{user-id-1}}/unfollow
Authorization: Bearer {{user-id-2}}
HTTP 200

# Get recent tweets from followed users (should be none)
GET http://localhost:9000/tweets
Authorization: Bearer {{user-id-2}}
HTTP 200
[Asserts]
jsonpath "$" count == 0

# Get recent tweets from a specific user
GET http://localhost:9000/tweets/users/{{user-id-1}}
Authorization: Bearer {{user-id-2}}
HTTP 200
[Asserts]
jsonpath "$[0].text" == "Poodles are the best dogs #poodles #dogsarethebest"
jsonpath "$[0].name" == "User 1"
jsonpath "$[0].username" == "user1"

# Follow user 1 again
POST http://localhost:9000/users/{{user-id-1}}/follow
Authorization: Bearer {{user-id-2}}
HTTP 200

# Get trending hashtags
GET http://localhost:9000/tweets/trending
Authorization: Bearer {{user-id-2}}
HTTP 200
[Asserts]
jsonpath "$[0]" == "#dogsarethebest"
jsonpath "$[1]" == "#poodles"
jsonpath "$[2]" == "#first"

# Search for users
GET http://localhost:9000/search?find=User
Authorization: Bearer {{user-id-2}}
HTTP 200
[Asserts]
jsonpath "$.tweets" count == 0
jsonpath "$.users" count == 2

# Search for tweets
GET http://localhost:9000/search?find=Hello
Authorization: Bearer {{user-id-2}}
HTTP 200
[Asserts]
jsonpath "$.tweets" count == 1