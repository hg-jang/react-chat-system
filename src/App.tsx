import { Routes, Route, BrowserRouter } from "react-router-dom";
import "./App.css";
import LobbyPage from "./pages/lobby";
import HomePage from "./pages/home";
import ChatRoomPage from "./pages/chatRoom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/lobby" element={<LobbyPage />} />
        <Route path="/room" element={<ChatRoomPage />} />
        <Route path="/room/:roomId" element={<ChatRoomPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
