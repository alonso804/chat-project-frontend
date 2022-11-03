import axios from "axios";

const { API_URI } = process.env;

export class AuthServices {
  static async login(username: string, password: string) {
    const response = await axios.post(`${API_URI}/api/auth/login`, {
      username,
      password,
    });
    return response.data;
  }

  static async signup(username: string, password: string, phoneNumber: string) {
    const response = await axios.post(`${API_URI}/api/auth/signup`, {
      username,
      password,
      phoneNumber,
      publicKey: "123",
      privateKey: "123",
    });
    return response.data;
  }
}
