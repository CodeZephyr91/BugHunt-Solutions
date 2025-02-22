# DebugIt Issues :
## 1.Missing Root Route('/'):
### Description: When making a GET request to `http://localhost:3000/`, a 404 not found error occurs.
### The server does not have any route handler for '/'

## 2.Hardcoded JWT Secret Key and PORT
### Description: Secret keys, client id, mongodb uri, port no. etc must not be hardcoded in order to prevent security risks