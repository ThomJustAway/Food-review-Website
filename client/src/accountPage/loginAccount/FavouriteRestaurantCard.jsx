import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Card, Button, Col, Row, message, Empty } from "antd";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import Meta from "antd/es/card/Meta";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import { Navigation } from "swiper";


function LikeRestaurantGrid(prop) {
    console.log(prop.restaurants)
    return (
        <>
            <Row gutter={[0, 24]}
                style={{
                    paddingLeft: "50px",
                    paddingRight: "50px",
                    paddingBottom: "20px",
                    paddingTop: "20px"
                }}
                justify=""
            >
                <Col span={11} >
                    {prop.restaurants[0]}
                </Col>
                <Col span={11} offset={2}>
                    {prop.restaurants[1]}
                </Col>
                <Col span={11} >
                    {prop.restaurants[2]}
                </Col>
                <Col span={11} offset={2}>
                    {prop.restaurants[3]}
                </Col>
            </Row>
        </>
    )
}

function LikeRestaurantCard(prop) {
    const [messageApi, contextHolder] = message.useMessage();
    const [liked, setLiked] = useState(true)

    function toggleLiked(e) {
        e.stopPropagation()
        if (liked) {
            fetch(`http://127.0.0.1:5000/Restaurant/removeLike_restaurant/${prop.restaurant.id_restaurant}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem("Idtoken")}`,
                    }
                }).catch(() => {
                    messageApi.open({
                        type: "error",
                        content: "Something Went Wrong"
                    })
                })
                .then(() => {
                    messageApi.open({
                        type: "success",
                        content: "Successfully removed!"
                    })
                    setLiked(!liked)
                })
        }

        else {
            fetch(`http://127.0.0.1:5000/Restaurant/like_restaurant/${prop.restaurant.id_restaurant}`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${sessionStorage.getItem("Idtoken")}`,
                    }
                }).then(() => {
                    setLiked(!liked)
                    messageApi.open({
                        type: "success",
                        content: "Successfully liked"
                    })
                }).catch(() => {
                    messageApi.open({
                        type: "error",
                        content: "Something Went Wrong"
                    })
                })

        }
    }

    function sendToRestaurant() {
        window.open(`http://localhost:3000/restaurant/${prop.restaurant.id_restaurant}`, "_self")
    }

    return (
        <motion.div
            whileHover={{
                scale: 1.02,
                cursor: "pointer"
            }}
            whileTap={{
                scale: 0.99
            }}
        >
            {contextHolder}
            <Card
                onClick={sendToRestaurant}
                style={{
                    position: "relative"
                }}
                cover={
                    <img
                        alt="example"
                        src={require(`../../restaurantImages/${prop.restaurant.img_rest}`)}
                    />
                }
            >
                <Meta
                    title={prop.restaurant.name}

                />
                <Button
                    style={{
                        position: "absolute",
                        right: 10,
                        bottom: 16
                    }}
                    type="text"
                    icon={liked ? <HeartFilled /> : <HeartOutlined />}
                    onClick={toggleLiked}
                />
            </Card>
        </motion.div>
    )
}

export function FavouriteRestaurantCard() {
    const [restaurants, setRestaurant] = useState([])
    const token = sessionStorage.getItem('Idtoken')
    useEffect(() => {
        fetch(`http://127.0.0.1:5000/Account/getLikedRestaurant`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        }).then(res => res.json()).then(data => {
            let listOfRestaurants = [];
            let element = [];
            data.map((restaurant, index) => {
                if (listOfRestaurants.length < 4) {
                    listOfRestaurants.push(
                        <LikeRestaurantCard
                            restaurant={restaurant}
                        />);
                }
                else {
                    element.push(<SwiperSlide key={index}>
                        <LikeRestaurantGrid restaurants={listOfRestaurants} />
                    </SwiperSlide>)
                    listOfRestaurants = [];
                    listOfRestaurants.push(
                        <LikeRestaurantCard
                            restaurant={restaurant}
                        />)
                }
                if (index + 1 === data.length) {
                    element.push(
                        <SwiperSlide key={index + 1}>
                            <LikeRestaurantGrid
                                restaurants={listOfRestaurants} />
                        </SwiperSlide>)
                }

            })
            if (data == 0) {
                setRestaurant(<Empty
                    description={"No liked Restaurants"}
                />)
            }
            else {
                setRestaurant(element)
            }
        })
    }, [])

    return (
        <motion.div
            initial={{ y: -1000 }}
            animate={{ y: 0, transition: { duration: 0.3, delay: 0.3 } }}
            style={{ height: "657px", }}
        >
            <Card
                style={{
                    marginTop: "20px",
                    marginRight: "10px",
                    height: "100%",
                    overflow: "hidden",
                    padding: "5px"
                }}
                title="Favourite Restaurant"
            >
                <Swiper
                    navigation={true}
                    modules={[Navigation]}
                    style={
                        {
                            width: "100%",
                            height: "100%",
                        }
                    }
                >
                    {restaurants}
                </Swiper>
            </Card>
        </motion.div>
    )
}

export function FavouriteRestaurantCard2(prop) {
    let restaurant;
    const [animateFinsh, setAnimateFinish] = useState(true)
    useEffect(() => {

        setAnimateFinish(false)
    }, [prop.account])
    if (prop === 0) {
        return null
    }

    if (prop.account === 0) {
        restaurant = (<Empty
            description={"No liked Restaurants"}
        />)
    } else if (prop.account[0]?.favouriteRestaurant === 0) {
        restaurant = (<Empty
            description={"No liked Restaurants"}
        />)
    } else {
        let listOfRestaurants = [];
        let element = [];

        try {
            let data = JSON.parse(prop.account[0]?.favouriteRestaurant)
            data.map((Restaurant, index) => {
                if (listOfRestaurants.length <= 4) {
                    listOfRestaurants.push(<LikeRestaurantCard restaurant={Restaurant} />);
                }
                else {
                    listOfRestaurants = [];
                    element.push(<SwiperSlide><LikeRestaurantGrid restaurants={listOfRestaurants} /></SwiperSlide>)
                }
                if (index + 1 === data.length) {
                    element.push(<SwiperSlide key={index + 1}><LikeRestaurantGrid restaurants={listOfRestaurants} /></SwiperSlide>)
                }
            })
            restaurant = element;
        } catch (error) {
            restaurant = (<Empty
                description={"No liked Restaurants"}
            />)
        }
    }


    return (
        <AnimatePresence onExitComplete={() => { setAnimateFinish(true) }}>
            {animateFinsh &&
                (
                    <motion.div
                        initial={{ y: -1000 }}
                        animate={{ y: 0, transition: { duration: 0.3, delay: 0.3 } }}
                        style={{ height: "97%", }}
                        exit={{ y: -1000, transition: { duration: 0.3 } }}

                    >
                        <Card
                            style={{
                                marginTop: "20px",
                                marginRight: "10px",
                                height: "100%",
                                overflowX: "hidden",
                            }}
                            title="Favourite Restaurant"
                        >
                            <Swiper
                                navigation={true}
                                modules={[Navigation]}
                                style={
                                    {
                                        width: "100%",
                                        height: "100%",

                                    }
                                }
                            >
                                {restaurant}
                            </Swiper>
                        </Card>
                    </motion.div>
                )}
        </AnimatePresence>
    )
}