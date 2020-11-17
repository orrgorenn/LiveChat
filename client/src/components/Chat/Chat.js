import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

import InfoBar from '../InfoBar/InfoBar'
import Input from '../Input/Input'
import Messages from '../Messages/Messages'
import TextContainer from '../TextContainer/TextContainer';

import './Chat.css';

let socket;

const Chat = ({ location }) => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [users, setUsers] = useState('');
    const [image, setImage] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const ENDPOINT = 'localhost:2058';

    useEffect(() => {
        const {name, room} = queryString.parse(location.search);

        socket = io(ENDPOINT, {transports: ['websocket']});

        setName(name);
        setRoom(room);

        socket.emit('join', { name, room }, () => {});

        return () => {
            socket.emit('disconnect');

            socket.off();
        }
    }, [ENDPOINT, location.search]);

    useEffect(() => {
        socket.on('message', (message) => {
            setMessages([...messages, message]);
        });

        socket.on("roomData", ({ users }) => {
            setUsers(users);
        });
    }, []);

    const sendMessage = (event) => {
        event.preventDefault();

        if(message) {
            socket.emit('sendMessage', message, () => {
                setMessage('');
            });
        }
    }

    const uploadImage = (event) => {
        const fileList = event.target.files;
        const file = fileList[0];
        if (file.type && file.type.indexOf('image') === -1) {
            console.log('File is not an image.', file.type, file);
            return;
        }

        const reader = new FileReader();
        reader.addEventListener('load', (event) => {
            socket.emit('sendImage', event.target.result, () => {});
        });
        reader.readAsDataURL(file);
    }

    return (
        <div className="outerContainer">
            <div className="container">
                <InfoBar room={room} />
                <Messages messages={messages} name={name} />
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage} uploadImage={uploadImage} />
            </div>
            <TextContainer users={users}/>
        </div>
    );
}

export default Chat;