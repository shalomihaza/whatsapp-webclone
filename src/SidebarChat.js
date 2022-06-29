import React, { useEffect, useState } from "react";
import "./SidebarChat.css";
import Avatar from "@mui/material/Avatar";
import { db } from "./Sidebar";
import { Link } from "react-router-dom";

import {
  addDoc,
  query,
  onSnapshot,
  orderBy,
  collection,
} from "firebase/firestore";
const SidebarChat = ({ id, name, addNewChat }) => {
  const [seed, setSeed] = useState("");
  const [msgs, setMsgs] = useState([]);

  useEffect(() => {
    if (id) {
      const messagesQuery = query(
        collection(db, "rooms", id, "messages"),
        orderBy("timestamp", "desc")
      );

      onSnapshot(messagesQuery, (queryShot) => {
        setMsgs(queryShot.docs.map((doc) => doc.data()));
      });
    }
  });
  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, [id]);

  const createChat = async () => {
    const roomName = prompt("Please enter a name for the chat room");
    if (roomName) {
      const docRef = await addDoc(collection(db, "rooms"), {
        name: roomName,
      });
      console.log(docRef);
    }
  };
  return !addNewChat ? (
    <Link to={`/rooms/${id}`}>
      <div className="sidebar_chat">
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
        <div className="sidebar_chat_info">
          <h2>{name}</h2>
          <p>{msgs[0]?.message}</p>
        </div>
      </div>
    </Link>
  ) : (
    <div onClick={createChat} className="sidebar_chat">
      <h2>Add new Chat </h2>
    </div>
  );
};

export default SidebarChat;
