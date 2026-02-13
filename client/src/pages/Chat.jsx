import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import socket from "../utils/socket";

const Chat = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const bottomRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("userInfo"));

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  /* 🔐 AUTH CHECK */
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  /* 📥 LOAD OLD MESSAGES */
  useEffect(() => {
    const loadMessages = async () => {
      const res = await fetch(
        `http://localhost:5000/api/messages/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const data = await res.json();
      setMessages(data);
    };

    loadMessages();
  }, [userId, user.token]);

  /* 🔴 SOCKET LISTENER (RECEIVER ONLY) */
  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => {
        // ✅ duplicate protection
        if (prev.find((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
    });

    return () => socket.off("receiveMessage");
  }, []);

  /* ⬇️ AUTO SCROLL */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* 📤 SEND MESSAGE */
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const res = await fetch("http://localhost:5000/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          receiverId: userId,
          content: newMessage,
        }),
      });

      const savedMessage = await res.json();

      // ✅ sender UI update (ONLY HERE)
      setMessages((prev) => [...prev, savedMessage]);

      // ✅ send to other user only
      socket.emit("sendMessage", savedMessage);

      setNewMessage("");
    } catch (err) {
      console.error("Message send failed", err);
    }
  };

  return (
    <div style={page}>
      {/* HEADER */}
      <div style={header}>
        <span style={back} onClick={() => navigate(-1)}>←</span>
        <div>
          <h3 style={{ margin: 0 }}>Chat</h3>
          <p style={subtitle}>Conversation</p>
        </div>
      </div>

      {/* CHAT */}
      <div style={chatCard}>
        <div style={chatArea}>
          {messages.length === 0 && (
            <div style={emptyState}>
              <div style={emoji}>💬</div>
              <p>Say hi and start chatting</p>
            </div>
          )}

          {messages.map((msg) => {
            const mine =
              msg.sender === user._id || msg.sender?._id === user._id;

            return (
              <div
                key={msg._id}
                style={{
                  display: "flex",
                  justifyContent: mine ? "flex-end" : "flex-start",
                  gap: "10px",
                }}
              >
                {!mine && <div style={avatar}>👤</div>}

                <div
                  style={{
                    ...bubble,
                    background: mine
                      ? "linear-gradient(135deg,#4f46e5,#6366f1)"
                      : "#f1f5f9",
                    color: mine ? "white" : "#111827",
                    borderTopRightRadius: mine ? 6 : 18,
                    borderTopLeftRadius: mine ? 18 : 6,
                  }}
                >
                  {msg.content}
                  <div style={time}>
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                {mine && <div style={avatarMine}>🙂</div>}
              </div>
            );
          })}

          <div ref={bottomRef} />
        </div>

        {/* INPUT */}
        <div style={inputBar}>
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message…"
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            style={input}
          />
          <button onClick={sendMessage} style={sendBtn}>➤</button>
        </div>
      </div>
    </div>
  );
};

/* ================= STYLES ================= */

const page = {
  minHeight: "100vh",
  background: "radial-gradient(circle at top,#eef2ff,#fdf4ff)",
};

const header = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
  padding: "18px 40px",
  background: "white",
  boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
};

const back = { fontSize: "22px", cursor: "pointer", color: "#4f46e5" };
const subtitle = { fontSize: "13px", color: "#6b7280" };

const chatCard = {
  maxWidth: "850px",
  margin: "30px auto",
  background: "white",
  borderRadius: "24px",
  boxShadow: "0 30px 60px rgba(0,0,0,0.12)",
  display: "flex",
  flexDirection: "column",
  height: "75vh",
};

const chatArea = {
  flex: 1,
  padding: "30px",
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
};

const bubble = {
  maxWidth: "60%",
  padding: "12px 16px",
  borderRadius: "18px",
  fontSize: "14px",
};

const time = {
  fontSize: "10px",
  opacity: 0.7,
  marginTop: "6px",
  textAlign: "right",
};

const avatar = {
  width: "32px",
  height: "32px",
  borderRadius: "50%",
  background: "#e5e7eb",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const avatarMine = { ...avatar, background: "#c7d2fe" };

const emptyState = {
  margin: "auto",
  textAlign: "center",
  color: "#6b7280",
};

const emoji = { fontSize: "48px", marginBottom: "10px" };

const inputBar = {
  padding: "18px",
  borderTop: "1px solid #e5e7eb",
  display: "flex",
  gap: "12px",
};

const input = {
  flex: 1,
  padding: "14px 18px",
  borderRadius: "30px",
  border: "1px solid #d1d5db",
};

const sendBtn = {
  width: "48px",
  height: "48px",
  borderRadius: "50%",
  border: "none",
  background: "linear-gradient(135deg,#4f46e5,#6366f1)",
  color: "white",
  cursor: "pointer",
};

export default Chat;
