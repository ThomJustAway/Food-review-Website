import React, { useEffect } from "react";
import { Tabs, Breadcrumb, Descriptions, Image, Layout, Row, Col } from "antd"
import { Header } from "antd/es/layout/layout";
import HeaderCss from "./header.module.css"
import { Link } from "react-router-dom";
import { useState } from "react";


export default function HeaderRemix(prop) {
    const [I, setI] = useState("empty.png");


    useEffect(() => {
        if (prop.picture != "") {
            setI(prop.picture)
        }
        const image = document.querySelector(`.${HeaderCss.Image}`);
        const cover = document.querySelector(`.${HeaderCss.Cover}`)
        document.addEventListener("scroll", () => {
            let scrollPosition = window.scrollY;
            let newWidth = 100 - scrollPosition / 10; // Decrease the width by 10 pixels for every 100 pixels of scroll
            let newHeight = 500 - scrollPosition / 10; // Decrease the height by 10 pixels for every 100 pixels of scroll
            let newOpactiy = 0.1 + scrollPosition / 1000

            image.style.width = newWidth + '%';
            image.style.height = newHeight + 'px';
            cover.style.opacity = newOpactiy
        })
    })

    return (
        <>
            <Breadcrumb separator={<span style={{ color: 'white' }}>/</span>}
                style={{
                    color: "white",
                    marginLeft: "30px",
                    marginTop: "10px"
                }}>
                <Breadcrumb.Item style={{ color: "white" }} ><Link to={"/"} style={{ color: "white" }}>Home</Link></Breadcrumb.Item>
                <Breadcrumb.Item style={{ color: "white" }} ><Link to={"/restaurant"} style={{ color: "white" }}>Restaurant</Link></Breadcrumb.Item>
                <Breadcrumb.Item>Ice Lab Cafe</Breadcrumb.Item>
            </Breadcrumb>
            <div className={HeaderCss.container}>
                <img src={require(`../restaurantImages/${I}`)} className={HeaderCss.Image} />
                <div className={HeaderCss.Cover}></div>
            </div>
        </>
    )
}//add the image link to the properties
//this is hardcoded
//add the link to the breadcrumb using the react router link