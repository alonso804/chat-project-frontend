const { API_URI } = process.env;

export class AuthServices {
  static async login(username: string, password: string) {
    return fetch(`${API_URI}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
  }

  static async signup(
    username: string,
    password: string,
    publicKey: string,
    privateKey: string,
    googleAuthSecret: string
  ) {
    return fetch(`${API_URI}/api/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
        publicKey,
        privateKey,
        googleAuthSecret,
      }),
    });
  }
}
