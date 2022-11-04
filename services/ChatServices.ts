const { API_URI } = process.env;

export class ChatServices {
  static async getChat(token: string, username: string) {
    return fetch(`${API_URI}/api/chat/${username}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  static async sendMessage(token: string, chatId: string, content: string) {
    return fetch(`${API_URI}/api/chat/${chatId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });
  }

  static async createChat(token: string, username: string, content: string) {
    return fetch(`${API_URI}/api/chat/${username}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });
  }
}
