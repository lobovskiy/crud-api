# CRUD API

## General info

Simple Node.js CRUD API using in-memory database underneath.

To clone the repository run:

`git clone https://github.com/lobovskiy/crud-api.git <path/to/your/folder-name>`

## Available scripts

### `npm run start:dev`

Starts the project in the development mode.

### `npm run start:prod`

Starts the project in the production mode.

### `npm run start:multi`

Starts the project using horizontal scaling with a load balancer that distributes the load across processor cores.

### `npm run test`

Starts tests for different scenarios of using the app API.

### `npm run build`

Builds the app for production to the `dist` folder.

## API methods

  - **GET** `api/users` is used to get all persons
      - **200** returns an array of all users
  - **GET** `api/users/{userId}` 
      - returns **200** and object with `id === userId` if it exists
      - returns **400** and object with error message if `userId` is invalid (not `uuid`)
      - returns **404** and object with error message if record with `id === userId` doesn't exist
  - **POST** `api/users` is used to create record about new user and store it in database
      - returns **201** and object with newly created record
      - returns **400** and object with error message if request `body` does not contain **required** fields
  - **PUT** `api/users/{userId}` is used to update existing user
      - returns **200** and object with updated user
      - returns **400** and object with error message if `userId` is invalid (not `uuid`)
      - returns **404** and object with error message if record with `id === userId` doesn't exist
  - **DELETE** `api/users/{userId}` is used to delete existing user from database
      - returns **204** if the record is found and deleted
      - returns **400** and object with error message if `userId` is invalid (not `uuid`)
      - returns **404** and object with error message if record with `id === userId` doesn't exist

## Technologies

Tools used for development:

- [EditorConfig](https://editorconfig.org/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)

  _Note: to use autoformatting with Prettier please make sure that [Prettier is installed and configured as a default formatter in your IDE](https://prettier.io/docs/en/editors.html)._
