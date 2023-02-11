import { DeleteOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Space, Modal, Card, Divider, Input, Row, Col, Avatar, Tag, Popover, message } from "antd";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import io from 'socket.io-client';
import { useRef } from "react";
const socket = io('http://localhost:4000');


function HostText(prop) {
    const user = prop.data
    return (
        <Space align="end" style={{ marginTop: "5px" }}>
            <Avatar
                size={32}
                icon={<UserOutlined />}
                src={require(`../../accountImages/${user.profile}`)}
            />
            <Text
                color="#73d13d"
                time={user.date}
                messageId={user.id_texting}
                textingId={user.textingId}
            >
                {user.text}
            </Text>
        </Space>
    )
}

function Text(prop) {
    const time = prop.time.split(' ')[1].split(":")
    const stringTime = [time[0], time[1]].join(":");

    let timeplacement;
    if (prop.color === "#d9d9d9") {
        timeplacement = (
            <div style={{
                color: "#8c8c8c",
                fontSize: "10px"
            }}>
                {stringTime}
            </div>
        )
    }
    else {
        timeplacement = (
            <div style={{
                color: "#f0f0f0",
                fontSize: "10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: 'flex-end'
            }}>
                {stringTime}
                <DeleteMessageBtn
                    messageId={prop.messageId}
                    textingId={prop.textingId}
                />
            </div>
        )
    }

    return (
        <div style={{
            maxWidth: "200px",
            minWidth: "50px",
            color: "black",
            background: prop.color,
            padding: "5px",
            borderRadius: "2px"
        }}>
            {prop.children}
            {timeplacement}
        </div>
    )
}

function DeleteMessageBtn(prop) {
    function DeleteMessage() {
        console.log('deleting')
        socket.emit("delete Message", {
            messageId: prop.messageId,
            token: sessionStorage.getItem("Idtoken"),
            other_account: prop.textingId
        })
    }


    return (
        <Popover title={"Delete message?"}>
            <DeleteOutlined
                style={{ fontSize: "10px" }}
                onClick={DeleteMessage}
            />
        </Popover>
    )
}

function OtherUserText(prop) {
    const user = prop.data
    return (
        <div style={{
            display: "flex",
            justifyContent: "end",
            marginTop: "4px"
        }}>
            <Space align="end">
                <Text
                    color="#d9d9d9"
                    time={user.date}
                >
                    {user.text}
                </Text>
                <Avatar size={32}
                    icon={<UserOutlined />}
                    src={require(`../../accountImages/${user.profile}`)}

                />
            </Space>
        </div>
    )
}

export function TextingModal(prop) {
    const [text, setText] = useState([]);
    const [value, setValue] = useState('');
    const token = sessionStorage.getItem("Idtoken")
    const dummy = useRef()

    socket.on("Recieve Message", data => {
        makeMessage(data)
    })

    function makeMessage(data) {
        const chat = []
        let previousTimeStamp;
        let currentTimeStamp
        data.map((text, index) => {
            if (previousTimeStamp === undefined) {
                previousTimeStamp = text.date.split(" ")[0];
                chat.push(<TimeStamp
                    key={chat.length + 1}
                    date={previousTimeStamp}
                />)
            }
            //if there is no previous time stamp
            currentTimeStamp = text.date.split(" ")[0];

            if (previousTimeStamp !== currentTimeStamp) {
                chat.push(<TimeStamp
                    key={chat.length + 1}
                    date={currentTimeStamp} />)
            }

            if (text.Host === prop.user.name) {
                chat.push(<OtherUserText
                    key={chat.length + 1}
                    data={text}

                />)
            }
            else {
                chat.push(<HostText
                    key={chat.length + 1}
                    data={text} />)
            }
            previousTimeStamp = currentTimeStamp;
        })
        setText(chat)
    }//making the message base on the new message data

    useEffect(() => {
        console.log(socket.id)
        socket.emit("connect user", { socketId: socket.id, token: token })
        fetch(`http://127.0.0.1:5000/Text/getText/${prop.user.id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                makeMessage(data)
            })
    }, [])//add some depency to change it

    useEffect(() => {
        dummy.current.scrollIntoView({ behavior: 'smooth' });
    }, [text])

    function submitMessage(Message) {
        socket.emit('send Message', {
            Message: Message,
            token: token,
            other_account: prop.user.id
        });
    }

    function submitText(key) {
        if (key.key === "Enter") {
            submitMessage(value)
            setValue('')
        }
    }

    return (
        <Modal
            open={prop.open}
            onCancel={() => {
                socket.emit("disconnect user", socket.id)
                prop.textingModal(false)
            }}
            footer={[]}
            style={{ top: "50px" }}
        >
            <Card
                style={{
                    height: "450px",
                    marginTop: "20px",
                }}
                bodyStyle={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    overflow: "visible",
                }}
            >
                <Divider>{prop.user.name}</Divider>
                <Space
                    direction="vertical"
                    size="middle"
                    style={{
                        display: 'flex',
                        overflowY: "scroll",
                        padding: "5px",
                        marginBottom: "5px",
                        height: "350px",
                    }}>
                    {text}
                    <div ref={dummy}></div>
                </Space>

                <Input
                    onKeyDown={submitText}
                    value={value}
                    onChange={(value) => { setValue(value.target.value) }}
                    placeholder={`Message ${prop.user.name}`}
                />
            </Card>
        </Modal>
    )
}


function TimeStamp(prop) {
    return (
        <div style={{
            display: "flex",
            justifyContent: "center"
        }}>
            <Tag>{prop.date}</Tag>
        </div>
    )
}