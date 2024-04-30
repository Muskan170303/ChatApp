import React, { useContext, useEffect, useState } from 'react';
import Modal from './Modal'; // Import your Modal component
import { AuthContext } from '../Context/AuthContext';
import { ChatContext } from '../Context/ChatContext';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

function Chats() {
  const [chats, setChats] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null); // State to track selected image
  const { currUser, chatSelected, setChatSelection } = useContext(AuthContext);
  const { dispatch, data } = useContext(ChatContext);

  useEffect(() => {
    const getChats = () => {
      const unSub = onSnapshot(doc(db, 'userChats', currUser.uid), (doc) => {
        const chatsData = doc.data();
        if (chatsData) {
          // Update state with chat data
          const chatsArray = Object.entries(chatsData).map(([chatId, chatInfo]) => ({
            chatId,
            ...chatInfo,
          }));
          setChats(chatsArray);
        }
      });
      return () => {
        unSub();
      };
    };
    currUser.uid && getChats();
  }, [currUser.uid]);

  const handleSelect = async (u) => {
    !chatSelected && setChatSelection(true);
    await dispatch({ type: 'CHANGE_USER', payload: u });
    ChangeRead(u);
  };

  const ChangeRead = async (u) => {
    const chatId = currUser.uid > u.uid ? currUser.uid + u.uid : u.uid + currUser.uid;
    await updateDoc(doc(db, 'userChats', currUser.uid), {
      [`${chatId}.unread`]: 0,
    });
  };

  const openModal = (imageUrl) => setSelectedImage(imageUrl); // Function to open modal
  const closeModal = () => setSelectedImage(null); // Function to close modal

  return (
    <div className="chats">
      {chats &&
        chats
          .sort((a, b) => b.lastMessage.timestamp - a.lastMessage.timestamp) // Sort based on last message's timestamp
          .map((chat) => (
            <div className="userChat" key={chat.chatId} onClick={() => handleSelect(chat.userInfo)}>
              <img src={chat.userInfo.photoURL} alt="" onClick={() => openModal(chat.userInfo.photoURL)} /> {/* Added onClick to open modal */}
              <div className="userChatInfo">
                <div className="div1">
                  <span>{chat.userInfo.displayName}</span>
                  <p>{chat.lastMessage ? chat.lastMessage.text : ''}</p>
                </div>
                <div className="div2">
                  <span className="time">
                    {new Intl.DateTimeFormat('en-IS', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }).format(
                      chat.lastMessage.timestamp
                    )}
                  </span>
                  {chat.unread === 0 ? null : <p>{chat.unread}</p>}
                </div>
              </div>
            </div>
          ))}
      {selectedImage && <Modal imageUrl={selectedImage} onClose={closeModal} />} {/* Render Modal when image is selected */}
    </div>
  );
}

export default Chats;
