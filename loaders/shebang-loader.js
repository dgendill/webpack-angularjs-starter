module.exports = function(source) {
	this.cacheable && this.cacheable();
  if ((typeof source === "string") && (/^#!/.test(source))) {
    source = source.replace(/^#![^\n\r]*[\r\n]/, '');
  }
	return source
	// this.value = [value];
	// return "module.exports = " + JSON.stringify(value, undefined, "\t") + ";";
}