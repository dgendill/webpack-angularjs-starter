function AuthError(data) {
  this.error = data;
  this.message = data.message;
}

AuthError.NoCookie = new AuthError({
  message : "Auth cookie could not be found."
});
AuthError.NoCookie.id = "NoCookie";

AuthError.NoPassword = new AuthError({
  message : "Please enter a password"
});
AuthError.NoPassword.id = "NoPassword";

export default AuthError;