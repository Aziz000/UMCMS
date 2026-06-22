export function validateLoginInput(username, password) {
  return username.trim().length > 0 && password.trim().length > 0;
}

export function handleLogin(username, password) {
  if (validateLoginInput(username, password)) {
    return { success: true, redirectUrl: 'dispensing.html' };
  }
  return { success: false, message: 'Please enter username and password.' };
}
