import React, { useState, useEffect } from "react";
import "./Chat.css";
import Avatar from "@mui/material/Avatar";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import AttachFile from "@mui/icons-material/AttachFile";
import InsertEmoticon from "@mui/icons-material/InsertEmoticon";
import Mic from "@mui/icons-material/Mic";
import { useStateValue } from "./StateProvider";
import IconButton from "@mui/material/IconButton";

import {
  doc,
  addDoc,
  serverTimestamp,
  query,
  onSnapshot,
  orderBy,
  collection,
} from "firebase/firestore";
import { db } from "./Sidebar";

import { useParams } from "react-router-dom";
const Chat = () => {
  const [seed, setSeed] = useState("");
  const [input, setInput] = useState("");
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState("");
  const [msgs, setMsgs] = useState([]);
  const [{ user }, dispatch] = useStateValue();

  useEffect(() => {
    if (roomId) {
      onSnapshot(doc(db, "rooms", roomId), (snapShot) => {
        console.log("Current data from chat: ", snapShot.data());
        setRoomName(snapShot.data().name);
      });

      const messagesQuery = query(
        collection(db, "rooms", roomId, "messages"),
        orderBy("timestamp", "asc")
      );
      console.log("msgquery", messagesQuery);

      onSnapshot(messagesQuery, (queryShot) => {
        console.log("ordered data: ", queryShot.docs);
        setMsgs(
          queryShot.docs.map((doc) => {
            console.log("doc.data", doc.id);

            return { messageId: doc.id, ...doc.data() };
          })
        );
      });
    }
    // return () => {
    //      };
  }, [roomId]);

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, [roomId]);

  const sendMessage = async (e) => {
    //
    console.log("user", user);

    e.preventDefault();
    console.log("you typed", input);
    const docRef = await addDoc(collection(db, "rooms", roomId, "messages"), {
      message: input,
      name: user.displayName,
      senderUid: user.uid,
      timestamp: serverTimestamp(),
    });
    console.log(docRef);
    setInput("");
  };

  return (
    <div className="chat">
      <div className="chat_header">
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
        <div className="chat_header_info">
          <h3>{roomName}</h3>
          <p>
            Last seen{" "}
            {new Date(msgs[msgs.length - 1]?.timestamp?.toDate()).toUTCString()}
          </p>
        </div>
        <div className="chat_header_right">
          <IconButton>
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>
      <div className="chat_body">
        {msgs.map((message) => {
          console.log("msgId", message);
          return (
            <p
              key={message.messageId}
              className={`chat_message ${
                message.senderUid === user.uid && "chat_reciever"
              }`}
            >
              <span className="chat_name">{message.name}</span>
              {message.message}
              <span className="chat_timestamp">
                {new Date(message.timestamp?.toDate()).toUTCString()}
              </span>
            </p>
          );
        })}
      </div>
      <div className="chat_footer">
        <InsertEmoticon />
        <form>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message"
            type="text"
          />
          <button onClick={sendMessage} type="submit">
            send
          </button>
        </form>
        <Mic />
      </div>
    </div>
  );
};

export default Chat;
