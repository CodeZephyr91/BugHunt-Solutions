# DebugIt Issues :
## 1.Missing Root Route('/'):
Description: When making a GET request to `http://localhost:3000/`, a 404 not found error occurs.
The server does not have any route handler for '/'

## 2.Hardcoded JWT Secret Key and PORT
Description: Secret keys, client id, mongodb uri, port no. etc must not be hardcoded in order to prevent security risks

## 3.Unnecessary async in "/register" route:
Description:
- The function does not use **await** anywhere.
- `users.find(u => u.email === email)` is **synchronous**.
- `jwt.sign(payload, secret)` is **synchronous** (without a callback).
- Using `async` here is **redundant** and **misleading**.

## Incorrect status code for "User not found" in '/login' route
Description:
- In the `/login` route, when a user is not found, the response status is set to `400 Bad Request` instead of `404 Not Found`.
- `400` is used for client-side errors like invalid input, but `404` is more appropriate for missing resources.

## Redundant and unecessary async in '/login' route
Description:
The app.post('/login', async (req, res) => {...}) function is marked as async, but no asynchronous operations (such as await) are used inside it.
This makes the async keyword unnecessary and redundant.

##  Missing res.status(200) in successful login response
Description:
As a standard practice, the response must be returned with an apt status code, for successful login, it must be 200 OK.

## Incorrect status code for "Invalid Token" in authenticateToken middleware
Description:
The status code mentioned for invalid token is 403 signifying forbidden or lack of permission. 401 unauthorized indicates authentication failure.

## Potential error with splitting Authorization Header
if authHeader is malformed, 
```js
authHeader.split(' ')[1]
```
may return undefined which can cause runtime errors.