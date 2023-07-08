const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const https = require("https");

const fs = require('fs');
const axios = require('axios');

const decksdb = require('./interfaces/decks');

const app = express();
const port = 3333;
app.use(cors({origin: '*'}));

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: true}));

app.post('/', (request, response) => {
    response.json({ info: 'API endpoint for CommanderDash' });});

app.post('/api/decks', decksdb.getAllDecks);
app.post('/api/deck', decksdb.getDeck);

app.listen(port, () => {
    console.log(`App running on port ${port}.`);
});