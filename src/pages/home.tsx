import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setData } from "../lib/util";

function HomePage() {
  const navigate = useNavigate();

  async function onKeyUpInput(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== "Enter") {
      return;
    }

    try {
      const res = await logIn(Number(e.currentTarget.value));
      setData("userId", res.data.data.id);
      navigate("/lobby");
    } catch (err) {
      console.log("[login failed]", err);
    }
  }

  async function logIn(userId: number) {
    return axios.post("/user/login", {
      userId: userId,
    });
  }

  return (
    <div>
      <input
        type="text"
        placeholder="put user id"
        className="px-2 py-1"
        onKeyUp={onKeyUpInput}
      />
    </div>
  );
}

export default HomePage;
