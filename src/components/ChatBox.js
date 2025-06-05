// components/ChatBox.js
import React, { useState, useEffect } from "react";

const ChatBox = ({ username, tree = {"홍익대학교" : {}},setTree }) => {
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL; // 예: https://yourdomain.com
    const wsProtocol = apiUrl.startsWith("https") ? "wss" : "ws";
    const wsUrl = apiUrl.replace(/^https?/, wsProtocol) + "/ws"; // wss://yourdomain.com/ws

    const ws = new WebSocket(wsUrl);  
    setSocket(ws);

    ws.onmessage = (event) => {
      const received = JSON.parse(event.data);
      setChatLog((prev) => [...prev, received]);
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleSend = async () => {
    if (!message.trim()) return;
    const userMessage = { role: "user", content: message, name: username };

    // 채팅 추가
    setChatLog((prev) => [
      ...prev, userMessage
    ]);
    socket?.send(JSON.stringify(userMessage)); // 🔄 다른 유저에게 전송
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      // 트리 갱신

      if ((isTreeDifferent(tree, data.tree)) && !data.tree.value){
      // ✅ 트리가 진짜 바뀐 경우에만 메시지 출력
      const aiMsg = { role: "ai", content: "트리가 업데이트되었습니다." };
      setChatLog((prev) => [...prev, aiMsg]);
      socket?.send(JSON.stringify(aiMsg));
      setTree(data.tree);
    }
    } catch (err) {
      const errMsg = { role: "ai", content: "⚠️ 서버 오류가 발생했어요." };
      setChatLog((prev) => [...prev, errMsg]);
      socket?.send(JSON.stringify(errMsg));
    }

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
