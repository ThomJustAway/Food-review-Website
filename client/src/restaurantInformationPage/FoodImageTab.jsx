import React, { useState, useEffect } from "react";
import { message, Image, Row, Col, Upload, Button } from "antd"
import { UploadOutlined } from "@ant-design/icons"
import { EmptyRemix } from "../restaurantPage/restaurant";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper";

export function FoodImageTab(prop) {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    const [images, setImages] = useState([])

    useEffect(() => {
        fetch(`http://localhost:3000/Restaurant/getFoodImages/${prop.id}`).then(res => res.json()).then(
            data => {
                if (data == 0) {
                    setImages([])

                }
                else {
                    let items = data.map(image => {
                        return (
                            <SwiperSlide key={image.id_restaurant_food_img}>
                                <Image width={"100%"} src={require(`../RestaurantFood/${image.img_restaurant}`)} alt="" />
                            </SwiperSlide>
                        )
                    })
                    let placeHolder = data.map(image => {
                        return (
                            <SwiperSlide key={image.id_restaurant_food_img}>
                                <img src={require(`../RestaurantFood/${image.img_restaurant}`)} alt="" />
                            </SwiperSlide>
                        )
                    })
                    setImages([items, placeHolder])
                }
            }
        )
    }, [])
    if (images == 0) {
        return (
            <>
                <EmptyRemix
                    description={"No images Avaliable"}
                />
                <Row>
                    <Col span={3} offset={21}>
                        <UploadingImageBtn />
                    </Col>
                </Row>
            </>
        )
    }
    //else
    return (
        <>
            <div style={{ width: "100%", height: "600px", paddingBottom: "30px", marginBottom: "10px" }}>
                <Swiper
                    style={{
                        "--swiper-navigation-color": "#fff",
                        "--swiper-pagination-color": "#fff",
                    }}
                    spaceBetween={10}
                    navigation={true}
                    thumbs={{ swiper: thumbsSwiper }}
                    modules={[FreeMode, Navigation, Thumbs]}
                    className="mySwiper2"
                >
                    {images[0]}
                </Swiper>
                <Swiper
                    onSwiper={setThumbsSwiper}
                    spaceBetween={10}
                    slidesPerView={4}
                    freeMode={true}
                    watchSlidesProgress={true}
                    modules={[FreeMode, Navigation, Thumbs]}
                    className="mySwiper"
                >
                    {images[1]}
                </Swiper>
            </div>
            <Row>
                <Col span={3} offset={21}>
                    <UploadingImageBtn />
                </Col>
            </Row>
        </>
    )
}


function UploadingImageBtn() {
    const [messageApi, contextHolder] = message.useMessage();
    const havetoken = sessionStorage.getItem("Idtoken") != null
    const url = window.location.href;
    const id = url.split('/').pop();

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

    if (havetoken) {
        return (
            <Upload
                name="image"
                action={`http://localhost:5000/Restaurant/postFoodImages/${id}`}
                method="POST"
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
                    style={{ marginBottom: "20px" }}
                    icon={<UploadOutlined />}
                    name="image"
                >
                    Upload Images
                </Button>
            </Upload>)
    }


}

//2.make sure the upload component works when the images are downloaded
//3.make sure that only people with account can login