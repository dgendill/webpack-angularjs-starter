import express from 'express';
import UserErrorResponse from 'Models/UserErrorResponse.js';
import ConfirmationResponse from 'Models/ConfirmationResponse.js';
import SuccessResponse from 'Models/SuccessResponse.js';
import crypto from 'crypto';
import * as Database from 'DB/dbsetup.js';
import Validate from 'Util/Validate.js';

function generateToken() {
  function randomValueHex (len) {
    return crypto.randomBytes(Math.ceil(len/2))
        .toString('hex') // convert to hexadecimal format
        .slice(0,len);   // return required number of characters
  }

  var sha = crypto.createHash('sha256');
  sha.update(randomValueHex(20));
  return sha.digest('hex');
}

let r = express.Router();

r.post('/', function(req, res) {
  var body = req.body;
  console.log(req);
  
  Validate(body)
    .requiredField('username', function(err) {
      res.status(400).send(UserErrorResponse(err));        
    })
    .requiredField('password', function(err) {
      res.status(400).send(UserErrorResponse("Password is required."));        
    })
    .ifValid(function() {
      // TODO save token in session table

      Database.connect()
      .then(function(connection) {
        Database.User(connection)
        .validatePassword(body.username, body.password)
        .then(function() {
          res.status(200).send(SuccessResponse({
            token : generateToken()
          }));
        })
        .catch(function(err) {
          res.status(401).send(UserErrorResponse("Username or password is incorrect." + err));        
        })
      });
      
    })
    
  
});


export default r;
