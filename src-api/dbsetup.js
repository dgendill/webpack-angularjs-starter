const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const Promise = require('bluebird');
const _ = require('lodash');
const dbname = "angularapp";

Promise.promisifyAll(require("mysql/lib/Connection").prototype);
Promise.promisifyAll(require("mysql/lib/Pool").prototype);

export function createNewUser(connection, username, password) {
  return new Promise(function(success, fail) {
    const c = connection;
    let saltRounds = 10;
        
    bcrypt.hash(password, saltRounds, function(err, hash) {
      if (err) fail(err);
      c.queryAsync(
        'INSERT INTO user SET ?',
        {
          username : username,
          password : hash
        }
      ).then(success).error(fail);
    });
    
  });
}

export function User(connection) {
  return {
    validatePassword : function(username, password) {
      return this.getByUsername(username)
      .then(function(user) {
        
        console.log("P", password)
        console.log("U", user);

        return new Promise(function(resolve, reject) {
          bcrypt.compare(password, user.password, function(err, res) {
            console.log(err, res);
            if (err) reject(err);
            if (res == true) {
              resolve(res);
            } else {
              reject(new Error('Invalid username or password.'));
            }
          });
        })        
      });      
    },
    getByUsername : function(username) {
      return connection.queryAsync(
        'SELECT * FROM user WHERE ?',
        { username : username }
      ).then(_.first);
    }
  }
}

export function Session(connection) {
  return {
    create : function(userid, sessionid) {
      return connection.queryAsync(
			  'INSERT INTO session SET ?',
        {
          id : sessionid,
          user_id : userid    
        }
		  )
    }
  }
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
        useDefaultDB : function() {
          connection.query('USE ' + dbname);
        }
      }
      connection.app.useDefaultDB();

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
          password VARCHAR(60) NOT NULL,
          PRIMARY KEY (id)
        )
      `),
      c.query(`
        CREATE TABLE IF NOT EXISTS session
        (
          id VARCHAR(35) NOT NULL PRIMARY KEY,
          created TIMESTAMP,
          user_id INT UNSIGNED NOT NULL,
          CONSTRAINT \`fk_session_user\`
            FOREIGN KEY (user_id) REFERENCES user (id)
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


