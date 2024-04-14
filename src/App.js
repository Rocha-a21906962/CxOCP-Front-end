import { useState } from "react";
import axios from "axios";
import logo from './logo_lusofona.jpg';
function App() {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const chat = async (e, message) => {
    e.preventDefault();

    setIsTyping(true);

    let msgs = chats;
    msgs.push({ role: "user", content: message });
    setChats(msgs);

    window.scrollTo(0, 1e10);
    setMessage("");

    try {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyYjgxNWQ1Zi1iYjE1LTRmY2UtYWMxMi02MDI5ZmNjZDZhOWIiLCJleHAiOjE3MTMxMTk0MTJ9.cQhLg8udkAj1uXgNLTeRxJEqvx53OIi1vBPJolyZ1uQ'; // Replace with your JWT token

      const response = await axios.post(
        "http://localhost:5000/api/v1/chat/", 
        {
          message: message
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      msgs.push(response.data);
      setChats(msgs);
      setIsTyping(false);
      window.scrollTo(0, 1e10);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main>

      <div className="logo-and-heading-container">
        <img src={logo} alt="Logo" className="logo" />
        <h1>CxOCP Chatbot</h1>
      </div>

      <section>
        {chats && chats.length ? (
          chats.map((chat, index) => (
            <p
              key={index} // Use index instead of chat.index to avoid potential issues
              className={chat.role === "user" ? "user_msg" : ""}
            >
              <span className="role">{chat.role}</span>
              <br></br>
              <br/>
              <span className="content" dangerouslySetInnerHTML={{__html: chat.content.replace(/\n/g, "<br />")}}/>
            </p>
          ))
        ) : (
          ""
        )}
      </section>

      <div className={isTyping ? "" : "hide"}>
        <p>
          <i>Typing...</i>
        </p>
      </div>

      <form onSubmit={(e) => chat(e, message)}>
        <input
          type={"text"}
          name={"message"}
          value={message}
          placeholder={"Type a message and hit enter"}
          onChange={(e) => setMessage(e.target.value)}
        />
      </form>
    </main>
  );
}

export default App;