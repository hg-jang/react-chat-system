import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import { getData } from "../lib/util";

export type ChatRoomsMessage = {
  fromUserId: number | "SYSTEM";
  message: string;
};

const socket = io("http://localhost:8061/chat");

function ChatRoomPage() {
  const params = useParams();

  const [roomId, setRoomId] = useState<number>();

  const [chatRoomMessages, setChatRoomMessages] = useState<ChatRoomsMessage[]>(
    []
  );

  const [chatMessagesWaiting, setChatMessagesWaiting] = useState<string[]>([]);

  function onKeyUpInput(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      const chatMessage = e.currentTarget.value;

      if (!chatMessage) return;

      setChatMessagesWaiting([...chatMessagesWaiting, chatMessage]);

      e.currentTarget.value = "";
    }
  }

  // async function startNewChat(userId: number) {
  //   try {
  //     const res = await axios.post("/chat/room", {
  //       userIds: [userId],
  //       name: `채팅방 ${getRandomNumber(1, 99999)}`,
  //     });

  //     navigate(`/room/${res.data.data.roomId}`);
  //   } catch (err) {
  //     console.log(err);
  //     alert("start new chat failed.");
  //   }
  // }

  useEffect(() => {
    if (!params.roomId) {
      return;
    }
    setRoomId(Number(params.roomId));
  }, [params]);

  useEffect(() => {
    function onConnect() {
      console.log("socket connected");
    }

    function onDisconnect() {
      console.log("socket disconnected");
    }

    function onUserList(data: unknown) {
      console.log("user list", data);
    }

    function onNewUser(data: { userId: number }) {
      setChatRoomMessages([
        ...chatRoomMessages,
        {
          fromUserId: "SYSTEM",
          message: `${data.userId} 님이 입장하였습니다.`,
        },
      ]);
    }

    function onChatMessage(data: ChatRoomsMessage) {
      setChatRoomMessages([...chatRoomMessages, data]);
    }

    socket.on("connect", onConnect);

    socket.on("disconnect", onDisconnect);

    socket.on("user-list", onUserList);

    socket.on("new-user", onNewUser);

    socket.on("chat-message", onChatMessage);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("user-list", onUserList);
      socket.off("new-user", onNewUser);
      socket.off("chat-message", onChatMessage);
    };
  }, []);

  useEffect(() => {
    if (!roomId) return;

    function onJoinRoom() {
      console.log("채팅방에 입장하였습니다.");
    }

    socket.emit(
      "join-room",
      {
        roomId: String(roomId),
        userId: String(getData("userId")),
      },
      onJoinRoom
    );
  }, [roomId]);

  useEffect(() => {
    if (chatMessagesWaiting.length === 0) return;

    const data = {
      message: chatMessagesWaiting[0],
      fromUserId: getData("userId"),
      roomId: String(roomId),
    };

    setChatMessagesWaiting(chatMessagesWaiting.slice(1));
    socket.emit("chat-message", data);
  }, [chatMessagesWaiting, roomId]);

  useEffect(() => {
    console.log(chatRoomMessages);
  }, [chatRoomMessages]);

  return (
    <div>
      <h1 className="mb-8">Chat Room</h1>

      <div className="flex flex-col justify-between h-[600px] w-[300px] border">
        <ul className="flex flex-col gap-y-2 p-2 overflow-auto">
          {chatRoomMessages.map((chatRoomMessage, index) => {
            if (chatRoomMessage.fromUserId === "SYSTEM") {
              return <li key={index}>{chatRoomMessage.message}</li>;
            } else if (chatRoomMessage.fromUserId === getData("userId")) {
              <li key={index} className="inline-flex flex-end">
                {chatRoomMessage.message}
              </li>;
            } else {
              return (
                <li key={index} className="inline-flex flex-start">
                  {chatRoomMessage.message}
                </li>
              );
            }
          })}
        </ul>

        <div>
          <input
            type="text"
            className="w-full px-2 py-1"
            placeholder="enter chat"
            onKeyUp={onKeyUpInput}
          />
        </div>
      </div>
    </div>
  );
}

export default ChatRoomPage;
