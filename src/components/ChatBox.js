// components/ChatBox.js
import React, { useState } from "react";

const ChatBox = ({ username, tree = {"홍익대학교" : {}},setTree }) => {
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);

  const handleSend = async () => {
    if (!message.trim()) return;

    // 채팅 추가
    setChatLog((prev) => [
      ...prev,
      { role: "user", content: message, name: username }
    ]);
    
    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      // 트리 갱신
      console.log("🌳 기존 트리:", tree);
      console.log("🌱 새 트리:", data.tree);

      if ((isTreeDifferent(tree, data.tree)) && !data.tree.value){
      // ✅ 트리가 진짜 바뀐 경우에만 메시지 출력
        setChatLog((prev) => [
        ...prev,
        { role: "ai", content: "트리가 업데이트되었습니다." }
      ]);
      setTree(data.tree);
    }
    } catch (err) {
      console.error("서버 오류:", err);
      setChatLog((prev) => [
        ...prev,
        { role: "ai", content: "⚠️ 서버 오류가 발생했어요." },
      ]);
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
