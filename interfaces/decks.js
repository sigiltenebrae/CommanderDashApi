const pool_config = require("../config/pool.config.js");
const pool = pool_config.getPool();

/**
 * Get a list of decks from the database
 * @returns {decks: deck[], error}
 */
function getAllDecks(request, response) {
    let deck_query = new Promise((resolve) => {
        let sort = request.body && request.body.sort != null? request.body.sort: 'id';
        let order = request.body && request.body.order != null? request.body.order: 'ASC';
        let limit = request.body && request.body.limit != null? request.body.limit: -1;
        pool.query('SELECT * FROM decks ORDER BY ' + sort + ' ' + order + (limit > -1? ' LIMIT ' + limit: '') + ';', (error, results) => {
           if (error) {
               resolve({decks: [], error: error});
           }
           else {
               if (results.rows && results.rows.length > 0) {
                   let decks = results.rows;
                   resolve({decks: decks, error: null});
               }
               else {
                   resolve({decks: [], error: 'No decks found!'});
               }
           }
        });
    });
    deck_query.then((decks_data) => {
        return response.json(decks_data);
    });
}

/**
 * Get the basic deck information from the database
 * @returns {deck, error}
 */
function getDeck(request, response) {
    let deck_query = new Promise((resolve) => {
        if (request.body && request.body.id) {
            const id = request.body.id;
            pool.query('SELECT * FROM decks WHERE id = ' + id + ';', (error, results) => {
                if (error) {
                    resolve({deck: null, error: error});
                }
                else {
                    if (results.rows && results.rows.length > 0) {
                        let deck = results.rows[0];
                        resolve({deck: deck, errors: null});
                    }
                    else {
                        resolve({deck: null, error: 'No deck found with id ' + id + '!'});
                    }
                }
            });
        }
        else {
            resolve({deck: null, error: 'Request missing id field!'});
        }
    });
    deck_query.then((deck_data) => {
        return response.json(deck_data);
    });
}

/**
 * Get the commander(s) for the given deck
 * @returns {commanders: commander[]}
 */
function getCommanderForDeck(request, response) {
    let deck_query = new Promise((resolve) => {
        if (request.body && request.body.id) {
            const id = request.body.id;
            pool.query('SELECT name FROM deck_cards WHERE deckid = ' + id + ' AND iscommander = true', (error, results) => {
                if (error) {
                    resolve({commanders: [], error: error});
                }
                else {
                    if (results.rows && results.rows.length > 0) {
                        let commanders = results.rows;
                        resolve({commanders: commanders, error: null});
                    }
                    else {
                        resolve({commanders: [], error: 'No commander found for deck with id: ' + id});
                    }
                }
            })
        }
        else {
            resolve({commanders: [], error: 'Request missing id field!'})
        }
    });
    deck_query.then((commander_data) => {
        return response.json(commander_data);
    });
}

module.exports = {
    getAllDecks,
    getDeck,
    getCommanderForDeck,
}