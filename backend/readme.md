# Backend for Campus Hire

### Install required dependencies

### Setup the server

### Set the structure of the backend

### Configure env file

### Setup the db connection


### Created the schemas
- admin
- student
- company
- internship
- job
- interned (to be done)
- placed (to be done)


- admin will be given an unique identification of 5 digit during registration



## Admin Routes

### Register Endpoint, Payload and Response
- POST: `/admin/register`

```json
{
  "id": "12345",
  "name": "John Doe",
  "email": "admin@example.com",
  "password": "SecurePass123"
}
```

```json
{
  "success": true, 
  "message": "Admin registered successfully",
  "token": "jwt_token"
}
```


### Login Endpoint, Payload and Response
- POST: `/admin/login`

```json
{
    "email": "admin@gmail.com",
    "password": "12345"
}
```

```json
{
    "success": true,
    "message": "Admin logged in successfully",
    "token": "jwt_token"
}
```


### Logout Endpoint, Payload and Response
- GET: `admin/logout`

```json
{

}
```


## Student Routes

### Register Endpoint, Payload and Response
- POST: `/student/register`

```json
{
  "rollNumber": "1023*****",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "9876543210",
  "branch": "Computer Science",
  "semester": "4",
  "password": "SecurePass123"
}
```


```json
{
  "success": true, 
  "message": "Student registered successfully",
  "token": "jwt_token"
}
```


### Login Endpoint, Payload and Response
- POST: `/student/login`

```json
{
  "rollNumber": "1023*****",
  "password": "SecurePass123"
}
```


```json
{
  "success": true, 
  "message": "Admin logged in successfully",
  "token": "jwt_token"
}
```



### Logout Endpoint, Payload and Response
- GET: `/student/logout`

```json
{
    
}
```