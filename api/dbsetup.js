const mysql = require('mysql');
const bcrypt = require('bcrypt-nodejs');
const Promise = require('bluebird');
Promise.promisifyAll(require("mysql/lib/Connection").prototype);
Promise.promisifyAll(require("mysql/lib/Pool").prototype);

export function createNewUser(connection, username, password) {
  const c = connection;
  let saltRounds = 10;


  return new Promise(function(success, fail) {
    bcrypt.hash(password, saltRounds, function(err, hash) {
      c.queryAsync(
        'INSERT INTO user SET ?',
        {
          username : username,
          password : hash
        }
      ).then(success, fail);
    });
  });
}


export function connect() {
  // CredentialObject
  let credentials = require('./dbcredentials.js').default;
  let connection = mysql.createConnection(credentials);

	connection.connect();

	connection.app = {
		useDB : function() {
			connection.query('USE ' + dbname);
		}
	}
	return connection;
}

export function schema(connection, dbuser, dbname) {
  const c = connection;
  const s = {};

	s.user = function() {
		c.query(`
			GRANT ALL ON ` + dbname + `.* TO "` + dbuser + `"@"localhost"
		`)
	}

	s.createdb = function() {
		c.query(`
			CREATE DATABASE IF NOT EXISTS ` + dbname + `
			CHARACTER SET utf8
			COLLATE utf8_unicode_ci
		`)
	}

	s.reset = function() {
		c.query(`
			DROP DATABASE IF EXISTS ` + dbname + `
		`)
	}

	s.createtables = function() {
    c.query('use ' + dbname);

		c.query(`
			CREATE TABLE IF NOT EXISTS user
			(
				id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        username TEXT NOT NULL,
				password TEXT NOT NULL,
				PRIMARY KEY (id)
			)
		`)
	}

	s.setup = function() {
		s.createdb();
		s.createtables();
  }

	return s;

};

export function setup() {
  let dbname = "angularapp";
  let dbconfig = require('./dbcredentials.js').default;
  let s = schema(connect(), dbconfig.user, dbname);
	s.reset();
	s.setup();
	console.log('Done.');
}

setup();
