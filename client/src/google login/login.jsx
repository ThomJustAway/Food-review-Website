import React, { useEffect } from "react";
import { Button, message } from "antd"
import jwt_decode from 'jwt-decode'
import { loggin } from "../accountPage/account";


export function GoogleLogin(prop) {

    function handleSignIn(res) {
        console.log(res.credential)
        var userObject = jwt_decode(res.credential);
        fetch('http://127.0.0.1:7000/login', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: userObject.email,
                email_verfied: userObject.email_verified
            })
        }).then(res => res.json())
            .then(data => {
                sessionStorage.setItem("Idtoken", data.result)
                sessionStorage.setItem("refreshToken", data.refreshToken)
                loggin(data.result, prop.setAccount)
            })
            .catch(() => {
                message.error("There is no account that exist with that email!")
            })
    }

    useEffect(() => {
        /* global google */
        const googleLogin = google.accounts.id
        googleLogin.initialize({
            client_id: "372509600391-d4km3tcdhjt4qf7e8c3jfvpo694hdlfh.apps.googleusercontent.com",
            callback: handleSignIn
        }
        )

        googleLogin.renderButton(
            document.getElementById("signInDiv"),
            {
                theme: "outline",
                size: "large",
                width: "100%",
                logo_alignment: "centre"
            }
        )

    }, [])


    return (
        <div style={{ marginTop: "20px" }}>
            <div id="signInDiv">
            </div>
        </div>
    )
}