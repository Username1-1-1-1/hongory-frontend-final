import React, { useState } from "react";

const TreeNode = ({ label, data }) => {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen(!open);

  return (
    <div style={{ marginLeft: "16px" }}>
      <div
        onClick={toggle}
        style={{
          cursor: "pointer",
          userSelect: "none",
          color: "#004080",
        }}
      >
        {open ? "▼" : "▶"} {label}
      </div>

      {open && (
        <div style={{ marginLeft: "16px", color: "#444" }}>
          {data === null || data === undefined ? (
            <i style={{ color: "gray" }}>비어 있음</i>
          ) : Array.isArray(data) ? (
            data.map((item, idx) => <div key={idx}>• {item}</div>)
          ) : typeof data === "object" ? (
            Object.entries(data).map(([k, v]) => (
              <TreeNode key={k} label={k} data={v} />
            ))
          ) : (
            <div>{data}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default TreeNode;
