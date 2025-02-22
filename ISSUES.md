# DebugIt Issues :
# server.js(Day_1-2): 
## 1.Missing Root Route('/'):
Description: When making a GET request to `http://localhost:3000/`, a 404 not found error occurs.
The server does not have any route handler for '/'

## 2.Hardcoded JWT Secret Key and PORT
Description: Secret keys, client id, mongodb uri, port no. etc must not be hardcoded in order to prevent security risks

## 3.Storing plain text password in '/register' route
Instead of storing user password in plain text, they must be stored securely via hashing using bcrypt

## 4.Storing plain text password in '/login' route
Instead of storing user password in plain text, they must be stored securely via hashing using bcrypt

## 5.Incorrect status code for "User not found" in '/login' route
Description:
- In the `/login` route, when a user is not found, the response status is set to `400 Bad Request` instead of `404 Not Found`.
- `400` is used for client-side errors like invalid input, but `404` is more appropriate for missing resources.

## 6.Missing res.status(200) in successful login response
Description:
As a standard practice, the response must be returned with an apt status code, for successful login, it must be 200 OK.

## 7.Optimization via chaining for authHeader splitting in authentication middleware
Instead of writing 
```js
const token=authHeader && authHeader.split(' ')[1]
```
we can optimize this by chaining

## 8.Missing Explicit Status Code in '/user' Route
As per standard practice, for successful response, status 200 OK ought to be sent

## 9.Missing Title Validation in `/tasks` Route
If a valid title is not there in the req body, then a status of 400 must be returned along with an appropriate message

## 10. Check for missing Tasks for a given user in '/tasks' route
In case usertasks for a given user is empty an appropriate response error message along with status 404 must be returned

## 11. Explicit status for successful response in '/tasks' route
Explicit status of 200 OK must be sent for successful response

## 12. In the put request route '/tasks/:id', check for valid taskID missing
In case the taskID is not valid or is NaN it cannot be parsed to an integer.It may also be parsed to a value invalid for being an apt task ID.

## 13. Valid id check missing in the delete request route for '/tasks/:id' 
In case the taskID is not valid or is NaN it cannot be parsed into an integer. It may also be parsed to a value invalid for being an apt task ID.

## 14. MongoDB Connection not implemented
Currently the server uses arrays to store the data of users and tasks however all data is lost when the server restarts thus causing lack of consistency. A database like MongoDB must be used to maintain persistent data in a secure manner.

## 15.Better Password Policy
Instead of allowing weak passwords, a library like validator.js should be used to enforce a strong password policy (e.g., requiring uppercase letters, special characters, and minimum length).


