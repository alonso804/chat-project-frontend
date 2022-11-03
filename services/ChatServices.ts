const { API_URI } = process.env;

export class ChatServices {
  static async getChat(token: string, username: string) {
    return fetch(`${API_URI}/api/chat/${username}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
