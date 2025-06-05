// components/ChatBox.js
import React, { useState, useEffect } from "react";

const ChatBox = ({ username, tree = {"홍익대학교" : {}},setTree }) => {
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const ws = new WebSocket("wss://hongory-backend.onrender.com/ws");  
    ws.onopen = () => {
      console.log("✅ WebSocket 연결됨");
      setSocket(ws); // 여기서 비동기로 socket이 설정되므로 타이밍 중요
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
    
      if (data.type === "tree_update") {
        setTree(data.tree);
      } else if (data.type === "chat") {
        // 내 메시지가 아니라면 추가 (username으로 구분)
        if (data.name !== username) {
          setChatLog((prev) => [...prev, { role: "user", content: data.message, name: data.name }]);
        }
      }
    };
    

    return () => {
      ws.close();
    };
  }, []);

  const handleSend = async () => {
    if (!socket || socket.readyState !== WebSocket.OPEN) return;
    
    if (!message.trim()) return;

    const userMessage = { role: "user", content: message, name: username };

    setChatLog((prev) => [...prev, userMessage]);
      // 채팅 추가
    socket.send(JSON.stringify({
      type: "chat",
      content: message,
      name: username
    }));    
    setMessage(""); // 입력창 비우기
  };

  return (
    <div style={{ width: "300px", padding: "10px", height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ flexGrow: 1, overflowY: "auto", border: "1px solid #ccc", padding: "10px" }}>
        {chatLog.map((chat, idx) => (
          <div key={idx} style={{ marginBottom: "8px" }}>
            <strong>
              {chat.role === "user" ? `${chat.name || "사용자"} : ` : "🤖 : "}
            </strong>
            <span>{chat.content}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", marginTop: "10px" }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="메시지를 입력하세요..."
          style={{ flexGrow: 1, padding: "8px" }}
        />
        <button onClick={handleSend} style={{ padding: "8px 12px", marginLeft: "5px" }}>
          보내기
        </button>
      </div>
    </div>
  );
};

export default ChatBox;

const isTreeDifferent = (a, b) => {
  return !deepEqual(a, b);
};

const deepEqual = (a, b) => {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (typeof a !== "object" || a === null || b === null) return false;

  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;

  for (let key of aKeys) {
    if (!b.hasOwnProperty(key)) return false;
    if (!deepEqual(a[key], b[key])) return false;
  }
  
  return true;
};


