
function Validate(context) {
  if (context.hasOwnProperty) {
    return Validate.objectValidator(context);
  } else {
    throw new Error('Validate does not work with non-objects.');
  }
}
Validate.objectValidator = function(context) {
  if (!(this instanceof Validate.objectValidator)) {
    return new Validate.objectValidator(context);
  }

  this.isValid = true;

  this.requiredField = function(name, failFn) {
    if (!(context.hasOwnProperty(name))) {
      failFn('Validation of field "' + name + '" failed. It could not be found on the context.');
      this.isValid = false;   
    } else if (context[name] == null) {
      failFn('Validation of field "' + name + '" failed. The value is null or undefined');
      this.isValid = false;   
    }

    return this;
  }

  this.ifValid = function(fn) {
    if (this.isValid) {
      fn();
    }
  }
}

export default Validate;