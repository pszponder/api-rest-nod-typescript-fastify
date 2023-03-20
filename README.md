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

## Project Structure & Overview

### `utils`

The `utils` directory contains utility files.

- `parseEnvVars.ts` -- parses environmental variables

### `index.ts`

This file is the entry point of the whole project.

Since this is an API project, the `index.ts` file is responsible for instantiating a new fastify server instance (via the `buildServer.ts` file) and starting the server listening on the host and port specified by the .env file

### `api/buildServer.ts`

The `buildServer.ts` module exports a method which instantiates and configures a Fastify Server

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
- `items.service.ts`
  - The service layer contains all of the business logic and handle all processing for API requests
  - The service interacts with a database (via a Data Access Layer), cache, and other external services if necessary
- `items.data.ts`
  - This module serves as the Data Access Layer for the items resource
  - The Data Access Layer is responsible for interacting with the database and other data resources
  - Currently, `items.data.ts` contains an in-memory database
  - In the future, `items.data.ts` will connect to a database and send CRUD operations to the database
- `items.types.ts`
  - This module contains the TypeScript types used by the different files in the `items` directory

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
