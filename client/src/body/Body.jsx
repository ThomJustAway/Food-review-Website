import React from "react";
import { Carousel, Typography, Rate, Col, Row } from "antd"
import { DollarOutlined } from '@ant-design/icons';
import bodyCss from "./body.module.css"
import { Footer } from "../footer/footer";
function Carou(props) {
    return (
        <>
            <div className={bodyCss.Title}>{props.type}</div>
            <Carousel autoplay >
                <Recommend />
                <Recommend />
                <Recommend />
                <Recommend />
            </Carousel>
        </>
    )
}

export function Type(prop) {
    return (
        <div className={bodyCss.type}>
            {prop.typeName}
        </div>
    )
}

function Recommend() {
    return (
        <div className={bodyCss.Recommend}>
            <div className={bodyCss.overLay}>
                <div className={bodyCss.RecommendInfo}>
                    <div className={bodyCss.RecommendTitle}>Ice Lab Cafe</div>
                    <div>Location: <span className={bodyCss.RecommendLocation}>Bedok adfasddf</span></div>
                    <div>
                        <div className={bodyCss.RecommendRating}>Rating:</div>
                        <Rate disabled allowHalf defaultValue={5} />
                        <div className={bodyCss.Cost}>Cost:<span> </span>
                            <Rate disabled defaultValue={2} character={<DollarOutlined />} />
                        </div>
                    </div>
                    <Type typeName="Korean" />
                    <Type typeName="Japanese" />
                    <Type typeName="Waffles" />
                </div>
            </div>
            <img src={require("../restaurantImages/1.jpg")} alt="" className={bodyCss.RecommendImage} />
        </div>
    )
} // add the data from the db

export function Body() {
    return (
        <Row>
            <Col span={24}>
                <Carou type="Popular Restaurant" />
            </Col>
            <Col span={24}>
                <div className={bodyCss.Header}>
                    <div>
                        More Shops
                    </div>
                </div>

            </Col>
            <Col span={12}>
                <Carou type="Good Waffle Shop" />
            </Col>
            <Col span={12}>
                <Carou type="Nice Coffee" />
            </Col>
            <Footer />
        </Row>
    )
}

