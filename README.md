
## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## swagger documentation

http://localhost:3000/documentation/

## docker 

docker-compose up




## Test

```bash
# unit tests
$ npm run test
```

## Structure

src
  - casl For role based authentication
  - common for storing dto's
  - configration for accessing environment variables
  - decorators  cusrom decorators
  - exceptions custom exception
  - guards for user authentication
  - interceptors  for intercepting requests
  - logger  custom logging
  - modules for all modules
    - user
    - auth
    - product
  - providers for global services



How to test
  First Register yourself then login to get token and then this token will be sent in next request.
  Rest of all api's are in swagger documentation

