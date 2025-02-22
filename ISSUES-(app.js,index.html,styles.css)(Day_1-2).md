# DebugIt Issues
## app.js,index.html,styles.css-Issues

## 1.Security Issue-Storing user credentials in local storage
Storing passwords in local Storage is a security risk as local storage is easily accessible via javascript.

## 2.API URL hardcoded
The **API_URL** is hardcoded as **http://localhost:3000**, which will break in production.