import { message, Avatar, Tag, Divider, Image, Typography, AutoComplete, Col, ConfigProvider, Layout, Row, Button, Empty, Rate, Popover, Space, Switch, Tooltip, Select, Card } from "antd";
import React, { useState, useEffect } from "react";
import Css from "./restaurant.module.css"
import { StarFilled, CaretUpOutlined, UserOutlined, QuestionOutlined, DollarCircleOutlined, HeartFilled, HeartOutlined, CaretDownOutlined } from "@ant-design/icons"
import { green, yellow } from "@ant-design/colors"
import { Header } from "antd/es/layout/layout";
import { Footer } from "../footer/footer";
import LocaleProvider from "antd/es/locale-provider";
const { Title } = Typography
const { Content, Sider } = Layout;
const { Meta } = Card;


function Search(prop) {
    const handleSearch = (value) => {
        let newSearchApi = `search=${value}&`
        prop.handleSearch(newSearchApi)
    };
    return (
        <AutoComplete
            style={{
                width: "100%",
                marginTop: "26px"
            }}
            onSearch={handleSearch}
            placeholder="Search Restaurant"

        />
    )
} // The search engine

export function HeartButton(prop) {
    const [liked, setLiked] = useState(false);
    const token = sessionStorage.getItem("Idtoken");
    const [messageApi, contextHolder] = message.useMessage();

    console.log(prop.restaurantId)

    useEffect(() => {
        fetch("http://127.0.0.1:5000/Account/getLikedRestaurant"
            , {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            }).then(res => res.json())
            .then(data => {
                const like = data.filter(restaurant =>
                    restaurant.id_restaurant === prop.restaurantId)

                if (like != 0) {
                    setLiked(true)
                }
            })
    }, [])

    function likeRestaurant() {
        fetch(`http://127.0.0.1:5000/Restaurant/like_restaurant/${prop.restaurantId}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(
            () => {
                messageApi.success("The restaurant is stored!")
                setLiked(true)
            }
        )

    }

    function unlikedRestaurant() {
        fetch(`http://127.0.0.1:5000/Restaurant/removeLike_restaurant/${prop.restaurantId}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(
            () => {
                messageApi.success("The restaurant is Deleted!")
                setLiked(false)
            }
        )
    }

    function handleToggleChange(e) {
        e.stopPropagation()
        if (liked) unlikedRestaurant()
        else likeRestaurant()
    }

    if (token === null) return null

    return (
        <Tooltip title="Add To Favourites">
            {contextHolder}
            <Button
                style={{ border: 'none' }}
                ghost
                onClick={handleToggleChange}
                icon={liked ?
                    <HeartFilled style={{ color: 'red' }} />
                    : <HeartOutlined />}>

            </Button>
        </Tooltip>
    )

}

function Result(prop) {
    function Type(prop) {
        if (prop.type == null) {
            return;
        }
        return (
            <div className={Css.Type}>
                {prop.type}
            </div>
        )
    }
    function goRestaurant() {
        window.open(`http://localhost:3000/restaurant/${prop.id}`, "_self")
    }

    const getReviews = () => {
        if (prop.changeReview === undefined) {
            return null
        }
        fetch(`http://127.0.0.1:5000/Review/Get/${prop.id}?sort=order by vote desc&limit=limit 2`)
            .then(res => res.json())
            .then(data => {
                let result = data.map(review => {
                    return <Review
                        key={review.id_restaurant_review}
                        username={review.username}
                        text={review.text}
                        vote={review.vote}
                        profile={review.profile}
                        date={review.date}
                    />
                })
                prop.changeReview(result)
            })
    }



    return (
        <div className={Css.Result}
            onClick={goRestaurant}
            onMouseEnter={getReviews}
        >
            <Image
                style={{
                    width: "10rem",
                    height: "8rem",
                    borderRadius: "10px"
                }}
                src={require(`../restaurantImages/${prop.image}`)}
                fallback="data:image/png;base64,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"
            />
            <div className={Css.nameInfo}>
                <div className={Css.title}>{prop.name}</div>
                <div className={Css.location}>{prop.location}</div>
                <div>
                    <Type type={prop.type1} />
                    <Type type={prop.type2} />
                    <Type type={prop.type3} />
                </div>
            </div>
            <div className={Css.Rating}>
                <Rate tooltips={["Restaurant Rating"]} disabled defaultValue={prop.Rating} />
                <div>
                    <Rate tooltips={["Cost"]} disabled character={<DollarCircleOutlined />} defaultValue={prop.cost} />
                </div>
                <div>
                    <Popover content={"Popularity"}>
                        {prop.popularity} <HeartFilled style={{ color: 'red' }} />
                    </Popover>
                </div>
            </div>
            <div>
                <Space>
                    <HeartButton
                        restaurantId={prop.id} />
                </Space>
            </div>
        </div>
    )
} //The result template

export function EmptyRemix() {
    return (
        <Empty style={{ color: '#ffffff', marginTop: 50 }} />
    )
}// an component that shows if empty

class SearchResult extends React.Component {
    constructor(props) {
        super(props)
        this.state = { results: [] }
    }

    getdata() {
        console.log(this.props.api)
        fetch(this.props.api).then(
            res => res.json()
        ).then(
            data => {

                let Items = data.map((restaurant) => {
                    return <Result key={restaurant.id_restaurant}
                        id={restaurant.id_restaurant}
                        name={restaurant.name}
                        location={restaurant.region}
                        popularity={restaurant.popularity}
                        Rating={restaurant.Rating}
                        type1={restaurant.type1}
                        type2={restaurant.type2}
                        type3={restaurant.type3}
                        cost={restaurant.cost}
                        image={restaurant.img_rest}
                        changeReview={this.props.setReviews}
                    />
                }
                )
                this.setState({ results: Items })
            })//fetch data from server
    }
    componentDidMount() {
        this.getdata()
    }

    componentDidUpdate(prevsprop) {
        if (this.props.api != prevsprop.api) {
            this.getdata();
        }
        let items = document.querySelectorAll(`.${Css.Result}`)
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                entry.target.classList.toggle(Css.show, entry.isIntersecting)
            })
        }, {
            rootMargin: "-50px",
            threshold: 0,
            root: document.querySelector(`.${Css.SearchResult}`)
        })
        items.forEach(restaurant => {
            observer.observe(restaurant)
        })//the items

    }

    render() {
        return (
            <div
                className={Css.SearchResult}>
                {this.state.results}
            </div>
        )
    }
}
// The container for the search results


function RandomRestaurantBtn() {
    const [random, setRandom] = useState([])

    useEffect(() => {
        fetch('http://127.0.0.1:5000/Restaurant/getAll')
            .then(res => res.json())
            .then(data => {
                var randomRestaurant = data[Math.floor(Math.random() * data.length)]
                setRandom(randomRestaurant)
            })
    }, [])

    function GetRandomRestaurant() {
        window.open(`http://localhost:3000/restaurant/${random.id_restaurant
            }`, "_self")
    }

    return (
        <Popover content="Random Restaurant">
            <Button
                style={{ marginTop: "26px" }}
                icon={<QuestionOutlined />}
                type="primary"
                shape="circle"
                onClick={GetRandomRestaurant}
            ></Button>
        </Popover>
    )
}

function Head(prop) {


    return (
        <>
            <Col span={5} offset={3}>
                <Title style={{ color: "white" }} level={5}>
                    Find By:
                    <Find
                        handleSort={prop.handleSort}
                    />
                </Title>
            </Col>
            <Col span={5}>
                <Search handleSearch={prop.handleSearch} />
            </Col>
            <Col offset={2}>
                <RandomRestaurantBtn />
            </Col>
        </>
    )
}//the place where the search and random button is at
//make sure to make the search function working

function ContentRemix(prop) {
    const [reviews, setreviews] = useState([])
    //contain the list of react component 

    return (
        <ConfigProvider>
            <Content style={{ backgroundColor: '#212529' }}>
                <br />
                <br />
                <Row>
                    <br />
                    <Head
                        handleSearch={prop.handleSearch}
                        handleSort={prop.handleSort}
                    />
                    <br />
                    <Col span={13} offset={3}>
                        <SearchResult
                            api={prop.api}
                            setReviews={setreviews}
                        />
                    </Col>
                    <Col span={6} offset={1}>
                        <ShowReview reviews={reviews} />
                    </Col>
                </Row>

            </Content>
        </ConfigProvider>
    )
} // the content of the result are here

//link with filter and search engine when user search for item
//------------------------------------------------------------------

class CusineSelector extends React.Component {
    constructor(props) {
        super(props)
        this.state = { options: [] }
        this.handleChange = this.handleChange.bind(this)
    }

    getdata() {
        fetch("http://127.0.0.1:5000/Restaurant/getType/c").then(res => res.json())
            .then(data => {
                let options = data.map((option) => {
                    for (let i = 0; i < this.props.selectedCusines.length; i++) {
                        if (this.props.selectedCusines[i].label == option.type) {
                            return {
                                value: option.id_type,
                                label: option.type,
                                disabled: true
                            }
                        }
                    }
                    return {
                        value: option.id_type,
                        label: option.type
                    }
                })
                this.setState({ options: options })
            })
    }

    componentDidMount() {
        this.getdata()
    }

    componentDidUpdate(prevsprop) {
        if (prevsprop.selectedCusines != this.props.selectedCusines) {
            this.getdata();
        }
    }

    handleChange(value, label) {
        this.props.addCusines(label)

    }

    render() {
        return (
            <Select
                showSearch
                placeholder={"Search"}
                style={{
                    width: 120,
                }}
                filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                }
                filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                onChange={this.handleChange}
                options={this.state.options} />
        )
    }
} // the Cusine filter

class DessertType extends React.Component {
    constructor(props) {
        super(props)
        this.state = { options: [] }
        this.handleChange = this.handleChange.bind(this)
    }

    getdata() {
        fetch("http://127.0.0.1:5000/Restaurant/getType/d").then(res => res.json())
            .then(data => {
                let options = data.map((option) => {
                    for (let i = 0; i < this.props.selectedDessert.length; i++) {
                        if (this.props.selectedDessert[i].label == option.type) {
                            return {
                                value: option.id_type,
                                label: option.type,
                                disabled: true
                            }
                        }
                    }
                    return {
                        value: option.id_type,
                        label: option.type
                    }
                })
                this.setState({ options: options })
            })
    }

    componentDidMount() {
        this.getdata()
    }

    componentDidUpdate(prevsprop) {
        if (prevsprop.selectedDessert != this.props.selectedDessert) {
            this.getdata();
        }
    }

    handleChange(value, label) {
        this.props.addDessert(label)
    }

    render() {
        return (
            <Select
                showSearch
                placeholder={"Search"}
                style={{
                    width: 120,
                }}
                filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                }
                filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                onChange={this.handleChange}
                options={this.state.options} />
        )
    }
}

class LocationSelector extends React.Component {
    constructor(props) {
        super(props)
        this.state = { options: [] }
        this.handleChange = this.handleChange.bind(this)
    }

    getdata() {
        console.log(this.props.selectedLocation)
        fetch("http://127.0.0.1:5000/Restaurant/getLocation").then(res => res.json())
            .then(data => {
                let options = data.map((option, key) => {
                    for (let i = 0; i < this.props.selectedLocation.length; i++) {
                        if (this.props.selectedLocation[i].label == option.Region) {
                            return {
                                value: key,
                                label: option.Region,
                                disabled: true
                            }
                        }
                    }
                    return {
                        value: key,
                        label: option.Region
                    }
                })
                this.setState({ options: options })
            })
    }

    componentDidMount() {
        this.getdata()
    }

    componentDidUpdate(prevsprop) {
        if (prevsprop.selectedLocation != this.props.selectedLocation) {
            this.getdata();
        }
    }

    handleChange(value, label) {
        this.props.addLocation(label)
    }

    render() {
        return (
            <Select
                showSearch
                placeholder={"Search"}
                style={{
                    width: 120,
                }}
                filterSort={(optionA, optionB) =>
                    (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                }
                filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
                onChange={this.handleChange}
                options={this.state.options} />
        )
    }
}

function FilterSelect(prop) {
    let Cusines = prop.selectedCusine,
        Dessert = prop.selectedDessert,
        Location = prop.selectedLocation

    const deleteCuisineFilter = (value) => {
        const result = Cusines.filter(cusine => cusine.value !== value)
        prop.setFilter(result, Dessert);
    }

    const deleteDessertFilter = (value) => {
        const result = Dessert.filter(dessert => dessert.value !== value)
        prop.setFilter(Cusines, result);
    }

    const deleteLocationFilter = (value) => {
        const result = Location.filter(location => location.value !== value)
        prop.setLocation(result)
    }

    if (Cusines == 0 && Dessert == 0 && Location == 0) {
        return (
            <Row>
                <Col offset={1} span={23}>
                    <Title style={{
                        color: '#9E9E9E',
                    }} level={5}>
                        No Filter selected
                    </Title>
                </Col>
            </Row>
        )
    }// if there is no selected filter, return empty message

    let cusinesFilter = Cusines.map((element) => {
        return <Tag
            key={element.value}
            closable
            style={
                {
                    backgroundColor: "white",
                    color: "black",
                    wordWrap: 'break-word',
                    width: 'auto',
                    marginBottom: 5
                }}
            onClose={() => deleteCuisineFilter(element.value)}
        >
            {element.label}
        </Tag>
    })

    let dessertFilter = Dessert.map((element) => {
        return <Tag
            key={element.value}
            closable
            style={
                {
                    backgroundColor: "white",
                    color: "black",
                    wordWrap: 'break-word',
                    width: 'auto', marginBottom: 5
                }}
            onClose={() => deleteDessertFilter(element.value)}
        >
            {element.label}
        </Tag>
    })

    let LocationFilter = Location.map((element) => {
        return <Tag
            key={`${element.value}L`}
            closable
            style={
                {
                    backgroundColor: "white",
                    color: "black",
                    wordWrap: 'break-word',
                    width: 'auto', marginBottom: 5
                }}
            onClose={() => deleteLocationFilter(element.value)}
        >
            {element.label}
        </Tag>
    })

    //else make the filter tags
    let listOfFilter = dessertFilter.concat(LocationFilter).concat(cusinesFilter);
    console.log(listOfFilter)
    return (
        <div className={Css.filter}>
            {listOfFilter}
        </div>
    )
}// shows the filter the person selected

function createfilterApi(Cusines, Dessert) {
    let api = ""
    if (Cusines.length == 0 && Dessert == 0) {
        return "filter=&"
    }
    if (Cusines.length != 0) {
        for (let i = 0; i < Cusines.length; i++) {
            api = api + `filter=${Cusines[i].value}&`
        }
    } else {
        for (let i = 0; i < Dessert.length; i++) {
            api = api + `filter=${Dessert[i].value}&`
        }
    }
    return api
}

function createLocationApi(location) {
    let api = ""
    if (location.length == 0) {
        return "district=&"
    }
    for (let i = 0; i < location.length; i++) {
        api = api + `district=${location[i].label}&`
    }
    return api
}

class SiderRemix extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedCusines: [],
            selectedDessertType: [],
            selectedLocation: []
        }
        this.addCusines = this.addCusines.bind(this)
        this.setFilter = this.setFilter.bind(this)
        this.addDessert = this.addDessert.bind(this)
        this.addLocation = this.addLocation.bind(this)
        this.setLocation = this.setLocation.bind(this)
    }


    setFilter(newCusine, newDessertType) {
        this.setState({
            selectedCusines: newCusine,
            selectedDessertType: newDessertType
        })
    }

    setLocation(newLocation) {
        this.setState({
            selectedLocation: newLocation
        })
    }

    addCusines(Cusine) {
        let curr = [Cusine];
        this.setState({ selectedCusines: curr.concat(this.state.selectedCusines) })
    }

    addLocation(Location) {
        let curr = [Location];
        this.setState({ selectedLocation: curr.concat(this.state.selectedLocation) })
    }

    addDessert(Dessert) {
        let curr = [Dessert];
        this.setState({ selectedDessertType: curr.concat(this.state.selectedDessertType) })
    }

    componentDidUpdate(_, prevState) {
        if (prevState.selectedCusines != this.state.selectedCusines
            || prevState.selectedDessertType != this.state.selectedDessertType
        ) {
            let filterApi = createfilterApi(this.state.selectedCusines, this.state.selectedDessertType)
            this.props.handleFilter(filterApi);
        }
        if (prevState.selectedLocation != this.state.selectedLocation) {
            let locationApi = createLocationApi(this.state.selectedLocation)
            this.props.handleDistrict(locationApi)
        }
    }//will make the filter api on changes to the filter

    //did not put the dessert and location condition in the update section
    render() {
        return (
            <Sider style={{ backgroundColor: '#212529', paddingTop: "20px" }}>
                <Divider style={{ color: 'white' }} orientation="right">
                    <Title level={3} style={{ color: "white" }}>Filter</Title>
                </Divider>
                <Row>
                    <Col offset={8} span={16}>
                        <FilterSelect
                            selectedCusine={this.state.selectedCusines}
                            selectedDessert={this.state.selectedDessertType}
                            selectedLocation={this.state.selectedLocation}
                            setFilter={this.setFilter}
                            setLocation={this.setLocation}
                        />
                    </Col>
                </Row>
                <Row justify="end" style={{ marginTop: 15 }}>
                    <Col span={12} offset={6}>
                        <Title level={5} >
                            <span style={{ color: "#d9d9d9" }}>
                                Cusines:
                            </span>
                            <CusineSelector
                                addCusines={this.addCusines}
                                selectedCusines={this.state.selectedCusines}
                                implementChange={this.props.handleSearch}
                            /></Title>
                    </Col>
                    <Col span={12} offset={6}>
                        <Title level={5} style={{ color: "#d9d9d9" }}>
                            Dessert type:
                            <DessertType
                                selectedDessert={this.state.selectedDessertType}
                                addDessert={this.addDessert}
                            />
                        </Title>
                    </Col>
                    <Col span={12} offset={6}>
                        <Title level={5} style={{ color: "#d9d9d9" }}>
                            Location:
                            <LocationSelector
                                selectedLocation={this.state.selectedLocation}
                                addLocation={this.addLocation}
                            /></Title>
                    </Col>
                </Row>

            </Sider>
        )
    }
}
// The section that show the filter
//------------------------------------------------------------------

function Find(prop) {
    function handleChange(value) {
        prop.handleSort(value)
    }

    return (
        <Select
            defaultValue="Most Rating"
            onChange={handleChange}
            style={{
                width: 150,
            }}
            options={[
                {
                    value: 'sort=Rating desc',
                    label: 'Most Rating',
                },
                {
                    value: 'sort=popularity desc',
                    label: 'Most Popular',
                },
                {
                    value: 'sort=popularity ',
                    label: 'Least Popular',
                },
                {
                    value: 'sort=Rating',
                    label: 'Least Rating',
                },
                {
                    value: "",
                    label: "A-Z"
                }
            ]}
        />
    )
}

function Review(prop) {

    function Vote() {
        if (prop.vote > 0) {
            return (<span
                style={{ color: `${green[6]}` }}>
                {prop.vote}
                <CaretUpOutlined />
            </span>)
        }
        else if (prop.vote < 0) {
            return (<span
                style={{ color: `#fa541c` }}>
                {prop.vote}
                <CaretDownOutlined />
            </span>)
        }
        else {
            return (<span
                style={{ color: `##bfbfbf` }}>
                0
            </span>)
        }
    }

    return (
        <Card
            className={Css.Review}
            loading={false}
        >
            <Meta
                avatar={<Avatar icon={<UserOutlined />}
                    src={require(`../accountImages/${prop.profile}`)} />}
                title={prop.username}
                description={prop.text}
            />
            <br />
            <Row>
                <Col span={8}>
                    Vote: <Vote />
                </Col>
                <Col span={8} offset={8}>
                    <span style={{ color: "#bfbfbf", fontSize: 11 }}>{prop.date}</span>
                </Col>
            </Row>

        </Card>

    )
}// the review template

function ShowReview(prop) {
    return (
        <>
            <Divider style={{ color: "white" }}>
                Popular Review
                <br />
                <span style={
                    {
                        color: "#d9d9d9",
                        fontSize: "10px"
                    }}>Tip: Hover it!</span>
            </Divider>

            <Reviews reviews={prop.reviews} />
        </>
    )
}// the section with the reviews

function Reviews(prop) {

    return (
        <div className={Css.ReviewsContainer}>
            {prop.reviews != 0 ? prop.reviews : <EmptyRemix />}
        </div>
    )
}//show the Result review if any 



export function RestaurantCard() {
    function Type(prop) {
        return (
            <div className={Css.Type2}>
                {prop.type}
            </div>
        )
    }

    return (
        <Card
            style={{ width: 200 }}
            cover={<Image width={200} src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png" />}
            className={Css.RestaurantCard}
        >
            <Meta title="Europe Street beat" />
            <Row>
                <Divider style={{ fontSize: 14 }}>
                    Type
                </Divider>
                <div className={Css.TypeContainer}>
                    <Type type="Japanese" />
                    <Type type="Korean" />
                    <Type type="bob" />
                    <Type type="Korean" />
                    <Type type="bob" />
                </div>
                <Col span={24}>
                    <Rate tooltips={["Cost"]} disabled character={<DollarCircleOutlined />} defaultValue={2} />
                </Col>
                <Col span={8}>
                    <Popover content={"Rating"}>
                        <div className={Css.RatingTag}>
                            3.4 <StarFilled style={{ color: `${yellow.primary}` }} />
                        </div>
                    </Popover>
                </Col>
                <Col span={8} offset={8} style={{ marginTop: 10 }}>
                    <Popover content={"Popularity"} style={{ color: "black" }}>
                        3000 <HeartFilled style={{ color: 'red' }} />
                    </Popover>
                </Col>
            </Row>
        </Card>

    )
}

export function RecommendRestaurant() {

    useEffect(() => {
        const ele = document.querySelector(`.${Css.RecommendRestaurant}`)
        ele.scrollTop = 100;
        ele.scrollLeft = 150;
        let pos = { top: 0, left: 0, x: 0, y: 0 };
        const mouseDownHandler = function (e) {
            ele.style.cursor = "grab"
            ele.style.userSelect = 'none';

            pos = {
                // The current scroll
                left: ele.scrollLeft,
                top: ele.scrollTop,
                // Get the current mouse position
                x: e.clientX,
                y: e.clientY,
            };

            const mouseMoveHandler = function (e) {
                // How far the mouse has been moved
                const dx = e.clientX - pos.x;
                const dy = e.clientY - pos.y;

                // Scroll the element
                ele.scrollTop = pos.top - dy;
                ele.scrollLeft = pos.left - dx;

            };

            const mouseUpHandler = function () {
                document.removeEventListener('mousemove', mouseMoveHandler);
                document.removeEventListener('mouseup', mouseUpHandler);
                document.addEventListener("mousedown", mouseDownHandler)

                ele.style.cursor = 'grab';
                ele.style.removeProperty('user-select');
            };

            document.addEventListener('mousemove', mouseMoveHandler);
            document.addEventListener('mouseup', mouseUpHandler);

        };
        document.addEventListener('mousedown', mouseDownHandler)
    }

    )

    return (
        <div className={Css.RecommendRestaurant}>
            <RestaurantCard />
            <RestaurantCard />
            <RestaurantCard />
            <RestaurantCard />
            <RestaurantCard />
            <RestaurantCard />
            <RestaurantCard />

        </div>
    )
}//implement the recommend function

function FooterRemix() {
    return (
        <Row>
            <Col span={24}>
                <Divider style={{ color: "white" }} orientation="left" >
                    Recommended Restaurant For You
                </Divider>
            </Col>
            <Col span={24}>
                <RecommendRestaurant />
            </Col>
        </Row>

    )
}

export function RestaurantPage() {
    const [filter, setFilter] = useState("filter=&");
    const [search, setSearch] = useState("search=&");
    const [district, setDistrict] = useState("district=&")
    const [sort, setSort] = useState("sort=Rating desc")

    //setting up handler to handle the search
    function handleSearch(newsearch) {
        setSearch(newsearch);
    }

    function handleFilter(newFilter) {
        setFilter(newFilter);
    }

    function handleSort(newSort) {
        setSort(newSort);
    }

    function handleDistrict(newLocation) {
        setDistrict(newLocation);
    }

    return (
        <>
            <Layout>
                <SiderRemix
                    handleFilter={handleFilter}
                    handleDistrict={handleDistrict}
                />
                <ContentRemix
                    api={`http://127.0.0.1:5000/Restaurant/getSearch?${filter}${search}${district}${sort}`}
                    handleSearch={handleSearch}
                    handleSort={handleSort}
                />
            </Layout>
            <br />
            <FooterRemix />
            <Footer />
        </>

    )
} 