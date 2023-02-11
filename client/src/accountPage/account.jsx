import React, { useState } from "react";
import { Typography, Button, Checkbox, Form, Input, Row, Col, Card, Divider, Steps, Modal, message } from "antd";
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Footer } from "../footer/footer";
import { useEffect } from "react";
import { Component } from "react";
import { LoginAccountPage } from "./loginAccount";
import { GoogleLogin } from "../google login/login";
const { Text } = Typography;
let setAccountGlobal;

export function loggin(token, setAccount) {

    fetch("http://127.0.0.1:5000/Account",
        {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': "application/json"
            }
        }).then(res => res.json())
        .then(data => setAccount(data));
}

function ForgetPassword(prop) {
    const [form] = Form.useForm();

    function finish(data) {
        console.log(data);
        message.loading("The email is being send")
        fetch(`http://127.0.0.1:5000/sendForgetPassword/${data.email}`)
            .then(
                res => res.json()
            )
            .then(data => {
                if (data.result === "successful") {
                    message.destroy();
                    message.success("Email send!")
                    prop.setOpen(false)
                }
                else {
                    message.destroy()
                    message.error("Invalid email")
                }

            })
    }

    return (
        <Modal
            open={prop.open}
            onCancel={() => { prop.setOpen(false) }}
            footer={[]}
        >
            <Divider>Forget Password</Divider>
            <Form
                onFinish={finish}
                form={form}
            >
                <div style={{ marginBottom: "10px" }}>
                    Please pass in your email and we will send you the link to reset your password.
                </div>
                <Form.Item
                    name='email'
                    label="Email"
                >
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button htmlType="submit" type="primary">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    )
}

function Signin(prop) {
    const [messageApi, contextHolder] = message.useMessage();
    const [forgetPassword, setForgetPassword] = useState(false)
    const onFinish = (values) => {
        fetch("http://127.0.0.1:7000/login",
            {
                method: "POST",
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({
                    email: values.Email,
                    password: values.password,
                })
            })
            .then(res => res.json())
            .then(data => {
                if (data.result == "Invalid") {
                    messageApi.open({
                        type: "error",
                        content: "Your password is invalid!"
                    })
                }
                else {
                    prop.globalMessage.open({
                        type: "success",
                        content: "Log in Successful"
                    })
                    sessionStorage.setItem("refreshToken", data.refreshToken)
                    sessionStorage.setItem("Idtoken", data.result);

                    loggin(data.result, prop.setAccount);

                }
            }).catch(error => {
                messageApi.open({
                    type: "error",
                    content: "User does not exist!"
                })
            })
    };

    return (
        <Card style={{ marginTop: "100px" }}>
            {contextHolder}
            <Divider>Log In</Divider>
            <Form
                name="normal_login"
                className="login-form"
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
            >
                <Form.Item
                    name="Email"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Email!',
                        },
                    ]}
                >
                    <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Email" />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Password!',
                        },
                    ]}
                >
                    <Input
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="Password"
                    />
                </Form.Item>
                <Form.Item>
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>
                    <Button
                        type="link"
                        onClick={() => setForgetPassword(true)}
                    >
                        Forgot password
                    </Button>

                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        Log in
                    </Button>
                    <span> Or </span>
                    <RegisterAccount />
                </Form.Item>
            </Form>
            <GoogleLogin setAccount={prop.setAccount} />
            <ForgetPassword
                open={forgetPassword}
                setOpen={setForgetPassword}
            />
        </Card>
    )
}

function First_content(prop) {
    const [emails, setEmails] = useState([])
    const onFinish = (values) => {
        prop.setUserData(values)
        prop.nextPage()
    };

    useEffect(() => {
        fetch("http://127.0.0.1:5000/Account/get/allEmail")
            .then(res => res.json())
            .then(data => {
                let listOfEmail = data.map(email => email.email);
                setEmails(listOfEmail)
            })
    }, [])


    return (
        <Card style={{ marginTop: "20px", marginBottom: "20px" }}>
            <Divider>Register</Divider>
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
                                if (!value || !emails.includes(value)) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('This email has been used!'));
                            },
                        })
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password!',
                        },
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
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    name="confirm"
                    label="Confirm Password"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: 'Please confirm your password!',
                        },
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
                    <Input.Password />
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
                >
                    <Input />
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
                    >
                        <Input placeholder="Input First Name" />
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
                    >
                        <Input placeholder="Input Last Name" />
                    </Form.Item>
                </Form.Item>
                <Form.Item >
                    <Button type="primary" htmlType="submit">
                        Next
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    )
}


function TypeButton(prop) {
    const [messageApi, contextHolder] = message.useMessage();
    const [selected, toggleSelected] = useState(prop.selectedType.includes(prop.id));
    const unSelect = () => {
        toggleSelected(false)
        let newType = prop.selectedType.filter((item) => item != prop.id);
        prop.setSelectedType(newType)
    }

    const Select = () => {

        if (prop.selectedType.length == 3) {
            messageApi.open({
                type: "warning",
                content: "You cant add more than 3!"
            });
        }
        else {
            messageApi.open({
                type: "success",
                content: "You have added a type!"
            });
            toggleSelected(true)

            let newType = prop.selectedType.concat([prop.id])
            prop.setSelectedType(newType)
        }
    }


    return (
        <>
            {contextHolder}
            {
                selected ?
                    <Button style={{ marginLeft: "10px", marginBottom: "10px" }}
                        type="primary"
                        onClick={unSelect}>
                        {prop.type}
                    </Button> :

                    <Button style={{ marginLeft: "10px", marginBottom: "10px" }}
                        type="dashed"
                        onClick={Select}>
                        {prop.type}
                    </Button>
            }
        </>
    )
}

function Second_content(prop) {
    const [messageApi, contextHolder] = message.useMessage();
    const [selectedType, setSelectedType] = useState([]);
    const [options, setOptions] = useState([])
    const [originalUser, _] = useState(prop.user)

    useEffect(() => {
        fetch("http://127.0.0.1:5000/Restaurant/getType/A")
            .then(res => res.json())
            .then(data => {
                let listOfTypeButton = data.map((type) => {
                    return <TypeButton type={type.type}
                        key={type.id_type}
                        id={type.id_type}
                        selectedType={selectedType}
                        setSelectedType={setSelectedType}
                    />
                })
                setOptions(listOfTypeButton);
            }
            )
        let newObject = { ...originalUser, selectedType };
        prop.updateUserData(newObject)

    }, [selectedType])

    function next() {
        if (selectedType.length < 3) {
            messageApi.open({
                type: "warning",
                content: "Please select 3 types!"
            })
        }
        else {
            prop.nextPage()
        }
    }


    return (
        <Card style={{ marginTop: "20px", marginBottom: "20px" }}>
            {contextHolder}
            <Divider>Choose your favourite type! (Choose 3)</Divider>
            {options}
            <div style={{ marginTop: "40px" }}>
                <Button
                    onClick={prop.prevPage}
                >
                    previous
                </Button>

                <Button
                    style={{ margin: '0 8px', }}
                    onClick={next}
                    type="primary"
                >
                    Next
                </Button>
            </div>
        </Card>
    )
}

function Third_content(prop) {
    const [pin, newPin] = useState(generateRandomNumber())
    const [messageApi, contextHolder] = message.useMessage();

    function generateRandomNumber() {
        var minm = 100000;
        var maxm = 999999;
        return Math.floor(Math
            .random() * (maxm - minm + 1)) + minm;
    }

    useEffect(() => {
        messageApi.open({
            type: "loading",
            content: "Sending Email!",
            duration: "0"
        })

        fetch(`http://127.0.0.1:5000/sendVerification/${prop.userInfo.email}/${pin}`)
            .then(data => {
                messageApi.destroy();
                messageApi.open({
                    type: "success",
                    content: "Email Send!"
                })
            }).catch(error => {
                messageApi.destroy();
                messageApi.open({
                    type: "error",
                    content: "Email has not been send!"
                })
            })
    })

    function finish(result) {
        const userData = prop.userInfo
        console.log(result.Pin)
        if (result.Pin == pin) {
            messageApi.open({
                type: "success",
                content: "Account created successfully"
            })

            fetch('http://127.0.0.1:5000/Account/create', {
                method: "POST",
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({
                    username: userData.nickname,
                    email: userData.email,
                    password: userData.password,
                    first_name: userData.firstName,
                    last_name: userData.lastName,
                    profile: "default.png",
                    like_type1: userData.selectedType[0],
                    like_type2: userData.selectedType[1] == undefined ? null : userData.selectedType[1],
                    like_type3: userData.selectedType[2] == undefined ? null : userData.selectedType[2],
                })
            }).then(
                () => {
                    fetch('http://127.0.0.1:7000/login', {
                        method: "POST",
                        headers: {
                            'Content-Type': "application/json"
                        },
                        body: JSON.stringify({
                            "email": userData.email,
                            "password": userData.password
                        })
                    }).then(res => res.json())
                        .then(
                            data => {
                                sessionStorage.setItem("Idtoken", data.result)
                                sessionStorage.setItem("refreshToken", data.refreshToken)
                                loggin(data.result, setAccountGlobal);
                                prop.closeTab()
                            }
                        )
                }
            )
                .catch(error => {
                    messageApi.open({
                        type: "error",
                        content: "There has been an error with the server!"
                    })
                    console.log(error)
                })



        }
    }

    return (
        <Card>
            {contextHolder}
            <Divider>Verify your Email</Divider>
            <Text>Please check your email for the pin number.</Text>
            <Form
                onFinish={finish}
            >
                <Form.Item
                    name="Pin"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your Pin',
                        },
                    ]}>
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button htmlType="submit" type="primary">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    )
}

function RegisterSteps(prop) {
    const [userData, setUserData] = useState([])
    console.log(userData)
    const next = () => {
        setCurrent(current + 1);
    };
    const prev = () => {
        setCurrent(current - 1);
    };
    const steps = [
        {
            title: 'User Information',
            content: <First_content
                setUserData={setUserData}
                nextPage={next} />,
        },
        {
            title: 'Favourite Type',
            content: <Second_content
                updateUserData={setUserData}
                user={userData}
                nextPage={next}
                prevPage={prev} />,
        },
        {
            title: 'Verification',
            content: <Third_content
                userInfo={userData}
                closeTab={prop.closingTab}
            />,
        },
    ];
    const [current, setCurrent] = useState(0);
    const items = steps.map((item) => ({
        key: item.title,
        title: item.title,
    }));
    return (
        <>
            <Steps current={current} items={items} />
            <div className="steps-content">{steps[current].content}</div>
        </>
    )
}

function RegisterAccount() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = (e) => {
        e.preventDefault()
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    return (
        <>
            <a href="" onClick={showModal}>register now!</a>
            <Modal title="Register"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={null}>
                <RegisterSteps
                    closingTab={handleCancel}
                    tabOpen={isModalOpen} />
            </Modal>
        </>

    )
}

export function AccountPage(prop) {
    const [messageApi, contextHolder] = message.useMessage();
    const [account, setAccount] = useState([])
    setAccountGlobal = setAccount;
    let page;
    if (sessionStorage.getItem("Idtoken") == null) {

        page = (<Row>
            <Col offset={8} span={8}>
                <Signin globalMessage={messageApi} setAccount={setAccount} />
            </Col>

        </Row>)
    }
    else {
        page = (<LoginAccountPage setAccount={setAccount} />)
    }
    return (
        <>
            {contextHolder}
            {page}
        </>
    )
}

