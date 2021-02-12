# Welcome to Nodeflow!
### Author: Ajk
## Plan: 
### 1. Store idtoken, username, and profilePic in a database 
### 2. Save idtoken as a cookie for the user | DONE
### 3. When users go to /Flow the GET Request will get the cookie
### 4. Once it has the cookie it will check in the database if there is any record of the same cookie
### 5. Since you know that's the user you can get their username among other information because you identified the user with the id token
### 6. Get all the data back
### 7. Render the data in /Flow
### 8. If the user signs out remove the cookie | DONE