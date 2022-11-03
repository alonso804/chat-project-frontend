import axios from "axios";

const { API_URI } = process.env;

export class AuthServices {
  static async login(username: string, password: string) {
    return axios.post(`${API_URI}/api/auth/login`, {
      username,
      password,
    });
  }

  static async signup(username: string, password: string, phoneNumber: string) {
    return axios.post(`${API_URI}/api/auth/signup`, {
      username,
      password,
      phoneNumber,
      publicKey: "123",
      privateKey: "123",
    });
  }
}
