export const LoginStart = (userCredentials) => ({   // 17-03-2023 Note : In the statement export const LoginStart = (user) => ({ type: "LOGIN_START", });, we use parentheses instead of curly braces to implicitly return an object literal from the arrow function.
  type: "LOGIN_START",
});

export const LoginSuccess = (user) => ({
  type: "LOGIN_SUCCESS",
  payload: user,
});

export const LoginFailure = (error) => ({
  type: "LOGIN_FAILURE",
  payload : error
});
