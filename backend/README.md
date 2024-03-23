# E-commerce REST API

## Initialize project

### Create `package.json`

```
npm init -y
```

### Install core dependencies

#### Dev dependencies

- `typescript` &rarr; TypeScript compiler
- `@types/node` &rarr; Types for Node.js
- `ts-node` &rarr; TypeScript execution engine for Node.js
- `nodemon` &rarr; Monitor for automatic Node.js app restart
- `jest` &rarr; Testing framework
- `ts-jest` &rarr; TypeScript configuration for Jest
- `supertest` &rarr; Request library for testing
- `@types/cors` &rarr; Types for `cors`
- `@types/express` &rarr; Types for `express`
- `@types/morgan` &rarr; 'Types for `morgan`
- `@types/cookie-parser` &rarr; 'Types for `cookie-parser`
- `typeorm` ORM with out-of-the-box TypeScript support

#### App dependencies

- `express` &rarr; Web application framework
- `cors` &rarr; Cross-origin requests support
- `morgan` &rarr; Logger
- `cookie-parser` &rarr; Parser for request cookies
- `helmet` &rarr; Security layer for Express
- `dotenv` &rarr; `.env` file parser

### All commands

```
pnpm i -D typescript @types/node ts-node nodemon jest ts-jest supertest @types/cors @types/express @types/morgan @types/cookie-parser
npx tsc --init
npm @eslint/config
npx ts-jest config:init
```
