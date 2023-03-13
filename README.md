# TS-JEST-PNP
How to create a [TypeScript](https://www.typescriptlang.org/) project that uses [ESLint](https://eslint.org/), [Jest](https://jestjs.io/), and [Yarn v2 Plug'n'Play](https://yarnpkg.com/features/pnp) while playing nicely with [VSCode](https://code.visualstudio.com/).

## Install Yarn v2
First install the latest stable version of [Node](https://nodejs.org/en/) from their [hompage](https://nodejs.org/en/).  Currently, this is `v18.15.0`.
```bat
node -v
v18.15.0
```

Then use [npm](https://www.npmjs.com/) to install the latest version of `yarn` (currently `v3.4.1`):
```cmd
npm install --global yarn
yarn -v
3.4.1
```

## Create Project
```cmd
md ts-jest-pnp
cd ts-jest-pnp
code . -r

md src
md tests\output\coverage
md tests\output\logs
```

## Create `package.json`
```json
// package.json
// ---
{
  "name": "ts-jest-pnp",
  "version": "1.0.0",
  "description": "A TypeScript, ESLint, and Jest project with Yarn Plug'n'Play",
  "author": "Sam Freeman <sam.freeman.55@gmail.com>",
  "keywords": [
	  "typescript",
	  "eslint",
	  "jest",
	  "yarn",
	  "plug'n'play",
	  "pnp"
  ],
  "license": "MIT",
  "private": false,
  "scripts": {
	  "test": "jest --no-color 2>tests/output/logs/tests.log",
	  "coverage": "\"tests/output/coverage/lcov-report/index.html\"",
	  "clean": "rimraf build && rimraf tsconfig.tsbuildinfo",
	  "build": "tsc --build --verbose",
	  "re-build": "yarn clean && yarn build"
  }
}
```
> If you don't have `rimraf`, install it globally with `npm install rimraf --global`.

> The script `re-build` can't be called `rebuild` because Yarn already has a command called rebuild.

## Install Dependencies
```cmd
yarn add -D typescript ts-node @types/node
yarn add -D eslint @typescript-eslint/eslint-plugin@latest @typescript-eslint/parser@latest
yarn add -D jest ts-jest @types/jest
```
> You should now have no `node_modules` folder and should have a `.yarn` folder in your project.  You should also see two pnp files - `.pnp.cjs` and `.pnp.loader.mjs`.

## Initialize Git
```cmd
git init
```

## Create `.gitignore`
```cmd
echo .yarn/cache> .gitignore
echo .yarn/sdks>> .gitignore
echo .yarn/unplugged>> .gitignore
echo .yarn/build-state.yml>> .gitignore
echo .yarn/install-state.gz>> .gitignore
echo .pnp.*>> .gitignore
echo *.tsbuildinfo
echo build>> .gitignore
echo tests/output>> .gitignore
```

## Create `tsconfig.json`
```json
// tsconfig.json
// ---
{
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "build",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "composite": true,
    "target": "es2020",
    "module": "commonjs",
    "noEmitOnError": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true
  },
  "include": [
    "src/**/*.ts"
  ]
}
```

## Create `.eslintrc.json`
```json
// .eslintrc.json
// ---
{
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "overrides": [
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": [
    "@typescript-eslint"
  ],
  "rules": {
    "indent": [
      "error",
      "tab"
    ],
    "linebreak-style": [
      "error",
      "windows"
    ],
    "quotes": [
      "error",
      "single"
    ],
    "semi": [
      "error",
      "never"
    ],
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/consistent-type-definitions": [
      "error",
      "interface"
    ]
  }
}
```

## Create `.eslintignore`
```cmd
echo .yarn> .eslintignore
echo .pnp.*>> .eslintignore
echo *.tsbuildinfo>> .eslintignore
echo build>> .eslintignore
echo tests>> .eslintignore
```

## Create `jest.config.ts`
```ts
export default {
    clearMocks: true,
    collectCoverage: true,
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/**/index.ts',
    ],
    coverageDirectory: 'tests/output/coverage',
    coverageProvider: 'v8',
    preset: 'ts-jest',
    roots: ['src', 'tests'],
    testEnvironment: 'jest-environment-node',
    testMatch: ['**/tests/**/*.test.ts'],
    verbose: true,
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest', { tsconfig: 'tsconfig.tests.json' }
        ]
    }
}
```

## Create `tsconfig.tests.json`
```json
// tsconfig.test.json
// ---
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "rootDir": "."
  },
  "include": [
    "src/**/*.ts",
    "tests/**/*.test.ts"
  ]
}
```

## Create a Source File
```ts
// src/JsonObject.ts
// ---
export type JsonValue = string | number | boolean | null
export type JsonObject = { [key: string]: JsonValue | JsonValue[] | JsonObject | JsonObject[] }

export const isJsonObject = (value: unknown): value is JsonObject =>
    !!value && typeof value == 'object' && !Array.isArray(value)
```

## Create a Test File
```ts
// tests/JsonObject.test.ts
// ---
import { isJsonObject } from '../src/JsonObject'

describe('ts-jest-pnp', () => {
    test('isJsonObject', () => {
        expect(isJsonObject({})).toBe(true)
        expect(isJsonObject([])).toBe(false)
        expect(isJsonObject(null)).toBe(false)
        expect(isJsonObject(undefined)).toBe(false)
        expect(isJsonObject(0)).toBe(false)
        expect(isJsonObject('')).toBe(false)
        expect(isJsonObject(true)).toBe(false)
    })
})
```

## Fix VS Code's Understanding of Jest Functions
Because we are using Yarn Plug'n'Play, VSCode doesn't know where Jest's functions live.  Normally, VS Code would look for type definitions in the `node_modules` folder.  But, because we're using Plug'n'Play, there is no node_modules folder.  In order for VSCode to find modules under the `.yarn` folder, we need to run yarn's [Editor SDK for VSCode](https://yarnpkg.com/getting-started/editor-sdks#vscode):
```cmd
yarn dlx @yarnpkg/sdks vscode
```

After running this, VSCode may have a popup that starts with `This workspace contains a TypeScript version`.  If you see this popup, click the `Allow` button.  If you miss the popup or need to do this manually:
1. Open a `.ts` file (e.g.: `src/JsonObject.ts`)
2. Press `ctrl+shift+p`
3. Choose `Select TypeScript Version`
4. Pick `Use Workspace Version`

You can learn more about this at Yarn's [Editor SDKs](https://yarnpkg.com/getting-started/editor-sdks) page.

Once this is done, you should see that VSCode is happy with Jest's `describe`, `test`, and `expect` functions used in `tests/JsonObject.tests.ts`.

> Note, if you've done this step before in VSCode, you may not have to do it again - VSCode might remember.

## Take a Test Drive
```cmd
yarn test
yarn coverage
yarn build

rem Second build shouldn't rebuild
yarn build

yarn clean

yarn re-build

rem Second re-build should rebuild
yarn re-build
```

## Summary of Project
### Directory Listing
- [.vscode]
  - extensions.json
  - settings.json
- [.yarn]
  - [cache]
  - [sdks]
  - [unplugged]
  - install-state.gz
- [src]
  - JsonObject.ts
- [tests]
  - [output]
    - [coverage]
    - [logs]
      - tests.log
    - JsonObject.test.ts
- .eslintignore
- .eslintrc.json
- .gitignore
- .pnp.cjs
- .pnp.loader.mjs
- jest.config.ts
- package.json
- README.md
- tsconfig.json
- tsconfig.tests.json
- yarn.lock

### Final `package.json`
```json
// package.json
// ---
{
  "name": "pnp-test",
  "version": "1.0.0",
  "description": "A Typescript, ESLint, and Jest project with Yarn Plug'n'Play",
  "author": "Sam Freeman <sam.freeman.55@gmail.com>",
  "keywords": [
    "typescript",
    "eslint",
    "jest",
    "yarn",
    "plug'n'play",
    "plug-n-play",
    "pnp"
  ],
  "license": "MIT",
  "scripts": {
    "test": "jest --no-color 2>tests/output/logs/tests.log",
    "coverage-report": "\"tests/output/coverage/lcov-report/index.html\"",
    "clean": "rimraf build && rimraf tsconfig.tsbuildinfo",
    "build": "tsc --build --verbose",
    "re-build": "yarn clean && yarn build"
  },
  "devDependencies": {
    "@types/jest": "^29.4.0",
    "@types/node": "^18.15.0",
    "@typescript-eslint/eslint-plugin": "latest",
    "@typescript-eslint/parser": "latest",
    "eslint": "^8.36.0",
    "jest": "^29.5.0",
    "ts-jest": "^29.0.5",
    "ts-node": "^10.9.1",
    "typescript": "^4.9.5"
  }
}
```
