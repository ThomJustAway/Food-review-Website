import React, { useState } from "react";
import { Spin, Input, message, Modal, Form, Tag, FloatButton, Select, Typography, Tooltip, Card, Avatar, ConfigProvider, Tabs, Breadcrumb, Descriptions, Image, Layout, Row, Col, Rate, Upload, Button, Popover, Divider } from "antd"
import { Content } from "antd/es/layout/layout";
import { ExclamationCircleOutlined, DeleteOutlined, EditOutlined, FormOutlined, UserOutlined, UploadOutlined, HeartFilled, DollarCircleOutlined, LikeOutlined, LikeFilled, CaretUpFilled, CaretUpOutlined, CaretDownOutlined, CaretDownFilled } from "@ant-design/icons"
import HeaderRemix from "./Header";
import restaurantInfoCss from "./restaurantInfo.module.css"
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "./styles.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper";
import { Footer } from "../footer/footer";
import { HeartButton, RecommendRestaurant, RestaurantCard } from "../restaurantPage/restaurant";
import { useEffect } from "react";
import { EmptyRemix } from "../restaurantPage/restaurant";
import useFormItemStatus from "antd/es/form/hooks/useFormItemStatus";
import { FoodImageTab } from "./FoodImageTab";

const { Meta } = Card;
const { TextArea } = Input;



let Globalid;


function Type(prop) {
    if (prop.type == null) {
        return
    }
    else {
        return (
            <Tag color="blue">{prop.type}</Tag>

        )
    }
}

function Information(prop) {
    const restaurant = prop.restaurant

    return (
        <div style={{
            padding: "10px 15px",
            backgroundColor: "white",
            borderRadius: "15px",
            paddingBottom: "40px",
            marginBottom: "20px"
        }} >
            <Descriptions title={restaurant.name} bordered style={{ backgroundColor: "white" }}>
                <Descriptions.Item label="Location">{restaurant.region}</Descriptions.Item>
                <Descriptions.Item label="Phone Number">98349391</Descriptions.Item>
                <Descriptions.Item label="Specialise"><Type type={`Waffle`} /><Type type={`Ice Cream`} /></Descriptions.Item>
                <Descriptions.Item label='Rating'><Rate disabled allowHalf value={restaurant.Rating} /></Descriptions.Item>
                <Descriptions.Item label="Popularity">{restaurant.popularity} <HeartFilled style={{ color: "red" }} /></Descriptions.Item>
                <Descriptions.Item label='Cost'><Rate allowHalf value={restaurant.cost} disabled character={<DollarCircleOutlined />} /></Descriptions.Item>
                <Descriptions.Item label="Address">
                    {restaurant.location}
                </Descriptions.Item>
            </Descriptions>
        </div>

    )
}//make the information changes dyanmic

function Location(prop) {
    return (
        <iframe src={prop.location}
            allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" style={{ width: "100%", height: "700px", border: "none" }}></iframe>
    )
}// add the link of the iframe here


function Vote(prop) {
    const [messageApi, contextHolder] = message.useMessage();
    const [numberProperties, setProperties] = useState({
        vote: prop.vote,
        Originalnumber: prop.voteNumber,
        Changenumber: prop.voteNumber,
    })
    const token = sessionStorage.getItem("Idtoken")

    useEffect(() => {
        if (token != null) {
            fetch("http://127.0.0.1:5000/Review/vote/get", {
                method: "get",
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem("Idtoken")}`
                }
            })
                .then(res => res.json())
                .then(data => {
                    data.map(review => {
                        if (review.id_restaurant_review === prop.id) {
                            setProperties(prev => ({
                                ...prev,
                                vote: review.upvote,
                                Originalnumber: prev.Originalnumber - review.upvote
                            }));
                        }//fix this
                    })
                })

        }
    }, [])

    function voting(vote) {
        if (vote !== 0) {
            fetch(`http://127.0.0.1:5000/Review/InsertVote/${vote}/${prop.id}`, {
                method: "POST",
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem("Idtoken")}`
                }
            })
        }
        else {
            fetch(`http://127.0.0.1:5000/Review/DeleteVote/:id_restaurant_review`, {
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem("Idtoken")}`
                }
            }
            ).catch(
                messageApi.open({
                    "type": "error",
                    "content": "There seems to be some error with updating"
                })
            )
        }
    }

    function upvote() {
        if (token == null) {
            messageApi.open({
                "type": "error",
                "content": "You cant vote without a account"
            })
            return;
        }
        if (!prop.isUser) {
            if (numberProperties.vote === 0) {
                console.log(numberProperties)
                messageApi.open({
                    "type": "success",
                    "content": "You have successfully upvoted a review!"
                })
                setProperties(prev => ({
                    ...prev,
                    Changenumber: prev.Originalnumber + 1, vote: 1
                }));
                voting(1)
            }
            else {
                messageApi.open({
                    "type": "success",
                    "content": "You have successfully remove a vote!"
                })
                setProperties(prev => ({
                    ...prev,
                    Changenumber: prev.Originalnumber,
                    vote: 0
                }));
            }
        }
        else {
            messageApi.open({
                "type": "error",
                "content": "You cant like your own post!"
            })
        }
    }

    function downvote() {
        if (token == null) {
            messageApi.open({
                "type": "error",
                "content": "You cant vote without a account"
            })
            return;
        }
        if (!prop.isUser) {
            if (numberProperties.vote === 0) {
                messageApi.open({
                    "type": "success",
                    "content": "You have successfully Downvoted a review!"
                })
                setProperties(prev => ({
                    ...prev,
                    Changenumber: prev.Originalnumber - 1,
                    vote: -1
                }));
                voting(-1)
            }
            else {
                messageApi.open({
                    "type": "success",
                    "content": "You have successfully remove a vote!"
                })
                setProperties(prev => ({
                    ...prev,
                    Changenumber: prev.Originalnumber,
                    vote: 0
                }));
            }
        }
        else {
            messageApi.open({
                "type": "error",
                "content": "You cant like your own post!"
            })
        }
    }

    return (
        <div className={restaurantInfoCss.Vote}>

            {contextHolder}
            <Button style={{ border: 'none' }}
                ghost
                onClick={upvote}
                icon={numberProperties.vote == 1 ?

                    <CaretUpFilled
                        style={{ color: '#a0d911' }}
                    /> :

                    <CaretUpOutlined
                        style={{ color: "#bfbfbf" }}
                    />}></Button>

            <Popover content={"Vote"} placement="right">
                <div className={restaurantInfoCss.numberContainer}>
                    {numberProperties.Changenumber}</div>
            </Popover>

            <Button style={{ border: 'none' }}
                ghost
                onClick={downvote}
                icon={numberProperties.vote == -1 ?
                    <CaretDownFilled
                        style={{ color: '#fa541c' }}
                    /> :
                    <CaretDownOutlined
                        style={{ color: "#bfbfbf" }}
                    />}>

            </Button>

        </div>
    )

}

function EditabeComment(prop) {
    const [openEdit, setOpenEdit] = useState(false)

    const showEditModal = () => {
        setOpenEdit(true);
    };

    const DeleteReview = () => {
        fetch(`http://127.0.0.1:5000/Review/Delete/${prop.id}`, {
            method: "DELETE"
        }).then(
            () => {
                prop.messageApi.open({
                    type: "success",
                    content: "Successfully deleted a comment"
                })
                prop.reload(0)
            }
        )
    }
    const confirm = () => {
        Modal.confirm({
            title: 'Are you Sure you want to Delete?',
            icon: <ExclamationCircleOutlined />,
            content: 'If you delete, You will not recover this review again!',
            okText: 'Okay',
            cancelText: 'No',
            onOk: DeleteReview
        });
    };

    function Text() {
        return (
            <div style={{ width: "90%" }}>
                {prop.review.text}
            </div>
        )
    }
    const image = require(`../accountImages/${prop.review.profile}`);
    return (
        <Card
            style={{
                width: "75%",
                marginTop: 16,
            }}
            actions={[
                <EditOutlined key="edit" onClick={showEditModal} />,
                <DeleteOutlined key="delete" onClick={confirm} />
            ]}
        >
            <EditModal
                userReview={prop.id}
                messageApi={prop.messageApi}
                fullReload={prop.fullReload}
                isOpen={setOpenEdit}
                open={openEdit}
            />
            <Meta
                avatar={<Avatar size={36} src={image} />}
                title={prop.review.username}//prop.review.username
                description={<Text />}
            />
            <Row align={"bottom"}>
                <Col span={8}>
                    <Rate style={{ marginLeft: "45px", marginTop: "20px" }} allowHalf tooltips={["Rating"]} value={prop.review.rating} disabled />
                </Col>
                <Col span={3} offset={13}>
                    <span className={restaurantInfoCss.time}>1 Month Ago</span>
                </Col>
            </Row>

            <Vote
                voteNumber=
                {prop.review.vote == null ? 0 : prop.review.vote}
                vote={0}
                isUser={true}
                id={prop.id}
            />
        </Card>
    )
}

function EditModal(prop) {

    const onFinish = (value) => {
        fetch(`http://127.0.0.1:5000/Review/Update/${prop.userReview}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(value)
        }).then(() => {
            prop.messageApi.open({
                type: "success",
                content: "You have Successfully change your review!"
            })
            prop.fullReload()
            closeModal();
        })

    }
    const onFinishFailed = () => {
        console.log("error")
    }
    const closeModal = () => {
        prop.isOpen(false)
    }
    return (
        <Modal
            open={prop.open}
            footer={[]}
            onCancel={closeModal}
        >
            <Card style={{ marginTop: "20px" }}>
                <Divider>Edit Comments</Divider>
                <Form
                    name="basic"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Text"
                        name="text"
                        rules={[{ required: true, message: 'Please give a review!' }]}
                    >
                        <TextArea rows={6} maxLength={500} />
                    </Form.Item>
                    <Form.Item
                        label="Rating"
                        name="rating"
                    >
                        <Rate allowHalf />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Submit</Button>
                    </Form.Item>
                </Form>
            </Card>
        </Modal>
    )
}//the pop up that let users to edit the review

function EditDeleteModal(prop) {
    const [open, isOpen] = useState(false);

    const DeleteReview = () => {
        fetch(`http://127.0.0.1:5000/Review/Delete/${prop.userReview}`, {
            method: "DELETE"
        }).then(
            () => {
                prop.messageApi.open({
                    type: "success",
                    content: "Successfully deleted a comment"
                })
                prop.setReview(null)
                prop.fullReload()

            }
        )
    }
    const confirm = () => {
        Modal.confirm({
            title: 'Are you Sure you want to Delete?',
            icon: <ExclamationCircleOutlined />,
            content: 'If you delete, You will not recover this review again!',
            okText: 'Okay',
            cancelText: 'No',
            onOk: DeleteReview
        });
    };

    const openModal = () => {
        isOpen(true)
    }
    return (
        <>
            <Button
                icon={<EditOutlined />}
                type="primary"
                onClick={openModal}
                style={{
                    width: "10%",
                    marginLeft: "2.5%"
                }}
            >Edit</Button>
            <EditModal
                open={open}
                isOpen={isOpen}
                userReview={prop.userReview}
                messageApi={prop.messageApi}
                fullReload={prop.fullReload}

            />
            <Button danger
                type="primary"
                icon={<DeleteOutlined />}
                style={{
                    width: "10%",
                    marginLeft: "2.5%"
                }}
                onClick={confirm}
            >Delete</Button>
        </>
    )
}

function Comment(prop) {
    console.log(prop)
    function Text() {
        return (
            <div style={{ width: "90%" }}>
                {prop.review.text}
            </div>
        )
    }//text from the comment

    const image = require(`../accountImages/${prop.review.profile}`);
    if (prop.usersReview == prop.review.id_restaurant_review) {
        return (
            <EditabeComment
                messageApi={prop.messageApi}
                review={prop.review}
                id={prop.review.id_restaurant_review}
                reload={prop.reload}
                fullReload={prop.fullReload}
            />
        )
    }

    else {
        return (
            <Card
                style={{
                    width: "75%",
                    marginTop: 16,
                }}
                loading={false}
            >
                <Meta
                    avatar={<Avatar size={36} src={image} />}
                    title={prop.review.username}//prop.review.username
                    description={<Text />}
                />
                <Row align={"bottom"}>
                    <Col span={8}>
                        <Rate style={{ marginLeft: "45px", marginTop: "20px" }} allowHalf tooltips={["Rating"]} value={prop.review.rating} disabled />
                    </Col>
                    <Col span={3} offset={13}>
                        <span className={restaurantInfoCss.time}>{prop.review.date}</span>
                    </Col>
                </Row>
                <Vote
                    voteNumber=
                    {prop.review.vote == null ? 0 : prop.review.vote}
                    vote={0}
                    id={prop.review.id_restaurant_review}
                    isUser={false}
                />
            </Card>
        )
    }
}//template for the review
//making sure to not hardcode the comment template later after change

function FilterSection(prop) {
    const [messageApi, contextHolder] = message.useMessage();
    const [userReview, setReview] = useState(null)
    const [button, changeButton] = useState([])//will have create review and edit review
    const options = [
        {
            value: " RR.rating=0 OR RR.rating =0.5 ",
            label: "0 Star"
        },
        {
            value: " RR.rating=1 OR RR.rating =1.5 ",
            label: "1 Star"
        },
        {
            value: " RR.rating=2 OR RR.rating=2.5 ",
            label: "2 Star"
        },
        {
            value: " RR.rating=3 OR RR.rating = 3.5 ",
            label: "3 Star"
        },
        {
            value: " RR.rating=4 OR RR.rating =4.5 ",
            label: "4 Star"
        },
        {
            value: " RR.rating=5 ",
            label: "5 Star"
        },
    ];

    const handleChange = (value) => {

        let filter = value.join("OR")
        if (filter != "") {
            prop.setFilter(`AND ${filter}`)
        }
        else {
            prop.setFilter("")
        }
    };

    const denyCreateComment = () => {
        messageApi.open({
            type: "error",
            content: "Please create an account before creating a review!"
        })
    }
    useEffect(() => {
        const token = sessionStorage.getItem('Idtoken');
        if (token != null) {
            fetch(`http://127.0.0.1:5000/ReviewId/Get/${Globalid}`, {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem("Idtoken")}`
                }
            }).then(res => res.json())
                .then(Review => {
                    setReview(Review[0]?.id_restaurant_review)
                })
        }
        else {
            messageApi.open({
                type: "info",
                content: "You will need an account for reviewing and voting!"
            })
        }

        if (token == null) {
            const btnRestrict = (<Button
                onClick={denyCreateComment}
                type="primary"
                icon={<FormOutlined />}
                style={{ marginLeft: "5%", width: "20%" }}>
                Add Review</Button>)
            changeButton(btnRestrict);
        } // if user has no token
        else if (userReview != null) {
            changeButton(<EditDeleteModal
                messageApi={messageApi}
                fullReload={prop.fullReload}
                userReview={userReview}
                setReview={setReview}

            />)
        }// give the edit and review section if have comment
        else {
            changeButton(<CreateModal
                messageApi={messageApi}
                fullReload={prop.fullReload}
                setReview={setReview}

            />);
        }//give the option to comment
    }, [userReview, userReview])



    return (
        <>
            {contextHolder}
            <Select
                mode="multiple"
                style={{
                    width: '50%',
                }}
                placeholder="Filters"
                onChange={handleChange}
                options={options}
            />

            {button}
        </>
    )
}

function CreateModal(prop) {
    const [open, setOpen] = useState(false)

    const closeModal = () => {
        setOpen(false)
    }
    const openModal = () => {
        setOpen(true)
    }
    const onFinish = (value) => {
        console.log(value)
        fetch(`http://127.0.0.1:5000/Review/Create/${Globalid}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem("Idtoken")}`,
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                text: value.text,
                rating: value.rating
            })

        }).then(() => {
            prop.messageApi.open({
                type: "success",
                content: "Review has been created successfully!"
            })
            prop.setReview(0);
            prop.fullReload();
        })
        setOpen(false)

    }
    const onFinishFailed = () => {
        console.log("did not finsh")
    }
    return (
        <>
            <Modal open={open} onCancel={closeModal}
                footer={[]}>
                <Divider>Create Review</Divider>
                <Form
                    name="basic"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Text"
                        name="text"
                        rules={[{ required: true, message: 'Please give a review!' }]}
                    >
                        <TextArea rows={6} maxLength={500} />
                    </Form.Item>
                    <Form.Item
                        label="Rating"
                        name="rating"
                    >
                        <Rate allowHalf />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Submit</Button>
                    </Form.Item>
                </Form>
            </Modal>
            <Button
                onClick={openModal}
                type="primary"
                icon={<FormOutlined />}
                style={{ marginLeft: "5%", width: "20%" }}>
                Add Review</Button>
        </>

    )
}

function ReviewSection() {
    const [reviews, setReviews] = useState([])
    const [messageApi, contextHolder] = message.useMessage();
    const [Loading, setLoading] = useState(true)
    const [sort, setSort] = useState("order by vote desc")
    const [filter, setFilter] = useState("")
    function reload(userReview) {
        setLoading(true);
        fetch(`http://localhost:5000/Review/Get/${Globalid}?sort=${sort}&filter=${filter}`)
            .then(res => res.json()).then(
                data => {
                    console.log(data)
                    let items = data.map((review) => {
                        return (
                            <Comment key={review.id_restaurant_review}
                                usersReview={userReview}
                                review={review}
                                messageApi={messageApi}
                                reload={reload}
                                fullReload={fullReload}
                            />
                        )
                    })
                    if (items == 0) {
                        setReviews(<EmptyRemix />)
                        setLoading(false);
                    }
                    else {
                        setReviews(items)
                        setLoading(false);

                    }
                }
            )

    }

    function fullReload() {
        if (sessionStorage.getItem('Idtoken') != null) {
            fetch(`http://127.0.0.1:5000/ReviewId/Get/${Globalid}`, {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem("Idtoken")}`
                }
            })
                .then(res => res.json())
                .then(userReview => {
                    reload(
                        userReview[0]?.id_restaurant_review
                    )

                })
        }//if they have token
        else {
            reload(0);
        }
    }

    useEffect(() => {
        fullReload()
    }, [filter])



    return (

        <div style={{
            marginLeft: "30px",
            paddingBottom: "40px"
        }}>
            {contextHolder}
            <FilterSection fullReload={fullReload} setFilter={setFilter} />
            {Loading ? <Load /> : reviews}
            <FloatButton.BackTop />
        </div>
    )
}//add empty if no review


function Load() {
    return (
        <div style={{
            width: "75%",
            height: "200px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#003333",
            borderRadius: "10px",
            marginTop: "30px"
        }}>
            <Spin />
        </div>

    )
}

function Menu() {
    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "500px", color: "white", fontSize: "20px" }}>
            Redirecting you to the menu page
        </div>
    )
}

function OtherLocation() {
    return (
        <RecommendRestaurant />
    )
}

function ContentRemix(prop) {
    let items;
    const haveMenu = () => {
        if (prop.restaurant.menu_link != null) {
            return ({
                label: "Menu",
                key: "2",
                children: <Menu />
            })
        }
        else {
            return (
                {
                    label: "Menu",
                    key: "2",
                    children: <Menu />,
                    disabled: true
                }
            )
        }
    }



    items = [
        {
            label: `Information`,
            key: '1',
            children: <Information restaurant={prop.restaurant} />,
        },
        haveMenu()
        ,
        {
            label: `Food Images`,
            key: '3',
            children: <FoodImageTab id={Globalid} />,
        },
        {
            label: `Location`,
            key: '4',
            children: <Location location={prop.restaurant.location_url} />,
        },
        {
            label: `Reviews`,
            key: '5',
            children: <ReviewSection />,
        },
        {
            label: `Other Locations`,
            key: '6',
            children: <OtherLocation />,
        },
        {
            label: <HeartButton
                restaurantId={prop.restaurant.id_restaurant} />,
            key: "7"
        }
    ]


    const handleTabClick = (key, e) => {
        if (key == 2) {
            e.preventDefault();
            window.open(`${prop.restaurant.menu_link}`, '_blank');
        }
    };
    return (
        <Content style={{
            marginRight: "50px",
            marginLeft: "50px"
        }}>
            <Tabs style={{ color: "white" }}
                defaultValue={1}
                onTabClick={handleTabClick}
                items={items}
            />
        </Content>
    )
}//where the main content is at

export class RestaurantInfoPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            RestaurantData: [],
            RestaurantImage: ""
        }
    }

    componentDidMount() {
        const url = window.location.href;
        const id = url.split('/').pop();
        Globalid = id;
        fetch(`http://127.0.0.1:5000/Restaurant/getSpecific/${id}`)
            .then(res => res.json())
            .then(data => {
                this.setState({
                    RestaurantData: data[0],
                    RestaurantImage: data[0].img_rest
                })
            })
    }

    render() {
        return (
            <>
                <Layout style={{ backgroundColor: "#181b1d" }}>
                    <HeaderRemix picture={this.state.RestaurantImage} />
                    <ContentRemix restaurant={this.state.RestaurantData} />
                </Layout>
                <Footer />
            </>
        )
    }
}