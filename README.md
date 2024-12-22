
---

# Devtree Clone Backend

This project is a backend implementation of a Devtree clone, created using TypeScript and React. It uses Express for the backend framework, Express Validator for data validation, and Mongoose for MongoDB interaction.

## Installation

You can install the necessary dependencies using one of the following package managers:

- **Yarn**  
  `yarn install`

- **npm**  
  `npm install`

- **Bun**  
  `bun install`

## Running the Project

To run the project after compilation, use one of the following commands:

- **Yarn**  
  `yarn dev`

- **npm**  
  `npm run dev`

Make sure to have MongoDB running locally or use a cloud-based instance to store your data.

## Available Endpoint

### Register User

- **URL**: `http://127.0.0.1:4000/auth/register`
- **Method**: `POST`
  
### Request Body:
```json
{
    "handle": "<string>",     // Unique user handle (string)
    "name": "<string>",        // User's full name (string)
    "email": "<string>",  // User's email address (string)
    "password": "<string>"   // User's password (string)
}
```

### Response:
The server will respond with a status indicating whether the registration was successful or if any validation errors occurred.

## Technologies Used
- **Express** - Backend framework
- **Express Validator** - Middleware for validation
- **Mongoose** - MongoDB ODM (Object Data Modeling)
- **TypeScript** - Type-safe JavaScript
- **React** - Frontend framework (mentioned for the full stack context)

## Future Updates
- More endpoints will be added for user authentication and additional functionality.

---
