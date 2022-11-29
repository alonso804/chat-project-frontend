import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import io from "socket.io-client";

export const useSocket = (uri: string, token: string, userInfo: any) => {
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    const socketIo = io(uri, {
      query: { token },
      auth: {
        user: {
          _id: userInfo.id,
          username: userInfo.username,
          publicKey: userInfo.publicKey,
        },
      },
    });

    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, [uri, token, userInfo]);

  return socket as Socket;
};
