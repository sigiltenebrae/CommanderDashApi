const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const https = require("https");

const fs = require('fs');
const axios = require('axios');

const decksdb = require('./interfaces/decks');
const usersdb = require('./interfaces/users');
const gamessdb = require('./interfaces/games');

const app = express();
const port = 3333;
app.use(cors({origin: '*'}));

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: true}));

app.post('/', (request, response) => {
    response.json({ info: 'API endpoint for CommanderDash' });});

app.post('/api/decks', decksdb.getAllDecks);
app.post('/api/deck', decksdb.getDeck);
app.post('/api/deck/commander', decksdb.getCommanderForDeck);

app.get('/api/users', usersdb.getUsers);

app.post('/api/deck/last_played', gamessdb.getLastPlayedDeck);
app.post('/api/deck/win_loss', gamessdb.getWinLossRatioForDeck);
app.post('/api/user/win_loss', gamessdb.getWinLossRatioForUser);
app.post('/api/users/win_loss', gamessdb.getAverageWinLossRatio);

app.listen(port, () => {
    console.log(`App running on port ${port}.`);
});