import i from './auth.js';
let autoloader = require.context('./directives', true, /\.js$/);
autoloader.keys().forEach(function(key) {
  autoloader(key);
});
export default i;