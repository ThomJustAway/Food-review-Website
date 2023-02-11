import React, { useRef, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Card, Avatar, Tabs, Button, Popover, Empty, Modal, Input, message } from "antd";
import { SearchOutlined, CommentOutlined, StopOutlined, UserAddOutlined, UserDeleteOutlined } from "@ant-design/icons"
import Meta from "antd/es/card/Meta";
import { Link } from "react-router-dom";
import { TextingModal } from "../texting";
let load;

export function AddFriendBtn(prop) {
    const user = prop.user;
    const [isFollowing, setFollowing] = useState(prop.following);

    useEffect(() => {
        setFollowing(prop.following);
    }, [prop.following])

    function Follow() {
        fetch(`http://127.0.0.1:5000/Account/followAccount/${user.id}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem("Idtoken")}`,
            }
        }).then(() => {
            message.success(`You have started to follow ${user.username}`);
            setFollowing(true);
            if (load !== undefined) load();
        })
    }

    function unfollow() {
        fetch(`http://127.0.0.1:5000/Account/unfollowAccount/${user.id}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem("Idtoken")}`,
            }
        }).then(() => {
            message.success(`You have unfollow ${user.username}`);
            setFollowing(false);
            if (load !== undefined) load();
        })
    }

    return (
        <>
            {isFollowing ?
                <Button
                    type="default"
                    icon={<UserDeleteOutlined />}
                    onClick={unfollow}
                /> :
                <Button
                    type="primary"
                    icon={<UserAddOutlined />}
                    onClick={Follow}
                />}
        </>
    )
}

function PeopleCard(prop) {
    const people = prop.people
    const [texting, SetTexting] = useState(false)
    let image, name, follow, id, user;
    let textingBlockingFeature = (
        <>
            <Popover title="Chat">
                <Button type="text"
                    icon={<CommentOutlined />}
                    onClick={(e) => {
                        e.preventDefault()
                        SetTexting(true)
                    }}
                />
            </Popover>
            <Popover title="Block">
                <Button type="text"
                    icon={<StopOutlined />} />
            </Popover>
        </>
    )
    if (prop.type === "follower") {
        image = people.followerProfile;
        name = people.followerUsername;
        id = people.followerAccountId
        user = {
            id: people.followerAccountId,
            name: people.followerUsername
        }
        if (prop.following === null) {
            follow = (<AddFriendBtn
                user={{
                    id: people.followerAccountId,
                    username: people.followerUsername
                }}
                following={false}
            />);
        }
        else {
            let following = JSON.parse(prop.following)
                .find(element => {
                    return element.followingAccountID === people.followerAccountId
                })

            follow = (<AddFriendBtn
                user={{
                    id: people.followerAccountId,
                    name: people.followerUsername
                }}
                following={following !== undefined}
            />);

        }

    }
    else if (prop.type === "following") {
        image = people.followingProfile;
        name = people.followingUserName;
        id = people.followingAccountID
        user = {
            id: people.followingAccountID,
            name: people.followingUserName
        }
        follow = (
            <AddFriendBtn
                user={{
                    id: people.followingAccountID,
                    name: people.followingUserName
                }}
                following={true}
            />
        )
    }
    else if (prop.type === "Preview Follower") {
        image = people.followerProfile;
        name = people.followerUsername;
        id = people.followerAccountId
        textingBlockingFeature = [];
        follow = [];
    }
    else {
        image = people.followingProfile;
        name = people.followingUserName;
        id = people.followingAccountID
        textingBlockingFeature = [];
        follow = [];
    }


    return (
        <>
            <motion.div
                initial={{ x: 700 }}
                animate={{ x: 0, transition: { duration: 0.3, delay: 0.7 } }}
                whileHover={{
                    scale: 1.02,
                }}
                style={{ cursor: "pointer" }}

            >
                <Link to={`/accountPreview/${id}`} >
                    <Card
                        style={{
                            marginBottom: "10px",
                        }}
                    >

                        <Meta
                            avatar={<Avatar src={require(`../../../accountImages/${image}`)} />}
                            title={name}
                            description={
                                <>
                                    {textingBlockingFeature}
                                    {follow}

                                </>
                            }
                        />
                    </Card>
                </Link>

            </motion.div >
            {texting &&
                <TextingModal
                    open={texting}
                    textingModal={SetTexting}
                    user={user}
                />}
        </>
    )
}

export function FollowTab(prop) {
    const [open, setOpen] = useState(false);
    const account = prop.account[0];
    load = prop.load;
    if (account === undefined) return null
    function close() {
        setOpen(false)
    }
    return (
        <motion.div
            initial={{ y: 500 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
        >
            <Card style={{
                marginTop: "20px",
                height: "400px",
                zIndex: 3,
                position: "relative"
            }}
            >
                <FindUserModal
                    open={open}
                    cancel={close}
                />
                <div
                    style={{
                        zIndex: 4,
                        position: "absolute",
                        top: "20px",
                        right: "20px"
                    }}
                >
                    <Popover
                        title="Search for User"
                    >
                        <Button
                            type="text"
                            icon={<SearchOutlined />}
                            onClick={() => setOpen(true)}
                        />
                    </Popover>
                </div>
                <Tabs
                    defaultActiveKey="1"
                    items={[
                        {
                            label: 'Follower',
                            key: '1',
                            children:
                                <FollowerTab
                                    accountFollower={account.Follower}
                                    accountFollowing={account.Following}
                                    isPreview={false}
                                />,
                        },
                        {
                            label: 'Following',
                            key: '2',
                            children:
                                <FollowingTab
                                    accountFollowing={account.Following}
                                    isPreview={false}
                                />,
                        },

                    ]}
                />
            </Card>
        </motion.div>
    )
}

function FollowerTab(prop) {
    let accountFollower = prop.accountFollower
    if (accountFollower === null) {
        accountFollower = <Empty />
    }
    else {
        if (prop.isPreview) {
            accountFollower = JSON.parse(accountFollower)
                .map((follower) => {
                    return (
                        <PeopleCard
                            key={follower.followerAccountId}
                            people={follower}
                            type="Preview Follower"
                            following={prop.accountFollowing}
                        />
                    )
                })
        }
        else {
            accountFollower = JSON.parse(accountFollower)
                .map((follower) => {
                    return (
                        <PeopleCard
                            key={follower.followerAccountId}
                            people={follower}
                            type="follower"
                            following={prop.accountFollowing}
                        />
                    )
                })
        }


    }
    //add the empty element if the thing does not exist

    return (
        <div style={{
            overflow: "hidden",
            paddingLeft: "10px",
            paddingRight: "10px"
        }}>
            {accountFollower}
        </div>
    )
}

function Usercard(prop) {
    const user = prop.user;
    return (
        <Card style={{
            marginBottom: "10px",
            position: "relative"
        }}>
            <Meta
                title={user.username}
                avatar={<Avatar src={require(`../../../accountImages/${user.profile}`)} />}
            />
            <div
                style={{
                    position: "absolute",
                    bottom: "10px",
                    right: "5px"
                }}
            >
                <AddFriendBtn
                    user={{
                        id: user.id,
                        username: user.username
                    }}
                    following={false}
                />
            </div>
        </Card>
    )
} //card found in the modal

function FindUserModal(prop) {
    const [result, setResult] = useState([])
    const [search, setSearch] = useState('')
    useEffect(() => {
        fetch('http://127.0.0.1:5000/Account/findAccount', {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${sessionStorage.getItem("Idtoken")}`,
                'Content-Type': 'application/json'
            }
            ,
            body: JSON.stringify({
                search: search
            })
        }
        ).then(res => res.json()).then(data => {
            let element = data.map(user => <Usercard
                key={user.id}
                user={user} />)
            setResult(element)
        })
    }, [prop.open, search])

    function onSearch(e) {
        setSearch(e.target.value)
    }

    return (
        <Modal
            open={prop.open}
            onCancel={prop.cancel}
            footer={[]}
        >
            <Card
                style={{
                    marginTop: "20px"
                }}
            >
                <Input
                    placeholder="Search for user"
                    prefix={<SearchOutlined />}
                    onChange={onSearch}
                />
                <Card
                    style={{
                        marginTop: "20px",
                        overflowY: "scroll",
                        height: "300px"
                    }}
                >
                    {result}
                </Card>
            </Card>
        </Modal>
    )
}// the search modal to find users

function FollowingTab(prop) {
    let following = prop.accountFollowing
    if (following === null) {
        following = <Empty />
    } else {
        if (prop.isPreview) {
            following = JSON.parse(following).map((people) =>
                <PeopleCard
                    key={people.followingAccountID}
                    people={people}
                    type="Preview Following"
                />)
        }
        else {
            following = JSON.parse(following).map((people) =>
                <PeopleCard
                    key={people.followingAccountID}
                    people={people}
                    type="following"
                />)
        }
    }
    return (
        <div style={{
            overflowX: "hidden",
            paddingLeft: "10px",
            paddingRight: "10px",
            overflowY: "scroll",
            height: "300px"
        }}>
            {following}
        </div>
    )
}

export function FollowingTabPreview(prop) {
    const [animateFinsh, setAnimateFinish] = useState(true)
    useEffect(() => {
        if (prop.account.length !== 0) {
            setAnimateFinish(false)

        }
    }, [prop.account])

    if (prop.account === undefined) return null
    const account = prop.account[0];
    if (account === undefined) return null

    return (
        <AnimatePresence onExitComplete={() => { setAnimateFinish(true) }}>
            {animateFinsh &&
                (<motion.div
                    initial={{ y: 500 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                    exit={{
                        y: 500, transition: { duration: 0.3 }
                    }}

                >
                    <Card style={{
                        marginTop: "20px",
                        height: "400px",
                        zIndex: 3,
                        position: "relative"
                    }}
                    >
                        <Tabs
                            defaultActiveKey="1"
                            items={[
                                {
                                    label: 'Follower',
                                    key: '1',
                                    children:
                                        <FollowerTab
                                            accountFollower={account.Follower}
                                            accountFollowing={account.Following}
                                            isPreview={true}
                                        />,
                                },
                                {
                                    label: 'Following',
                                    key: '2',
                                    children: <FollowingTab
                                        accountFollowing={account.Following}
                                        isPreview={true}
                                    />,
                                },

                            ]}
                        />
                    </Card>
                </motion.div>)}

        </AnimatePresence>
    )
}