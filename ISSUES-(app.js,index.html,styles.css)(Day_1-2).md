# DebugIt Issues
## app.js,index.html,styles.css-Issues

## 1.Security Issue-Storing user credentials in local storage
Storing passwords in local Storage is a security risk as local storage is easily accessible via javascript.

## 2.API URL hardcoded
The **API_URL** is hardcoded as **http://localhost:3000**, which will break in production.

## 3.Not clearing the token on logout
The token is removed without removing the stored user details(user name and email)

## 4.Fetching data despite a missing token
If **getToken()** returns null, the request will still be sent with an invalid Authorization header

## 5.Login error not resetting
If a user fails to log in multiple times, the previous error message remains visible

## 6.Incorrect task updation in handleTaskToggle as API call may fail
The task state is updated in UI first, but if the API call fails, it does not revert.

UI must be updated only if the API call is successful
