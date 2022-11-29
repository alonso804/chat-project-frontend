import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import io from "socket.io-client";

export const useSocket = (uri: string, token: string, userInfo: any) => {
  console.log(uri);
  console.log(token);
  console.log(userInfo);
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    const socketIo = io(uri, {
      query: { token },
      auth: {
        user: {
          _id: userInfo.id,
          username: userInfo.username,
        },
      },
    });

    console.log(socketIo);
    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, [uri, token, userInfo]);

  return socket as Socket;
};
