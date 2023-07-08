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

module.exports = {
    getAllDecks,
    getDeck,
}