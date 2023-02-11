import React, { Component, useEffect, useState } from "react";
import HeaderCss from './Header.module.css'
import searchCss from './search.module.css'

import sunImg from '../images/sun.images.png'
import RestaurantLogo from "../images/restaurant.img.png"
import AccountLogo from "../images/Account.img.png"
import navLogo from "../images/navLogo.png"
import LogoImg from "../images/Logo.img.png"
import search from "../images/search.png"
import { Link } from "react-router-dom";

// import cx from 'classnames'

class Hamburger extends Component {
    constructor(props) {
        super(props);
        this.state = { isToggleOn: false };
        this.onclick = this.onClick.bind(this)
    }

    onClick() {
        this.setState(state => ({
            isToggleOn: !state.isToggleOn
        }))
        const hamburger = document.querySelector(`.${HeaderCss.hamburger}`)

        hamburger.classList.toggle(HeaderCss.isactive)
        const Logo = document.querySelector(`.${HeaderCss.Logo}`)
        Logo.classList.toggle(HeaderCss.hide)
        //showing the menu
        const navMenu = document.querySelector(`.${HeaderCss.navMenu}`)
        navMenu.classList.toggle(HeaderCss.isactive);
    }
    // ${this.state.isToggleOn ? "is-active" : ""}
    render() {
        return (
            <button className={HeaderCss.hamburger} onClick={this.onclick}>
                <div className={HeaderCss.bar}></div>
            </button>
        )
    }
}

export function NavMenu() {
    return (<nav className={HeaderCss.navMenu}>
        <a href="Restaurant">Restaurant</a>
        <a href="account">Account</a>
    </nav>)
}

function Result(props) {
    if (props.type == "restaurant") {
        return (
            <div className={searchCss.resultContainer} onClick={() => { console.log("hello") }}>
                <img src={require(`../restaurantImages/${props.image}`)} alt="" className={searchCss.image} />
                <div className={searchCss.information_container}>
                    <div className={searchCss.name}>{props.name}</div>
                    <div>{props.type}</div>
                </div>
            </div>
        )
    }
    else {
        return (
            <div className={searchCss.resultContainer} onClick={() => { console.log("hello") }}>
                <img src={require(`../accountImages/${props.image}`)} alt="" className={searchCss.image} />
                <div className={searchCss.information_container}>
                    <div className={searchCss.name}>{props.name}</div>
                    <div>{props.type}</div>
                </div>
            </div>
        )
    }

}

function Empty() {
    return (
        <div className={searchCss.empty}>
            There is no search result
        </div>
    )
}

export function Search() {
    const [listResult, setResult] = useState([<Empty key={"none"} />])

    function giveResult(target) {
        console.log(typeof (target.target.value))
        let value = target.target.value
        if (value === "") {
            value = "^[A-Za-z0-9]"
        }
        let searchAPI = `http://127.0.0.1:5000/main/search/${value}`
        fetch(searchAPI)
            .then(res => res.json())
            .then(data => {
                if (data.length == 0) {
                    setResult(<Empty key={"none"} />)
                    //if no result is found
                }
                else {
                    setResult(
                        data.map((value) =>
                            <Result name={value.name.charAt(0).toUpperCase() + value.name.slice(1)}
                                type={value.type}
                                key={`${value.type.charAt(0)}${value.id}`}
                                image={value.image} />
                        ))
                    //putting the values inside listResult
                }

                console.log(listResult)

            })
        // fetch the api
    }

    useEffect(() => {
        let searchBar = document.querySelector(`.${HeaderCss.searchBody} input`)
        let searchMenu = document.getElementById(searchCss.SearchResult)

        searchBar.addEventListener("focus", () => {
            searchMenu.style.display = "grid";
        })


        searchBar.addEventListener("blur", () => {
            setTimeout(() => {
                searchMenu.style.display = "none";
            }, 130)
        })
    }, [])
    return (
        <div className={searchCss.container}>
            <div className={HeaderCss.searchBody} >
                <img src={search} alt='' className={HeaderCss.search} />
                <input type={"text"}
                    placeholder={"Search"}
                    onChange={giveResult}
                />
            </div>
            <div id={searchCss.SearchResult}>
                {listResult}
            </div>
        </div>
    )
}

function HyperLink(prop) {
    return (
        <Link to={prop.link} style={{ textDecoration: "none", color: "black" }}>{prop.title}</Link>
    )
}

export function Header() {
    return (
        <div className={HeaderCss.NavBar}>
            <div>
                <img src={navLogo} alt="" className={HeaderCss.navLogo} />
                <HyperLink link="/" title="Sweet Fantasy" />
                <img src={sunImg} alt="" className={HeaderCss.lightMode} />
            </div>
            <Search />
            <div className={HeaderCss.Nav}>
                <div>
                    <img src={RestaurantLogo} className={HeaderCss.restLogo} alt='' />
                    <div ></div>
                    <HyperLink link="/restaurant" title="Restaurant" />

                </div>
                <div>
                    <img src={AccountLogo} alt='' className={HeaderCss.accountlogo} />
                    <HyperLink link="/account" title="Account" />
                    <div ></div>
                </div>
                <Hamburger />
            </div>

        </div>
    )
}

export function Logo() {
    return (
        <div className={HeaderCss.Logo}>
            <img src={LogoImg} alt='' />
            <p className={HeaderCss.Title}><span>Sweet</span> Fantasty</p>
            <p className={HeaderCss.subtitle}>A world of sweets</p>
        </div>
    )
}
