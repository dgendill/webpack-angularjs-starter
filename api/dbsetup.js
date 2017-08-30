const mysql = require('mysql');
const bcrypt = require('bcrypt-nodejs');
const Promise = require('bluebird');
Promise.promisifyAll(require("mysql/lib/Connection").prototype);
Promise.promisifyAll(require("mysql/lib/Pool").prototype);

export function createNewUser(connection, username, password) {
  return new Promise(function(success, fail) {
    const c = connection;
    let saltRounds = 10;
    
    bcrypt.genSalt(saltRounds, function(err, salt) {
      if (err) fail(err);
      bcrypt.hash(password, salt, null, function(err, hash) {
        if (err) fail(err);
        c.queryAsync(
          'INSERT INTO user SET ?',
          {
            username : username,
            password : hash
          }
        ).then(success).error(fail);
      });
    })
    
  });
}

// Promise
export function connect() {
  return new Promise(function(resolve, reject) {
    // CredentialObject
    let credentials = require('./dbcredentials.js').default;
    var connection = mysql.createConnection(credentials);
    
    connection.connect(function(err) {
      if (err) reject(err);
      connection.app = {
        useDB : function() {
          connection.query('USE ' + dbname);
        }
      }

      resolve(connection);
    });   
  });	
}

export function schema(connection, dbuser, dbname) {
  const c = connection;
  const s = {};

  // Promise
	s.user = function() {
		return c.queryAsync(`
			GRANT ALL ON ` + dbname + `.* TO "` + dbuser + `"@"localhost"
		`)
	}

  // Promise
	s.createdb = function() {
		return c.queryAsync(`
			CREATE DATABASE IF NOT EXISTS ` + dbname + `
			CHARACTER SET utf8
			COLLATE utf8_unicode_ci
		`)
	}

  // Promise
	s.reset = function() {
		return c.queryAsync(`
			DROP DATABASE IF EXISTS ` + dbname + `
		`)
	}
  
  // Promise
	s.createtables = function() {
    return Promise.all([
      c.queryAsync('use ' + dbname),
      c.query(`
        CREATE TABLE IF NOT EXISTS user
        (
          id INT UNSIGNED NOT NULL AUTO_INCREMENT,
          username VARCHAR(50) NOT NULL UNIQUE,
          password VARCHAR(50) NOT NULL,
          PRIMARY KEY (id)
        )
      `)
    ]);
	}

  // Promise
	s.setup = function() {
		return Promise.all([
      s.createdb(),
      s.createtables()
    ]);
  }

	return s;

};

export function setup() {
  let dbname = "angularapp";
  let dbconfig = require('./dbcredentials.js').default;
  return connect()
    .then(function(connection) {
      let s = schema(connection, dbconfig.user, dbname);
      
      return Promise.all([
        s.reset(),
        s.setup(),
        createNewUser(connection, 'demo', 'demo')
      ])
      .then(function() {
        console.log('Done');
      })
      .finally(function() {
        connection.end();
      })
    })
}

setup().catch(function(err) {
  console.error(err);
})


