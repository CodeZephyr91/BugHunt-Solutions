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
##  3. Unhandled Errors in API requests
Parsing the response after confirming it is OK and indeed can be parsed into JSON
Example:
```js
async getUserData() {
    try {
        const response = await fetch(`${API_URL}/user`, {
            headers: { 'Authorization': `Bearer ${getToken()}` },
        });
        if (!response.ok) throw new Error('Failed to fetch user data');
        return await response.json();
    } catch (error) {
        throw new Error(error.message);
    }
}
```

