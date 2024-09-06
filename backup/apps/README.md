# Foosball Development Setup

## Applications Overview

| App name | Stack setup                 | Status         | Description            |
| -------- | --------------------------- | -------------- | ---------------------- |
| api      | NestJS                      | In Development | Foosball API (backend) |
| slackbot | NestJS                      | In Development | Foosball Slackbot      |

## Development setup

If you wish to develop or contribute to this repo, we suggest the following:

- Clone this repository

```
git clone https://github.com/dutchhackers/foosball
cd foosball
```

- Install this project's dependencies on your computer

```
npm install
```

Advised to use Node version 16 (or higher).

Tip: if you have nvm installed, you can run `nvm use` to auto-detect the preferred Node version

- Create .env file

Copy `sample.env` (in the API app root) to `.env` and fill in the environment variables

```
NODE_ENV=development
PORT=5001

GOOGLE_APPLICATION_CREDENTIALS=/path/to/your/serviceaccount.json
```

### Run Foosball API locally

- Run Foosball API

```
nx serve foosball-api
```

Go to http://localhost:5001/docs to open the Swagger API docs

### General commands

- build application

```
nx build foosball-api
```

- test application

```
nx test foosball-api
```

- lint application

```
nx lint foosball-api
```
