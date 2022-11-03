const { API_URI } = process.env;

export class UserServices {
  static async getUserInfo(token: string) {
    return fetch(`${API_URI}/api/user/get-user-info`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
