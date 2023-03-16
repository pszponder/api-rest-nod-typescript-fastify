# Fastify API Example
This is an example RESTful API using Fastify JS and TypeScript.

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
