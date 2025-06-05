import React, { useState } from "react";
import ChatBox from "./components/ChatBox";
import TreeNode from "./components/TreeNode";

function App() {
  const [tree, setTree] = useState({"홍익대학교":{}});
  const [username, setUsername] = useState(null);
  const [inputName, setInputName] = useState("");   // 입력 필드 상태
  console.log(process.env.REACT_APP_API_URL);  // undefined면 문제 있음

  const handleLogin = () => {
    if (inputName.trim() !== "") {
      setUsername(inputName);
    }
  };
  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      {!username ? (
        <div>
          <h3>로그인</h3>
          <input
            type="text"
            placeholder="닉네임 입력"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            style={{ marginRight: "8px" }}
          />
          <button onClick={handleLogin}>로그인</button>
        </div>
      ) : (
        <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ width: "70%", overflowY: "auto", borderRight: "1px solid black", padding: "10px" }}>
        <h3>HONGORY</h3>
        {Object.entries(tree).map(([k, v]) => (
          <TreeNode key={k} label={k} data={v} />
        ))}
      </div>
      <div style={{ width: "20%", padding: "10px" }}>
        <ChatBox tree={tree} username={username} setTree={setTree} />
      </div>
    </div>
      )}
    </div>
  );
  
}

export default App;
