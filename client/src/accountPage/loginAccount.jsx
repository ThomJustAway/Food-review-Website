import React, { useState, useEffect, useLayoutEffect } from "react";
import { Upload, Select, Tag, Row, Col, Card, Avatar, Popover, Modal, Form, Button, Input, Divider, Switch, message } from "antd";
import { ExclamationCircleOutlined, CommentOutlined, ImportOutlined, EditOutlined, UploadOutlined } from "@ant-design/icons"
import { motion, AnimatePresence } from "framer-motion";
import { Type } from '../body/Body'
import { AddFriendBtn, FollowTab } from "./loginAccount/tabs/FollowerTabs";
import { FavouriteRestaurantCard } from "./loginAccount/FavouriteRestaurantCard";
import Password from "antd/es/input/Password";
import { TextingModal } from "./loginAccount/texting";
const { Meta } = Card;


function Editmodal(prop) {
    const account = prop.account;
    const [emails, setEmails] = useState([]);
    const [enableEdit, setEnableEdit] = useState(false);
    const [modal, contextHolder] = Modal.useModal();

    //select type
    const [Items, setItems] = useState({
        selectedItems: [],
        options: [],
        realValues: []
    });



    useEffect(() => {
        fetch("http://127.0.0.1:5000/Account/get/allEmail")
            .then(res => res.json())
            .then(data => {
                let listOfEmail = data.map(email => email.email);
                setEmails(listOfEmail)
            })
    }, [])//getting all existing email to verify if a account is being used

    useEffect(() => {
        fetch('http://127.0.0.1:5000/Restaurant/getType/A')
            .then(res => res.json())
            .then(data => {
                let selectedItems = []
                let object = data.map(type => {
                    if (account.like_type1 === type.type ||
                        account.like_type2 === type.type ||
                        account.like_type3 === type.type
                    ) {
                        selectedItems.push({ value: type.id_type, label: type.type })
                    }
                    return { value: type.id_type, label: type.type }
                })
                setItems({
                    selectedItems: selectedItems,
                    options: object
                })
            })
    }, [])

    function onFinish(value) {
        setEnableEdit(false)
        if (value.password === undefined) {
            fetch("http://127.0.0.1:5000/Account/update", {
                method: "PUT",
                headers: {

                    'Authorization': `Bearer ${sessionStorage.getItem("Idtoken")}`,
                    'Content-Type': 'application/json',

                },
                body: JSON.stringify({
                    username: value.nickname,
                    email: value.email,
                    first_name: value.firstName,
                    last_name: value.lastName,
                    password: account.password,
                    like_type1: value.LikedTypes[0],
                    like_type2: value.LikedTypes[1],
                    like_type3: value.LikedTypes[2],
                    ignorepassword: true
                })
            }).then(
                () => {
                    message.success("You have edited your account!");
                    prop.load()
                    prop.closeModal();
                }

            )
        }
        else {
            fetch("http://127.0.0.1:5000/Account/update", {
                method: "PUT",
                headers: {

                    'Authorization': `Bearer ${sessionStorage.getItem("Idtoken")}`,
                    'Content-Type': 'application/json',

                },
                body: JSON.stringify({
                    username: value.nickname,
                    email: value.email,
                    first_name: value.firstName,
                    last_name: value.lastName,
                    password: value.password,
                    like_type1: value.LikedTypes[0],
                    like_type2: value.LikedTypes[1],
                    like_type3: value.LikedTypes[2],
                    ignorepassword: false
                })
            }).then(
                () => {
                    message.success("You have edited your account!");
                    prop.load()
                    prop.closeModal();

                })
        }


    }

    function toggleEdit() {
        setEnableEdit(!enableEdit);
    }

    function deleteAccount() {
        function deleteA() {
            fetch("http://127.0.0.1:5000/Account/delete", {
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem("Idtoken")}`,
                }
            })
                .then(() => {
                    sessionStorage.removeItem("Idtoken")
                    sessionStorage.removeItem("refreshToken")

                    prop.setAccount([])

                })
        }

        modal.confirm({
            title: 'Are you sure you want to Delete?',
            icon: <ExclamationCircleOutlined />,
            content: 'If you delete your account, You will not retrieve it back!',
            okText: 'Okay',
            cancelText: 'no',
            onOk() {
                deleteA();
            }

        });
    };



    return (
        <Modal
            open={prop.open}
            onCancel={prop.closeModal}
            footer={[]}
            width={1000}
        >
            {contextHolder}
            <Card style={{
                marginTop: "20px",
                marginBottom: "20px",
                position: "relative",

            }}>
                <Divider>Edit Account</Divider>
                <div
                    style={{
                        position: "absolute",
                        bottom: "20px",
                        right: "20px",
                        zIndex: 5
                    }}
                >Edit: <Switch onChange={toggleEdit} defaultChecked={enableEdit} /></div>
                <Row>
                    <Col span={8} >
                        <Avatar
                            src={require(`../accountImages/${account.profile}`)}
                            shape="square" size={200} />
                        <UploadBtn />
                    </Col>
                    <Col span={15} offset={1}>
                        <Form
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                        >
                            <Form.Item
                                name="email"
                                label="E-mail"
                                rules={[
                                    {
                                        type: 'email',
                                        message: 'The input is not valid E-mail!',
                                    },
                                    {
                                        required: true,
                                        message: 'Please input your E-mail!',
                                    },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || !emails.includes(value) || value === account.email) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('This email has been used!'));
                                        },
                                    })
                                ]}
                                initialValue={account.email}
                            >
                                <Input
                                    disabled={!enableEdit}
                                />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                label="Password"
                                rules={[
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || value.length >= 8) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Password is too Short!'));
                                        },
                                    }),
                                ]}
                                hasFeedback
                            >
                                <Input.Password
                                    disabled={!enableEdit}
                                />
                            </Form.Item>
                            <Form.Item
                                name="confirm"
                                label="Confirm Password"
                                dependencies={['password']}
                                hasFeedback
                                rules={[

                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('The two passwords that you entered do not match!'));
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password
                                    disabled={!enableEdit}
                                />
                            </Form.Item>
                            <Form.Item
                                name="nickname"
                                label="Nickname"
                                tooltip="What do you want others to call you?"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your nickname!',
                                        whitespace: true,
                                    },
                                ]}
                                initialValue={account.username}
                            >
                                <Input
                                    disabled={!enableEdit}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Name"
                                style={{
                                    marginBottom: 0,
                                }}
                            >
                                <Form.Item
                                    name="firstName"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                    style={{
                                        display: 'inline-block',
                                        width: 'calc(50% - 8px)',
                                    }}
                                    initialValue={account.first_name}
                                >
                                    <Input
                                        disabled={!enableEdit}
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="lastName"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                    style={{
                                        display: 'inline-block',
                                        width: 'calc(50% - 8px)',
                                        margin: '0 8px',
                                    }}
                                    initialValue={account.last_name}
                                >
                                    <Input
                                        disabled={!enableEdit}
                                    />
                                </Form.Item>
                            </Form.Item>
                            <Form.Item
                                name="LikedTypes"
                                label="LikedTypes"
                                rules={[
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (value.length === 3) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Please include three types!'));
                                        },
                                    }),
                                ]}
                                initialValue={Items.selectedItems.map(index => index.value)}
                            >
                                <Select
                                    disabled={!enableEdit}
                                    mode="multiple"
                                    placeholder="Choose your Favourite Type!"
                                    style={{
                                        width: '100%',
                                    }}

                                    options={Items.options}
                                    listHeight={100}
                                />
                            </Form.Item>
                            <Form.Item >
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    disabled={!enableEdit}
                                >
                                    Confirm?
                                </Button>
                                <Button
                                    type="primary"
                                    danger
                                    disabled={!enableEdit}
                                    style={{
                                        marginLeft: "20px"
                                    }}
                                    onClick={deleteAccount}
                                >
                                    Delete Account
                                </Button>
                            </Form.Item>
                        </Form>
                    </Col>

                </Row>
            </Card>
        </Modal>
    )
}

function UploadBtn() {
    const [messageApi, contextHolder] = message.useMessage();

    function HandleFile(info) {
        messageApi.destroy()
        if (info.file.status === 'uploading') {
            messageApi.open({
                type: "loading",
                content: "Your image is being loaded!"
            })
            return;
        }
        if (info.file.status === 'done') {
            messageApi.open({
                type: "success",
                content: "Your image is loaded!"
            })
            // Get this url from response in real world.
        }
        else if (info.file.status === 'error') {
            messageApi.open({
                type: "error",
                content: "Your image failed to load!"
            })
        }
    }
    const beforeUpload = (file) => {

        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    return (
        <Upload
            name="image"
            action={"http://localhost:5000/Account/updateProfile"}
            method="PUT"
            beforeUpload={beforeUpload}
            onChange={HandleFile}
            formProps={{
                enctype: "multipart/form-data"
            }}
            headers={{
                authorization: `Bearer ${sessionStorage.getItem("Idtoken")}`
            }}

        >
            {contextHolder}
            <Button
                style={{
                    marginBottom: "20px",
                    marginTop: "20px",
                    marginLeft: "25px"
                }}
                icon={<UploadOutlined />}
                name="image"
            >
                Upload Images
            </Button>
        </Upload>
    )
}//change this to accept picture cross over

function Profile(prop) {
    const [open, setOpen] = useState(false)
    const [modal, contextHolder] = Modal.useModal();
    if (prop.account[0] === undefined || prop.account[0] === null) return null
    const account = prop.account[0]
    const image = require(`../accountImages/${account.profile}`)
    const accountFollowing = JSON.parse(account.Following)
    const accountFollower = JSON.parse(account.Follower)

    let date = account.date.split(' ')

    function EditAccount() {
        setOpen(true)
    }

    function closeModal() {
        setOpen(false)
    }

    function ExitAccount() {
        function exit() {
            sessionStorage.removeItem("Idtoken")
            sessionStorage.removeItem("refreshToken")

            prop.setAccount([])
        }

        modal.confirm({
            title: 'Confirm',
            icon: <ExclamationCircleOutlined />,
            content: 'Are you sure you want to exit?',
            okText: 'yes',
            cancelText: 'no',
            onOk: exit
        });

    }

    return (

        <motion.div
            style={{ marginTop: "20px" }}
            initial={{ x: -1000 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
        >
            {contextHolder}
            <Card
                style={{
                    marginTop: "20px",
                    position: "relative"
                }}
                loading={prop.loading}
                actions={[
                    <Popover title="Log Out">
                        <ImportOutlined key="exit" onClick={ExitAccount} />
                    </Popover>,
                    <Popover title="Edit Account">
                        <EditOutlined key="edit" onClick={EditAccount} />
                    </Popover>
                ]}
            >
                <Editmodal
                    open={open}
                    closeModal={closeModal}
                    account={account}
                    load={prop.load}
                    setAccount={prop.setAccount}
                />
                <span style={{
                    position: "absolute",
                    top: "23px",
                    right: "20px",
                    color: "#bfbfbf"
                }}>
                    {`${date[2]} ${date[1]} ${date[3]}`}
                </span>
                <Meta
                    avatar={<Avatar src={image} shape="square" size={100} />}
                    title={account.username}
                    description={<Row >
                        <Col span={6}>Followering: {accountFollowing === null ? 0 : accountFollowing.length}</Col>
                        <Col span={15} offset={2}>Follower: {accountFollower === null ? 0 : accountFollower.length}</Col>
                        <Col></Col>

                    </Row>}
                />
                <div style={{ marginTop: "20px" }}>
                    <p style={{ display: "inline" }}>Like Type: </p>
                    <Tag>{account.like_type1}</Tag>
                    <Tag>{account.like_type2}</Tag>
                    <Tag>{account.like_type3}</Tag>
                </div>


            </Card>
        </motion.div>)
}

export function PreviewProfile(prop) {
    const [animateFinsh, setAnimateFinish] = useState(true)
    const [texting, SetTexting] = useState(false)
    useEffect(() => {
        if (prop.account.length !== 0) {
            setAnimateFinish(false)
        }
    }, [prop.account])

    if (prop.account[0] === undefined || prop.account[0] === null) return null

    const account = prop.account[0]
    const image = require(`../accountImages/${account.profile}`)
    const accountFollowing = JSON.parse(account.Following)
    const accountFollower = JSON.parse(account.Follower)

    let date = account.date.split(' ')

    function giveAction() {
        if (sessionStorage.getItem("Idtoken") === null) return []
        else {
            let following;
            accountFollower?.forEach((follower) => {
                if (follower.followerAccountId === parseInt(prop.userId)) {
                    following = true;
                }
            });
            if (following === undefined) {
                following = false;
            }
            return (
                [
                    <Popover title="Text">
                        <CommentOutlined
                            key="Text"
                            onClick={() => SetTexting(true)}

                        />
                    </Popover>,
                    <Popover title="addFriend">
                        <AddFriendBtn
                            user={{
                                id: account.id_account,
                                username: account.username
                            }}
                            following={following}
                        />
                    </Popover>
                ]
            )
        }
    }

    const action = giveAction()

    return (
        <AnimatePresence onExitComplete={() => { setAnimateFinish(true) }}>
            {
                animateFinsh && (
                    <motion.div
                        style={{ marginTop: "20px" }}
                        initial={{ x: -1000 }}
                        animate={{ x: 0 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                        exit={{
                            x: -1000,
                            transition: { duration: 0.3 }
                        }}
                    >
                        <Card
                            style={{
                                marginTop: "20px",
                                position: "relative"
                            }}
                            loading={prop.loading}
                            actions={action}
                        >

                            <span style={{
                                position: "absolute",
                                top: "23px",
                                right: "20px",
                                color: "#bfbfbf"
                            }}>
                                {`${date[2]} ${date[1]} ${date[3]}`}
                            </span>
                            <Meta
                                avatar={<Avatar src={image} shape="square" size={100} />}
                                title={account.username}
                                description={<Row >
                                    <Col span={6}>Followering: {accountFollowing === null ? 0 : accountFollowing.length}</Col>
                                    <Col span={15} offset={2}>Follower: {accountFollower === null ? 0 : accountFollower.length}</Col>
                                    <Col></Col>

                                </Row>}
                            />
                            <div style={{ marginTop: "20px" }}>
                                <p style={{ display: "inline" }}>Like Type: </p>
                                <Tag>{account.like_type1}</Tag>
                                <Tag>{account.like_type2}</Tag>
                                <Tag>{account.like_type3}</Tag>
                            </div>


                        </Card>
                        {texting && <TextingModal
                            open={texting}
                            textingModal={SetTexting}
                            user={{
                                id: account.id_account,
                                name: account.username
                            }}
                        />}
                    </motion.div>
                )
            }
        </AnimatePresence>
    )
}

export function LoginAccountPage(prop) {
    const [account, setAccount] = useState([])
    const [loading, setLoading] = useState(true)
    const token = sessionStorage.getItem("Idtoken")

    function load() {
        fetch("http://127.0.0.1:5000/Account", {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => res.json())
            .then(
                data => {
                    setAccount(data)
                    setLoading(false)
                }

            )
    }

    useEffect(() => {
        load()
    }, [])

    return (
        <Row >
            <Col span={11} offset={1}>
                <Row>
                    <Col span={24}>
                        <Profile
                            loading={loading}
                            account={account}
                            load={load}
                            setAccount={prop.setAccount}
                        />
                    </Col>
                    <Col span={24}>
                        <FollowTab
                            load={load}
                            account={account} />
                    </Col>
                </Row>

            </Col>
            <Col span={11} offset={1}>
                <FavouriteRestaurantCard />
            </Col>
        </Row>
    )
}