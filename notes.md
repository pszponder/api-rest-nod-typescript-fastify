# API Notes (via ChatGPT)

The notes below are all generated responses from asking ChatGPT about various RESTful API topics in the context of Fastify JavaScript API Framework

## Designing a scalable architecture for a REST API

Key factors:

1. **Separation of Concerns:** It is important to keep your code modular and separated by their concerns. This will help you to maintain your codebase easily.
2. **Layered Architecture:** Using a layered architecture will enable you to have a clear separation between your business logic and infrastructure code.
3. **Use of Dependency Injection:** By using dependency injection, you can create more testable and scalable code, as well as make it easier to switch between implementations.
4. **Use of Caching:** By caching frequently accessed data, you can reduce the load on your database and speed up your API's response times.
5. **Use of Load Balancing:** Using load balancing will help distribute incoming requests to multiple servers, which can increase your API's availability and scalability.
6. **API Documentation:** Good documentation of your API is essential to make it easy for other developers to use it.

## Different Layers / Parts of an API

1. **Controllers:** This layer will be responsible for handling incoming HTTP requests and returning HTTP responses. You can create a separate controller for each endpoint in your API.
2. **Services:** This layer will contain your business logic and handle all the processing for the API requests. It will interact with the database, cache, and other external services if necessary.
3. **Data Access Layer:** This layer will be responsible for interacting with the database and other data sources.
4. **Utils:** This layer will contain reusable utility functions and helper classes.
5. **Middlewares:** This layer will contain your application's middleware functions, such as authentication, request validation, and logging.
6. **API Documentation:** It is important to create clear and comprehensive documentation for your API. You can use tools such as Swagger or OpenAPI to generate API documentation.
7. **Load Balancer:** You can use a load balancer such as NGINX to distribute incoming requests to multiple servers.

### Controller Layer

In a REST API, the controller is responsible for handling incoming HTTP requests and returning the appropriate HTTP responses.

`Controllers` act as the middleman between the client and the application's business logic. They receive requests, extract any necessary data, call the appropriate services or data access layer methods to process the request, and return the response to the client.

Here are some common responsibilities of a controller in a REST API:

1. **Handling incoming requests:** The controller is responsible for listening to incoming requests from clients and mapping them to the appropriate service or data access layer methods.
2. **Extracting request data:** The controller extracts data from the request payload, query parameters, and URL parameters to provide the necessary data to the service or data access layer methods.
3. **Validating input:** The controller ensures that the input received from the client is valid and meets the application's business rules. It may perform input validation and sanitization to prevent security vulnerabilities and ensure the integrity of the data.
4. **Invoking services and data access layer methods:** The controller calls the appropriate service or data access layer methods to process the request and perform any required business logic or data operations.
5. **Returning responses:** The controller is responsible for returning the appropriate HTTP response to the client. This includes setting the response status code, headers, and body.

In summary, the controller is responsible for handling incoming HTTP requests, extracting necessary data, invoking the appropriate services or data access layer methods, validating input, and returning the appropriate HTTP response to the client.

### Service Layer

The `service layer` in API design serves as an abstraction layer that separates the business logic of an application from the communication layer (e.g., HTTP layer). It provides a layer of indirection between the client and the database, and encapsulates the underlying data access layer (e.g., database access code) and any other business logic.

The main purpose of the service layer is to provide a clear separation of concerns, making it easier to maintain and test the application. It allows you to change the underlying data access layer or business logic without affecting the communication layer.

By separating the concerns of the application, you can ensure that the API is modular and loosely coupled, which leads to better maintainability, scalability, and flexibility. Additionally, it allows you to reuse business logic across multiple endpoints or modules, reducing duplication of code.

Overall, the service layer in API design is an important part of building a well-designed, maintainable, and scalable API.

### Data Access Layer

The purpose of the `data access layer` is to provide a way for an application to interact with its underlying data store, such as a relational database, NoSQL database, or even a file system. It is responsible for handling all database operations, including creating, reading, updating, and deleting records (CRUD operations).

The data access layer acts as an intermediary between the database and the rest of the application, allowing for separation of concerns and reducing coupling between the database and the application's business logic. By encapsulating database operations in a separate layer, the application code becomes cleaner and more maintainable.

In addition to handling CRUD operations, the data access layer is also responsible for ensuring that data is properly validated and sanitized before being stored in the database. This helps to prevent common security vulnerabilities, such as SQL injection attacks.

Overall, the data access layer plays a crucial role in the development of robust, scalable, and maintainable applications.

### DTO (Data Transfer Objects)

DTOs (Data Transfer Objects) are a design pattern commonly used in API architecture and design.

A DTO is an object that is used to transfer data between layers of an application. In the context of an API, DTOs are used to represent the data that is sent over the wire between the client and the server. They typically contain only the data that is needed for the client to perform its tasks, and are often different from the domain objects used internally by the server.

The purpose of using DTOs is to decouple the representation of the data from the underlying implementation. This makes it easier to change the internal implementation of the API without affecting the external clients, since the external representation of the data remains the same.

In a typical REST API architecture, DTOs are often used in combination with controllers and services. The controller receives a request from the client and maps it to a DTO object. The service layer then uses the DTO to perform the necessary business logic and return a response DTO. Finally, the controller maps the response DTO back to the appropriate HTTP response format and sends it back to the client.

Here's an example of a DTO for a user object in a REST API:

```ts
// user.dto.ts
export class UserDto {
  readonly id: number;
  readonly name: string;
  readonly email: string;

  constructor(id: number, name: string, email: string) {
    this.id = id;
    this.name = name;
    this.email = email;
  }
}
```

In this example, the UserDto class represents the data that will be sent to the client when a user is requested. It contains only the relevant properties of the user object, and is used to decouple the external representation of the user from the internal representation used by the server.

Suppose we have a `User` class that represents a user in our application:

```ts
// user.model.ts
export class User {
  constructor(public id: number, public name: string, public email: string) {}
}
```

We want to create a REST API endpoint to retrieve a single user by ID. Here's how we might implement the endpoint using a DTO:

```ts
// user.controller.ts
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { User } from "./user.model";
import { UserService } from "./user.service";
import { UserDto } from "./user.dto";

export class UserController {
  constructor(private userService: UserService) {}

  getUser = async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = parseInt(request.params.id);
    const user = await this.userService.getUserById(userId);
    if (user) {
      // Expose only client-relevant data to the user DTO and return to the client
      const userDto = new UserDto(user.id, user.name, user.email);
      reply.send(userDto);
    } else {
      reply.status(404).send();
    }
  };
}

export const userController = (
  fastify: FastifyInstance,
  userService: UserService,
) => {
  const controller = new UserController(userService);
  fastify.get("/users/:id", controller.getUser);
};
```

In this example, we define a UserDto class that represents the data that will be sent to the client when a user is requested. The UserController has a method getUser that retrieves the requested user from the UserService, converts it to a UserDto object, and sends it back to the client.

By using a DTO, we are able to expose only the relevant properties of the User class to the client, and we can change the internal representation of the User class without affecting the API's clients.

Think of the DTO as being used to wrap and expose only client relevant data:

DTOs are typically used to encapsulate and expose a subset of an object's data to clients of an API.

By doing so, we can control what data is exposed to clients, and we can change the internal representation of the object without affecting the API's clients. Additionally, DTOs can be used to enforce validation rules on the data being sent to the API, which can help prevent errors and improve the robustness of the API.

## Example of using an API Controller, Service and Data Access Layer

Let's say we have an application that manages users, and we want to create a new user. We'll start by creating a `UserController` module that handles incoming requests related to users:

> [! NOTE] Dependency Injection:
>
> In the example of the `UserController` module below, the constructor takes a single argument `userService` of type `UserService`.
>
> The private keyword before `userService` is a shorthand way of defining a class property and initializing it with the `userService` argument passed to the constructor.
>
> This pattern is called `Dependency Injection`, and it allows the `UserController` to be decoupled from the `UserService`. Instead of creating a new instance of the `UserService` within the `UserController`, the `UserService` is passed in as a dependency.
>
> By passing the `UserService` in as a dependency, it becomes easier to test the UserController in isolation. In a testing environment, a mock implementation of the `UserService` can be provided to the `UserController` constructor, allowing for more fine-grained control over testing.
>
> Overall, the `private userService: UserService` line in the constructor of the `UserController` module sets up the `UserService` as a dependency of the `UserController` and initializes it with the `userService` argument passed to the constructor.

```ts
// UserController.ts
import { FastifyRequest, FastifyReply } from "fastify";
import { UserService } from "./userService";

// Create a Controller Class to manage HTTP Request and Responses (communication layer) for the User Resource
export class UserController {
  // Constructor accepts an instance of the UserService class (Dependency Injection)
  constructor(private userService: UserService) {}

  /**
   * @desc   Adds a new user
   * @route  POST /api/v1/users
   * @access Public
   */
  async createUser(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { name, email, password } = req.body;
      const newUser = await this.userService.createUser(name, email, password);
      reply.send(newUser);
    } catch (err) {
      reply.status(500).send({ error: "Internal Server Error" });
    }
  }
}
```

In the example of the `UserController` module above, `UserController` takes a `UserService` instance in its constructor. The `createUser` method in the `UserController` is responsible for handling incoming requests related to creating a new user. It extracts the necessary data from the request body and passes it to the `createUser` method in the `UserService` instance.

```ts
// UserService.ts
import { User } from "./user";
import { UserRepository } from "./userRepository";

// Declare a service class for the Users resource
// This class is responsible for the business logic for the Users resource
export class UserService {
  // Use Dependency Injection to accept an instance of the UserRepository (Data Access Layer)
  constructor(private userRepository: UserRepository) {}

  // Use the UserRepository (Data Access Layer) to create a new user
  async createUser(
    name: string,
    email: string,
    password: string,
  ): Promise<User> {
    const newUser = new User(name, email, password);
    return this.userRepository.save(newUser);
  }
}
```

The `UserService` takes a `UserRepository` instance in its constructor. The `createUser` method in the `UserService` is responsible for creating a new user. It creates a new User instance with the provided data and passes it to the save method of the `UserRepository` instance.

```ts
// UserRepository.ts
import { User } from "./user";

// The UserRepository represents the class which directly interfaces with the Database and performs CRUD operations on it
export class UserRepository {
  async save(user: User): Promise<User> {
    // TODO: Save user to database
    return user;
  }
}
```

The `UserRepository` module is responsible for data access and interacts directly with the database. In this example, the save method takes a User instance and saves it to the database.

In summary:

- The `UserController` module handles incoming requests related to users and passes the necessary data to the `UserService` module.
- The `UserService` module creates a new User instance and passes it to the `UserRepository` module (Data Access Layer) to be saved to the database.
- This separation of concerns between the controller, service, and data access layer can make the code more modular, maintainable, and scalable.

### Example of a UserController and a corresponding router in Fastify

NOTE: This assumes that you already have a UserService and a User model.

This `UserController` class provides methods for creating, reading, updating, and deleting user resources. The methods use the `UserService` to interact with the data access layer and perform the necessary database operations.

```ts
// UserController.ts
import { FastifyRequest, FastifyReply } from "fastify";
import { UserService } from "../services/user.service";
import { User } from "../models/user.model";

export class UserController {
  constructor(private readonly userService: UserService) {}

  async createUser(req: FastifyRequest, reply: FastifyReply) {
    const { name, email, password } = req.body as User;
    const user = await this.userService.createUser({ name, email, password });
    reply.send(user);
  }

  async getUsers(req: FastifyRequest, reply: FastifyReply) {
    const users = await this.userService.getUsers();
    reply.send(users);
  }

  async getUserById(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params;
    const user = await this.userService.getUserById(Number(id));
    if (!user) {
      reply.status(404).send();
      return;
    }
    reply.send(user);
  }

  async updateUser(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params;
    const { name, email, password } = req.body as User;
    const updatedUser = await this.userService.updateUser(Number(id), {
      name,
      email,
      password,
    });
    if (!updatedUser) {
      reply.status(404).send();
      return;
    }
    reply.send(updatedUser);
  }

  async deleteUser(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params;
    const deletedUser = await this.userService.deleteUser(Number(id));
    if (!deletedUser) {
      reply.status(404).send();
      return;
    }
    reply.send(deletedUser);
  }
}
```

```ts
// user.routes.ts
import fastify from "fastify";
import { UserController } from "../controllers/user.controller";
import { UserService } from "../services/user.service";

// Instantiate the user controller
const userController = new UserController(new UserService());

// Instantiate a fastify router instance
const router = fastify();

router.get("/users", userController.getUsers);
router.get("/users/:id", userController.getUserById);
router.post("/users", userController.createUser);
router.put("/users/:id", userController.updateUser);
router.delete("/users/:id", userController.deleteUser);

export default router;
```

Here is how you would create an app to setup a Fastify application with the user router

```ts
import { userRouter } from "./routes/user.router";

// Instantiate a fastify instance
const fastify = require("fastify")({ logger: true });

// Register the userRouter and specify the prefix to be "/api/v1"
// Once the router is registered, Fastify will automatically handle incoming requests and route them to the appropriate controller method based on the HTTP method and path specified in the request.
fastify.register(userRouter, { prefix: "/api/v1" });

// Create a function to start fastify listening on the specified port
const start = async () => {
  try {
    await fastify.listen(3000);
    fastify.log.info(`Server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

await start();
```

## Feature / Module-Based vs MVC Architecture in REST API Design

`MVC` and `feature-based` REST API architectures are two different design approaches for developing REST APIs

### MVC (Model - View - Controller) Architecture

`MVC` (Model-View-Controller) is a pattern that separates an application's data, user interface, and control logic into three distinct components.

- `Model`: Represents the data and business logic
- `View`: Represents the user interface / presentation layer
- `Controller`: Handles user input and updates the model and view (acts as middle-man between `Model` and `View`)

In an `MVC` architecture, the code is typically organized based on the role that each module plays in the MVC pattern.

For example, you may have a "models" folder containing data-related modules, a "views" folder containing presentation-related modules, and a "controllers" folder containing modules that handle user input and update the model and view.

### Feature-based Architecture

`feature-based` REST API architecture organizes the code around specific features or functionalities of the application. An alternative way to think about this is to think of each feature as a `resource` (ex. users, items, etc.) which is exposed by the API.

Instead of grouping modules based on their role in an MVC pattern, modules are grouped based on the feature / resource they implement.

Grouping modules based on related resources makes the code easier to understand, maintain, and scale. It helps to avoid a situation where code related to a particular feature is scattered across different files or folders, which can make it difficult to understand the overall functionality of the application.

For example, if the application has a user management feature, all the modules related to user management, such as user service, user controller, user middleware, and user model, are grouped together into a single feature-based module or folder. This makes it a lot easier to search for files related to the users management resource.

In a feature-based architecture, the focus is on creating small, independent modules that can be easily reused across different features or functionalities of the application. This approach can make the code more modular, maintainable, and scalable, as changes to a specific feature can be made without affecting other parts of the application.

The `feature-based` approach also makes it easier to reuse code across different parts of an application or different applications altogether.

### MVC vs Feature-based Architecture

While MVC and feature-based REST API architecture are both valid approaches to organizing the code and functionality of an application, they differ in their focus and organization.

- `MVC` is focused on separating data, presentation, and control logic
- `Feature-based` architecture is focused on grouping modules based on specific features or functionalities of the application

If there are many interdependencies between different parts of the applications, it may make more sense to use a `Feature-based` architecture over `MVC`

## Using Fastify and Zod to define Schemas

Zod is a popular schema validation library that can be used with Fastify to validate incoming requests and outgoing responses. Here's an example of how to use Zod with Fastify to create a Fastify schema:

```ts
import { FastifySchema } from "fastify";
import * as z from "zod";

// Define a schema using Zod
const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
  }),
});

// Create a Fastify schema from the Zod schema
const createUserFastifySchema: FastifySchema = {
  body: createUserSchema.shape.body,
};
```

In this example, we define a schema using Zod that expects a name, email, and password field in the request body. We also define validation rules for each field using Zod's fluent API.

We then create a Fastify schema by extracting the body field from the Zod schema. This Fastify schema can be used to validate incoming requests using Fastify's built-in validation middleware:

```ts
import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { createUserFastifySchema } from "./user.schema";
import { UserService } from "./user.service";

export class UserController {
  constructor(private userService: UserService) {}

  createUser = async (request: FastifyRequest, reply: FastifyReply) => {
    const user = await this.userService.createUser(request.body);
    reply.send(user);
  };
}

export const userController = (
  fastify: FastifyInstance,
  userService: UserService,
) => {
  const controller = new UserController(userService);

  fastify.post("/users", {
    schema: createUserFastifySchema,
    handler: controller.createUser,
  });
};
```

In this example, we use the createUserFastifySchema we created earlier to validate incoming requests to the /users endpoint. If the request does not conform to the schema, Fastify will automatically reject the request with an appropriate error.

By using Zod with Fastify, we can define complex validation rules for our API's incoming and outgoing data with ease.

### Using Zod, Fastify and OpenAPI

You can use Zod schemas with Fastify to generate OpenAPI / Swagger documentation for your API. Fastify has a built-in `fastify-swagger` plugin that can generate Swagger documentation for your API based on your route schemas.

To use `fastify-swagger` with Zod schemas, you need to use the z.schema method provided by the `fastify-swagger` plugin to convert your Zod schema to a JSON schema format that can be understood by Swagger. Here's an example:

```ts
import { FastifyInstance } from "fastify";
import { z } from "zod";
import { userController } from "./user.controller";

const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
  }),
});

export const userRoutes = async (fastify: FastifyInstance, options: any) => {
  fastify.register(userController, { prefix: "/users" });

  // Define the route schema using Zod schema and fastify-swagger JSON schema
  const createUserRouteSchema = {
    schema: {
      body: createUserSchema
        .pick({ body: true })
        .transform(schema => z.schema(schema)),
      response: {
        201: z.object({
          id: z.number(),
          name: z.string(),
          email: z.string(),
        }),
      },
    },
  };

  fastify.route({
    method: "POST",
    url: "/users",
    handler: userController.createUser,
    ...createUserRouteSchema,
  });

  // Generate Swagger documentation for the API
  fastify.register(require("fastify-swagger"), {
    exposeRoute: true,
    routePrefix: "/documentation",
    swagger: {
      info: {
        title: "My API",
        description: "My API description",
        version: "1.0.0",
      },
    },
  });
};
```

In this example, we use z.schema to convert our Zod schema to a JSON schema format that can be understood by Swagger. We then use the resulting schema to define our route schema using the schema option. We also define a response schema using Zod.

Finally, we register the fastify-swagger plugin to generate Swagger documentation for our API. The plugin will automatically generate Swagger documentation based on the route schemas we've defined.

## References

Most of the answers above were derived by asking questions to ChatGPT
