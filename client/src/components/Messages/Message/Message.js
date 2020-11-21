import React from 'react';

import './Message.css';

import ReactEmoji from 'react-emoji';

const Message = ({ message: { text, user, image }, name }) => {
  let isSentByCurrentUser = false;
  
  const trimmedName = name.trim().toLowerCase();

  if(user === trimmedName) {
    isSentByCurrentUser = true;
  }

  return (
    isSentByCurrentUser
      ? (
        <div className="messageContainer justifyStart">
          <p className="sentText pl-10">{trimmedName}</p>
          <div className="messageBox backgroundBlue">
            <p className="messageText colorWhite">
              {text !== '' ? text : <img src={image} alt={user} width={200} />}
            </p>
          </div>
        </div>
        )
        : (
          <div className="messageContainer justifyEnd">
            <div className="messageBox backgroundLight">
              <p className="messageText colorDark">{ReactEmoji.emojify(text)}</p>
            </div>
            <p className="sentText pr-10">{user}</p>
          </div>
        )
  );
}

export default Message;