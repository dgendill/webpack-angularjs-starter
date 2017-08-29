
function UserSession(data) {
  Object.assign(this, data);
  Object.defineProperty(this, 'firstName', {
    get : function() {
      return this.firstName + " " + this.lastName;    
    }
  });
}

let fn = function(data) {
  return new UserSession(data);
}

fn.createMock = function() {
  return fn({
    username : "demouser",
    firstName : "Greg",
    lastName : "Johnson",
    role : "admin",
    token : "abc123"
  });
}

export default fn;
