import { Card, Col, Divider, Form, Input, Row, Button, Result } from "antd";
import React, { useState } from "react";
import { Link } from "react-router-dom";

function ChangePasswordCard() {
    const [successful, setSuccess] = useState(false)

    function changePassword(data) {
        const url = window.location.href;
        const token = url.split('/').pop()
        fetch("http://127.0.0.1:5000/Account/reset/Password", {
            method: "PUT",
            body: JSON.stringify(data),
            headers: {
                'Authorization': `resulter ${token}`,
                'Content-Type': "application/json"
            }
        }).then(() => {
            setSuccess(true)
        })
    }
    if (!successful) {
        return (
            <Card >
                <Divider>Change Password</Divider>
                <div style={{ marginBottom: "10px" }}>Give a strong password for you to remember in the Future!</div>
                <Form
                    onFinish={changePassword}
                >
                    <Form.Item
                        name='password'
                        label="Password"
                        rules={[{
                            required: true,
                            message: 'Please input your Password!'
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || value.length >= 8) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Password is too Short!'));
                            },
                        })
                        ]}
                    >
                        <Input.Password placeholder="password" />
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
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Reset Password!
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        )
    }
    else {
        return (
            <Card>
                <Result
                    status="success"
                    title="You have successfully change your password"
                    extra={[
                        <Link to={'/account'}>
                            <Button type="primary" key="console">
                                Log in?
                            </Button>
                        </Link>,
                        <Link to={'/restaurant'}>
                            <Button type="default" key="console">
                                Check Restaurant
                            </Button>
                        </Link>
                    ]}
                />
            </Card>
        )
    }

}

export function ForgetPasswordPage() {
    return (
        <Row style={{
            marginTop: "50px"
        }}>
            <Col offset={8} span={8}>
                <ChangePasswordCard />
            </Col>
        </Row>
    )
}