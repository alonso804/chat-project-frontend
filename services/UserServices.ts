const { API_URI } = process.env;

export class UserServices {
  static async getUserInfo(token: string) {
    const response = await fetch(`${API_URI}/api/user/get-user-info`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.json();
  }

  static async getUserChats(token: string) {
    const response = await fetch(`${API_URI}/api/user/get-user-chats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.json();
  }

  static async getAllUsers(token: string, term: string) {
    const reponse = await fetch(
      `${API_URI}/api/user/get-all-users?term=${term}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return reponse.json();
  }
}
