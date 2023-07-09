const pool_config = require("../config/pool.config.js");
const pool = pool_config.getPool();

/**
 * Get the last played deck for a given user
 * @returns {deck, error}
 */
function getLastPlayedDeck(request, response) {
    let game_query = new Promise((resolve) => {
        if (request.body && request.body.id) {
            let id =  request.body.id;
            pool.query('SELECT * FROM game_results RIGHT JOIN games ON game_results.game_id = games.id WHERE player_id = ' + id +  ' AND games.test = false AND games.started IS NOT NULL ORDER BY game_id DESC;', (error, results) => {
                if (error) {
                    resolve({deck: null, error: error});
                }
                else {
                    if (results.rows && results.rows.length > 0 && results.rows[0].deck_id != null) {
                        let game = results.rows[0];
                        let deck_query = new Promise((resolve2) => {
                            pool.query('SELECT * FROM decks WHERE id = ' + game.deck_id, (error2, results2) => {
                                if (error2) {
                                    resolve2({deck: null, error: error2});
                                }
                                else {
                                    if (results2.rows && results2.rows.length > 0) {
                                        let deck = results2.rows[0];
                                        deck.won_last = game.winner;
                                        resolve2({deck: deck, error: null});
                                    }
                                    else {
                                        resolve2({deck: null, error: 'Deck data grab failed!'});
                                    }
                                }
                            });
                        });
                        deck_query.then((deck_data) => {
                            resolve(deck_data);
                        });
                    }
                    else {
                        resolve({deck: null, error: 'No game data for user!'});
                    }
                }
            });
        }
        else {
            resolve({deck: null, error: 'Request missing id field!'});
        }
    });
    game_query.then((deck_data) => {
        return response.json(deck_data);
    });
}

/**
 * Get the Win/Loss ratio for the deck with the given id
 * @returns {ratio, error}
 */
function getWinLossRatioForDeck(request, response) {
    let game_query = new Promise((resolve) => {
        if (request.body && request.body.id) {
            const id = request.body.id;
            pool.query('SELECT * FROM game_results RIGHT JOIN games ON game_results.game_id = games.id WHERE deck_id = ' + id + ' AND games.test = false AND games.started IS NOT NULL AND winner=true ORDER BY game_id DESC;', (error, results) => {
                if (error) {
                    resolve({ratio: 0, error: error});
                }
                else {
                    if (results.rows && results.rows.length > 0) {
                        pool.query('SELECT * FROM game_results RIGHT JOIN games ON game_results.game_id = games.id WHERE deck_id = ' + id + ' AND games.test = false AND games.started IS NOT NULL AND winner=false ORDER BY game_id DESC;', (error2, results2) => {
                            if (error2) {
                                resolve({ratio: 0, error: error2});
                            }
                            else {
                                if (results2.rows && results2.rows.length > 0) {
                                    resolve({ratio: results.rows.length / (results.rows.length + results2.rows.length), error: null});
                                }
                                else {
                                    resolve({ratio: results.rows.length, error: null});
                                }
                            }
                        });
                    }
                    else {
                        resolve({ratio: 0, error: null});
                    }
                }
            });
        }
        else {
            resolve({ratio: 0, error: "Request missing id field!"});
        }
    });
    game_query.then((ratio_data) => { return response.json(ratio_data); });
}

/**
 * Get the Win/Loss ratio for the user with the given id
 * @returns {ratio, error}
 */
function getWinLossRatioForUser(request, response) {
    let game_query = new Promise((resolve) => {
        if (request.body && request.body.id) {
            const id = request.body.id;
            pool.query('SELECT * FROM game_results RIGHT JOIN games ON game_results.game_id = games.id WHERE player_id = ' + id + ' AND games.test = false AND games.started IS NOT NULL AND winner=true ORDER BY game_id DESC;', (error, results) => {
                if (error) {
                    resolve({ratio: 0, error: error});
                }
                else {
                    if (results.rows && results.rows.length > 0) {
                        pool.query('SELECT * FROM game_results RIGHT JOIN games ON game_results.game_id = games.id WHERE player_id = ' + id + ' AND games.test = false AND winner=false ORDER BY game_id DESC;', (error2, results2) => {
                            if (error2) {
                                resolve({ratio: 0, error: error2});
                            }
                            else {
                                if (results2.rows && results2.rows.length > 0) {
                                    resolve({ratio: results.rows.length / (results.rows.length + results2.rows.length), error: null});
                                }
                                else {
                                    resolve({ratio: results.rows.length, error: null});
                                }
                            }
                        });
                    }
                    else {
                        resolve({ratio: 0, error: null});
                    }
                }
            });
        }
        else {
            resolve({ratio: 0, error: "Request missing id field!"});
        }
    });
    game_query.then((ratio_data) => { return response.json(ratio_data); });
}

/**
 * Get the average Win/Loss ratio for all users
 * @returns {ratio, error}
 */
function getAverageWinLossRatio(request, response) {
    let game_query = new Promise((resolve) => {
        pool.query('SELECT * FROM users', (error, results) => {
            if (error) {
                resolve({ratio: 0, error: error});
            }
            else {
                if (results.rows && results.rows.length > 0) {
                    let users = results.rows;
                    let ratio_promises = [];
                    for (let user of users) {
                        ratio_promises.push(new Promise((resolve2) => {
                            pool.query('SELECT * FROM game_results RIGHT JOIN games ON game_results.game_id = games.id WHERE player_id = ' + user.id + ' AND games.test = false AND games.started IS NOT NULL AND winner=true ORDER BY game_id DESC;', (error, results) => {
                                if (error) {
                                    resolve2({ratio: 0, error: error});
                                }
                                else {
                                    if (results.rows && results.rows.length > 0) {
                                        pool.query('SELECT * FROM game_results RIGHT JOIN games ON game_results.game_id = games.id WHERE player_id = ' + user.id + ' AND games.test = false AND games.started IS NOT NULL AND winner=false ORDER BY game_id DESC;', (error2, results2) => {
                                            if (error2) {
                                                resolve2({ratio: 0, error: error2});
                                            }
                                            else {
                                                if (results2.rows && results2.rows.length > 0) {
                                                    resolve2({ratio: results.rows.length / (results.rows.length + results2.rows.length), error: null});
                                                }
                                                else {
                                                    resolve2({ratio: results.rows.length, error: null});
                                                }
                                            }
                                        });
                                    }
                                    else {
                                        resolve2({ratio: 0, error: null});
                                    }
                                }
                            });
                        }));
                    }
                    Promise.all(ratio_promises).then((ratio_data) => {
                        if (ratio_data.length > 0) {
                            let ratio_sum = ratio_data.reduce((accumulator, r) => {
                                return accumulator + r.ratio;
                            }, 0);
                            resolve({ratio: ratio_sum / ratio_data.length, error: null});
                        }
                        else {
                            resolve({ratio: 0, error: 'No game data found!'});
                        }
                    });
                }
                else {
                    resolve({ratio: 0, error: 'No users found!'})
                }
            }
        });
    });
    game_query.then((ratio_data) => { return response.json(ratio_data); });
}

module.exports = {
    getLastPlayedDeck,
    getWinLossRatioForDeck,
    getWinLossRatioForUser,
    getAverageWinLossRatio
}