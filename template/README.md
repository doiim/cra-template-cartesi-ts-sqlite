# Cartesi Typescript React SQLite

The project is a React application built with Create React App and utilizes TypeScript for type safety. It is managed using npm as the package manager. The goal of the project is to create a template that streamlines the process of kickstarting new projects. The template incorporates the latest version of React and integrates with Ethers, allowing for seamless interaction with the underlying blockchain. For testing purposes, a pre-deployed demo on the Sepolia Network is available for users to explore before starting their own development.

<!-- [https://blabla](Live Demo) -->

## Installation

In case you do not reach here via create-react-app, you will be required to install the dependencies and make a copy of the example environment variables.

```sh
npm install
cp .env.example .env.development.local
```

Before run this app it would be required to run the backend service for it. To run a local backend service for this app it is required [Sunodo](https://docs.sunodo.io/guide/introduction/what-is-sunodo).

1. [Install Sunodo](https://docs.sunodo.io/guide/introduction/installing)
2. Clone the backend repo and install it

```sh
git clone https://github.com/path-to-repo.git
cd path
sunodo build
```

## Running Locally

To run a local back end service, in a separate terminal window, just access the backend folder and run:

```sh
sunodo run
```

Runs the front end app in the development mode.

```sh
npm start
```

## How this project is structure

![Cartesi project structure](https://github.com/doiim/cartesi-react-bootstrap/assets/13040410/2ab19829-997b-4964-82ca-b038f3fe2dd2)

### Front End [(github)](https://github.com/doiim/cartesi-ts-react-sqlite)

A `Create React App` template that runs a `Typescript` supported app with `CSS Modules`. This app uses `Apollo Client` to update `Notices` from backend services and normal requests to call `Inspect` endpoint for fetch current state of the database. To call `Advance` inputs, the app uses `Ethers V5` to communicate with Backend EVM.

#### How does CreateProducForm works

![Cartesi Create Product Sequence](https://github.com/doiim/cartesi-react-sqlite-boilerplate/assets/13040410/c47fe872-d2ea-417f-8cf9-1ab82ee12ee3)

1. **User** send a Input(Advance) transaction to add a new product to the database.
2. Once transaction is confirmed by the **EVM**, user receive back the confirmation.
3. The **Cartesi Machine** than grab the Input from the **EVM** and send to the **Validator** backend service.
4. **Validator** process the Input(Advance) adding the data to the database.
5. **Validator** then sends a Notice to the **Cartesi Machine** with the confirming the Payload.
6. That Notice is then Cached on the **GraphQL** service that runs on **Validator** machine.

#### How does ListNotices works

![Cartesi List Notices Sequence](https://github.com/doiim/cartesi-react-sqlite-boilerplate/assets/13040410/6a134172-ab9c-4c04-9cc1-8f3f352d96ad)

1. Once **Frontend** is started it creates a Apollo Client service to listen for the **GraphQL service** running on the **Validator** machine.
2. Every time that a new Notice appears on **GraphQL service** it is added to the list on front-end and reported back to the **User**.

#### How does ListProducts works

![Cartesi List Products Sequence](https://github.com/doiim/cartesi-react-sqlite-boilerplate/assets/13040410/89d7c1a1-a90c-410d-a561-302da05f5e67)

1. Once **Frontend** is started it creates a Apollo Client service to listen for the **GraphQL service** running on the **Validator** machine.
2. Every time that a new Notice appears on **GraphQL service** it is added to the list.
3. Then **Frontend** then make a Inspect call to grab the current status of database from **Validator** service.
4. Once data is returned, it automatically updated the Products table.

### Back End [(github)](https://github.com/doiim/cartesi-ts-sqlite)

A `Sunodo` template machine that runs a `Typescript` node service along with `viem` to convert values from/to Hex strings. We could have switched to `Ethers` but the idea was to reduce the amount to code, and the `Sunodo` template used already have support to `viem`. The database runs `SQLite` with WASM support due to the nature of the Risc-V Node has no native support to `SQLite` bindings.

This will run an [anvil](https://book.getfoundry.sh/reference/anvil/) node as a local blockchain, and the GraphQL service and Inspect Service.

The Database consists in a simple SQLite database with a table called PRODUCTS, each product has an ID and a NAME. IDs are unique so in case user tries to register PRODUCT with same ID the backend will reject the attempt.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

This project is meant to run on [Cartesi Machine](https://docs.cartesi.io/), the tool used to run and deploy the backend to public networks was [Sunodo](https://docs.sunodo.io/guide/introduction/what-is-sunodo).

This project is based on the following repositories from Cartesi team:

- [Sunodo Typescript template project](https://github.com/sunodo/sunodo-templates/tree/main/typescript)
- [Backend SQLite Image](https://github.com/cartesi/rollups-examples/tree/main/sqlite)
- [Front-end Echo Example](https://github.com/cartesi/rollups-examples/tree/main/frontend-echo)
