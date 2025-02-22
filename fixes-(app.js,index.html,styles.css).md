# app.js,index.html,styles.css-Fixes

## 1.Security Issue-Storing user credentials in local storage
- Remove password storage from localStorage
- Use secure authentication mechanisms like HTTP-only cookies

## 2.API URL hardcoded
Using environment variables to store API URL dynamically 
### Create a config.js file
```js
const CONFIG={
    API_URL: 'http://localhost:3000'
};
```
### Modify the index.html file
```html
<script src="config.js"></script>
<script src="app.js"></script>
```
### Update app.js
```js
const API_URL = CONFIG.API_URL;
```
##  3.Not clearing the token on logout
```js
const handleLogout = (e) => {
    e.preventDefault();
    removeToken();
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_password');
    showAuth();
};
```
## 4.Fetching data despite a missing token
Check for token existence before making API requests:
```js
const token = getToken();
if (!token) {
    throw new Error("Unauthorized: No token found");
}
```
## 5.Login error not resetting
If a user fails to log in multiple times, the previous error message remains visible
Resetting error message before setting new one:
```js
elements.loginError.textContent = '';
elements.loginError.textContent = error.message;
```
## 6.Incorrect task updation in handleTaskToggle as API call may fail
UI must be updated only if the API call succeeds
```js
const handleTaskToggle = async (id, completed) => {
    try {
        await api.updateTask(id, { completed });
        updateTaskInUI(id, { completed });
    } catch (error) {
        console.error(error.message);
        alert("Failed to update task status.");
    }
};
```




