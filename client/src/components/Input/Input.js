import React from 'react';

import './Input.css';

const Input = ({message, setMessage, sendMessage, uploadImage}) => (
    <form className="form">
        <input
            className="input"
            type="text"
            placeholder="הקלד הודעה..."
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyPress={(event) => event.key === 'Enter' ? sendMessage(event) : null}
        />
        <input className="input" type="file" accept=".jpg, .jpeg, .png" onChange={(event) => uploadImage(event)} />
        <button className="sendButton" onClick={(event) => sendMessage(event)}>Send</button>
    </form>
);

export default Input;