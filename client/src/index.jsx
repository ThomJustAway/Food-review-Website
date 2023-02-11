import React, { useEffect } from 'react';
import ReactDOM from "react-dom/client";
import { PreviewAccount } from './accountPage/accountPreview';
import { BrowserRouter, Link, Route, Routes, useLocation } from "react-router-dom"
import "swiper/css/bundle";


//pages
import { Logo, Header, NavMenu } from "./mainMenu/Header"
import { Body } from './body/Body'
import { RestaurantPage } from './restaurantPage/restaurant';
import { Result, Button, ConfigProvider, message } from 'antd';
import { RestaurantInfoPage } from "./restaurantInformationPage/restaurantInfoPage"
import { AccountPage } from './accountPage/account';
import "./global.css"
import { ForgetPasswordPage } from './accountPage/forgetPassword';

const root = ReactDOM.createRoot(document.getElementById("root"));



function NotFound() {
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#00b96b',
                    colorTextBase: "#ffffff"
                },
            }}
        >
            <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={
                    <Link to="/">
                        <Button type="primary">Back Home</Button>
                    </Link>
                }
            />
        </ConfigProvider>
    )
}

function App() {
    function refreshAccessToken() {
        const refreshToken = sessionStorage.getItem("refreshToken");
        if (refreshToken == null) {
            console.log("The user is not log in")
            return
        }//if no refresh token means the user is not login
        fetch('http://127.0.0.1:7000/refresh/access/token', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken: refreshToken })
        }).then(res => {
            if (res.status !== 200) {
                message.error("It seems that you are not login. Please login")
            }
            else {
                return res.json();
            }
        })
            .then(data => {
                sessionStorage.setItem("Idtoken", data.accessToken)
            })

    } // refresh token

    setInterval(refreshAccessToken, 10 * 1000);//add this

    return (
        <>
            <Routes>
                <Route path='/' element={<Logo />} />
            </Routes>
            <Header />
            <NavMenu />
            <Routes>
                <Route path='/' element={<Body />} />
                <Route path='/restaurant' element={<RestaurantPage />} />
                <Route path='/restaurant/:id' element={<RestaurantInfoPage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="/accountPreview/:id" element={<PreviewAccount />} />
                <Route path="/forgetPassword/:Token" element={<ForgetPasswordPage />} />
                <Route path='*' element={<NotFound />} />
            </Routes>
        </>
    )
}



root.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>);