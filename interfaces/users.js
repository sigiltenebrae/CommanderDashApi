const pool_config = require("../config/pool.config.js");
const pool = pool_config.getPool();

/**
 * Get a list of all users from the database.
 * @returns {users: user[], error}
 */
function getUsers(request, response) {
    let user_query = new Promise((resolve) => {
       pool.query('SELECT * FROM users;', (error, results) => {
          if (error) {
              resolve({users: null, error: error});
          }
          else {
              if (results.rows && results.rows.length > 0) {
                  let users = results.rows;
                  resolve({users: results.rows, error: null});
              }
              else {
                  resolve({users: [], error: 'No users found!'})
              }
          }
       });
    });
    user_query.then((users_data) => {
        return response.json(users_data);
    });
}

module.exports = {
    getUsers
}