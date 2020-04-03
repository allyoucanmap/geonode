# Monitoring client

## Development setup

Start the development application locally:

- replace `DEV_SERVER_HOST` in `webpack.config.js` with an available running hostname of GeoNode

- `npm install`

- `npm start`

The application runs at `https://localhost:3000` afterwards.

Note: localhost uses `https` protocol to connect a remote GeoNode instance

## Bundle

Compile the client bundle:

`npm run compile`

the new bundle will override the old one located in the