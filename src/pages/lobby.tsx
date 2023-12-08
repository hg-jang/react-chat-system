import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getData, setData } from "../lib/util";

export type ChatRoom = {
  id: number;
  name: string;
};

export type User = {
  id: number;
};

function LobbyPage() {
  const navigate = useNavigate();

  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [myChatRooms, setMyChatRooms] = useState<ChatRoom[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  function onClickRoom(e: React.MouseEvent<HTMLLIElement, MouseEvent>) {
    const roomId = Number(e.currentTarget.dataset.id);
    enterChatRoom(roomId);
  }

  function enterChatRoom(roomId: number) {
    setData("chatRoomId", roomId);
    navigate(`/room/${roomId}`);
  }

  function onClickUser(e: React.MouseEvent<HTMLLIElement, MouseEvent>) {
    const userId = Number(e.currentTarget.dataset.id);
    startChatWithUser(userId);
  }

  function startChatWithUser(userId: number) {
    setData("chatUserId", userId);
    navigate("/room");
  }

  useEffect(() => {
    getMyChatRooms();
    getWholeChatRooms();
    getUsers();

    async function getMyChatRooms() {
      try {
        const res = await axios.get("chat/rooms/my", {
          params: { u: getData("userId") },
        });
        setMyChatRooms(res.data.data.rooms);
      } catch (err) {
        setMyChatRooms([]);
      }
    }

    async function getWholeChatRooms() {
      try {
        const res = await axios.get("chat/rooms", {
          params: { u: getData("userId") },
        });
        setChatRooms(res.data.data.rooms);
      } catch (err) {
        setChatRooms([]);
      }
    }

    async function getUsers() {
      const myId = Number(getData("userId"));

      try {
        const res = await axios.get("user/others");
        setUsers((res.data.data as User[]).filter((user) => user.id !== myId));
      } catch (err) {
        setUsers([]);
      }
    }
  }, []);

  return (
    <div className="flex flex-row gap-16">
      <div>
        <h1 className="mb-9">My Chat Rooms</h1>

        <ul className="flex flex-col gap-4">
          {myChatRooms.map((room) => (
            <li
              key={room.id}
              data-id={room.id}
              className="py-2 border cursor-pointer"
              onClick={onClickRoom}
            >
              {room.name}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h1 className="mb-8">Whole Chat Rooms</h1>

        <ul className="flex flex-col gap-4">
          {chatRooms.map((room) => (
            <li
              key={room.id}
              data-id={room.id}
              className="py-2 border cursor-pointer"
              onClick={onClickRoom}
            >
              {room.name}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h1 className="mb-8">Users</h1>

        <ul className="flex flex-col gap-4">
          {users.map((user) => (
            <li
              key={user.id}
              className="py-2 border cursor-pointer"
              data-id={user.id}
              onClick={onClickUser}
            >
              {user.id}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default LobbyPage;
