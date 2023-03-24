# Fastify API Example

This is an example RESTful API using Fastify JS and TypeScript.

## Technology Used

- TypeScript
- FastifyJS
- Zod

## Project Setup

### Create Self-signed Certificates for https communication

An SSL certificate encrypts communication between your sever and clients.

A self-signed certificates cannot be used by a user to validate the identify of your server automatically. To do this, you have to use a CA-signed certificate (ex. by using Let's Encrypt)

To create a self-signed certificate, follow the steps below (taken from [How to Create an HTTPS NodeJS Web Service with Express](https://adamtheautomator.com/https-nodejs/#Creating_an_SSL_Certificate)):

1. Create a "certs" directory in the project root path and cd into it
2. Generate a key file used for self-signed certificate generation

```bash
# Generates a private key as a file called key.pem
openssl genrsa -out key.pem
```

3. Generate a certificate service request (CSR). The CSR is required to provide all of input necessary to create the actual certificate

```bash
# Passing this command will prompt you to answer some questions
openssl req -new -key key.pem -out csr.pem
```

4. Generate certificate by providing private key (`key.pem`) and CSR (`csr.pem`).

```bash
# Create a certificate called cert.pem with validity of 9999 days
openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem
```

5. At the end of these steps, you should have 3 files in the `certs` directory

- `key.pem` => private key
- `cert.pem` => public key / certificate
- `csr.pem` => self-signed ssl certificate

Summary of Commands to setup the certs

```bash
# Create a new certs directory in the project's root directory
mkdir certs && cd certs

# Generates a private key as a file called key.pem
openssl genrsa -out key.pem

# Passing this command will prompt you to answer some questions
openssl req -new -key key.pem -out csr.pem

# Create a certificate called cert.pem with validity of 9999 days
openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem
```

## Project Structure

### `utils`

The `utils` directory contains utility files.

- `parseEnvVars.ts` -- parses environmental variables

### `index.ts`

This file is the entry point of the whole project.

Since this is an API project, the `index.ts` file is responsible for instantiating a new fastify server instance (via the `buildServer.ts` file) and starting the server listening on the host and port specified by the .env file

### `api/server.ts`

The `server.ts` module contains two exported methods

- `buildServerAsync` -- Instantiates and configures a fastify server instance
- `startServerAsync` -- Takes the instantiated server instance from `buildServerAsync` and starts the server listening for requests

### `api/resources`

The `resources` directory contains a sub-folder for each API resource.

In this example, the main resource is the items directory.

### `api/resources/items`

The `api/resources/items` directory contains all files related to the items resource.

- `items.routes.ts`
  - Sets up which route handlers (controller methods) are used for each HTTP route for the items endpoint
- `items.controller.ts`
  - The controller layer is responsible for handling incoming HTTP requests and returning HTTP responses
  - This particular controller contains all route handlers for the items resource
  - Any business logic is passed to the service layer
  - The controller uses `DTO`s (Data Transfer Objects) to sanitize the data before it is sent to the client. This ensures that only data that the client should receive is sent
- `items.service.ts`
  - The service layer contains all of the business logic and handle all processing for API requests
  - The service interacts with a database (via a Data Access Layer), cache, and other external services if necessary
- `IItemsRepository.ts`
  - In conjunction with `items.repository.inmem.ts`, forms the Data Access Layer for the items resource
  - This is the interface which is used in conjunction with an implementing class to define a Repository
  - The `Repository Design Pattern` creates a class which implements methods which interact directly with a database to perform CRUD operations on a DB
  - `items.repository.inmem.ts` exports the `ItemsRepositoryInMem` class which contains an in-memory array representing a database
  - We can also create additional classes which implement the same `IItemsRepository` interface to interact with different databases
    - ex. `ItemsRepositoryMongo` and `ItemsRepositoryPostgres` both implement from `IItemsRepository`, this means they have to use the same methods defined by the interface.
    - The actual implementation of the methods of the two classes will vary as one class communicates with a MongoDB database while the other communicates with a PostgreSQL database.
    - In `items.routes.ts` where we instantiate the controller / service and repository, we can use `Dependency Injection` to inject any class into the `ItemsService` class which implements the `IItemsRepository` interface.
- `items.repository.inmem.ts`
  - In conjunction with `IItemsRepository.ts`, forms the Data Access Layer for the items resource
  - The Data Access Layer is responsible for interacting with the database and other data resources
  - `ItemsRepositoryInMem` is an in-memory database
  - In the future, can replace `ItemsRepositoryInMem` with a class which also implements `IItemsRepository` but connects to an actual database like MongoDB or PostgreSQL
- `items.types.ts`
  - This module contains the TypeScript types used by the different files in the `items` directory

## SwaggerUI / OpenAPI

When the server is running, you can access SwaggerUI / OpenAPI via the following url:

- `https://<api_host>:<api_port>/documentation`
- This will expose all RESTful API Endpoints

## Postman API Collection

The repository contains a postman collection which can be imported to view all RESTful endpoints

The collection contains two folders:

- http
- https
- Depending on how the Fastify API is configured in `api/buildServer.ts` (whether `https` and `https2`) is setup, you can either make HTTP or HTTPS calls but not both

## Endpoints

All endpoints have a base url of: `https://<api_host>:<api_port>/api/v1`

### Items

`POST /items`

- Add a new Item
- Request body contains a JSON object with the following parameters:
  - `name` -- Updated name
  - `quality` -- `common` || `uncommon` || `rare` || `legendary`
  - `value` -- positive number (>= 0)
- Response contains a JSON object representing the newly created DB items object

Example Request Body

```json
{
  "name": "mithril sword",
  "quality": "rare",
  "value": 100
}
```

Example Response Body (201)

```json
{
  "id": "9ec6944f-fb19-4ad8-8f2c-e7675d82a591",
  "name": "mithril sword",
  "quality": "rare",
  "value": 100
}
```

`GET /items`

- Retrieve a list of all items in the DB
- Response body contains an object with an items property which itself is an array of items objects

Example Response Body (200)

```json
{
  "items": [
    {
      "id": "615a0e18-415c-41ba-9c51-3b403deec651",
      "name": "bronze sword",
      "quality": "common",
      "value": 10
    },
    {
      "id": "bebaf5f9-2cbe-4c84-a472-4bd11dadec79",
      "name": "Poseidon's Trident",
      "quality": "legendary",
      "value": 1000
    },
    {
      "id": "eb425a54-9966-4b70-a64b-8020e3ce5995",
      "name": "greater health potion",
      "quality": "uncommon",
      "value": 100
    },
    {
      "id": "9ec6944f-fb19-4ad8-8f2c-e7675d82a591",
      "name": "mithril sword",
      "quality": "rare",
      "value": 100
    }
  ]
}
```

`GET /items/:id`

- Retrieve an item from the database based on the id
- Pass in an id as a path variable
- Response body contains JSON object representing the found item

Example Response Body (200) for a request with id of `bebaf5f9-2cbe-4c84-a472-4bd11dadec79`

```json
{
  "id": "bebaf5f9-2cbe-4c84-a472-4bd11dadec79",
  "name": "Poseidon's Trident",
  "quality": "legendary",
  "value": 1000
}
```

`PUT /items/:id`

- Update an item based on request id and body parameters
- Pass in an id as a path variable
- Pass in a JSON object into the body containing one or more of the following properties
  - `name` -- Updated name
  - `quality` -- `common` || `uncommon` || `rare` || `legendary`
  - `value` -- positive number (>= 0)
  - These properties will be used to update the item with specified id
- Response body contains JSON object representing the updated item

Example Request Body (for item id of `bebaf5f9-2cbe-4c84-a472-4bd11dadec79`)

```json
{
  "name": "Poseidon's Fork",
  "quality": "common",
  "value": 0
}
```

Example Response Body (200)

```json
{
  "id": "bebaf5f9-2cbe-4c84-a472-4bd11dadec79",
  "name": "Poseidon's Fork",
  "quality": "common",
  "value": 0
}
```

`DELETE /items/:id`

- Delete item in DB with specified id
- Request contains id passed into as a path variable
- Response body contains JSON object representing deleted item of specified id

Example Response Body for id of `bebaf5f9-2cbe-4c84-a472-4bd11dadec79`

```json
{
  "id": "bebaf5f9-2cbe-4c84-a472-4bd11dadec79",
  "name": "Poseidon's Fork",
  "quality": "common",
  "value": 0
}
```

## Scripts:

Use the following command to run the scripts:
`pnpm <script-name>`

- `clean`: Deletes the `dist` directory and all of its contents
- `build`: `Rebuilds` the `build` directory and its contents
- `build-prod`: Same as `build` but output code is minified and bundled, also build d.ts type files
- `start`: Builds the project and runs transpiled code from the `dist` directory
- `watch`: Transpiles code and executes it in watch mode. Any changes to code will cause code to re-transpile and re-run.
- `test`: Runs all `...spec.ts` and `...test.ts` files using `Vitest`
- `test-related`: Pass in space-separated file paths to files in the `src` directory you wish to run tests for
- `test-watch`: Runs `Vitest` in "watch" mode (changes to test files cause `Vitest` to rerun them)
- `check-format`: Check for format errors in TS files in `src` directory
- `check-lint`: Check for linting errors in TS files in `src` directory
- `check-types`: Check for type errors in TS files in `src` directory
- `check-all`: Check all TS files in `src` directory for errors (formatting, linting, or type errors)
- `fix-format`: Fix all formatting errors in TS files in `src` directory
- `fix-lint`: Fix all linting errors in TS files in `src` director
- `fix-all`: Fix all formatting and linting errors & rebuild the project
- `scratch`: Runs the transpiles and `scratch.ts` file located in the `src/_scratch` directory

## References:

- [TomDoesTech - Build a RESTful API with Fastify, Prisma & TypeScript](https://www.youtube.com/watch?v=LMoMHP44-xM)
- [TomDoesTech - Just Enough Fastify to be Productive](https://www.youtube.com/watch?v=ZHLB4StAqPM)
- [TomDoesTech - Realistic Simulation - Build, Test & Deploy and Application](https://www.youtube.com/watch?v=8u3zQkLz9gQ)
- [Traversey Media - Fastify Crash Course | Node.js Framework](https://www.youtube.com/watch?v=Lk-uVEVGxOA)
- [Node / TypeScript Template](https://github.com/pszponder/template_node-ts)
- [Understanding JSON Schema](https://json-schema.org/understanding-json-schema/index.html)
- [ByteByteGo - HTTP/1 to HTTP/2 to HTTP/3](https://www.youtube.com/watch?v=a-sBfyiXysI)
