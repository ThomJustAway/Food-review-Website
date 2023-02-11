import React from "react";
import { Row, Col } from "antd"
import { FavouriteRestaurantCard2 } from "./loginAccount/FavouriteRestaurantCard";
import { FollowingTabPreview } from "./loginAccount/tabs/FollowerTabs";
import { useState } from "react";
import { useEffect } from "react";
import { PreviewProfile } from "./loginAccount";
import { useParams } from "react-router";
import { useRef } from "react";

export function PreviewAccount() {
    const [account, setaccount] = useState([]);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const token = sessionStorage.getItem("Idtoken");
    const userId = useRef(null)

    function gettingData(id) {
        fetch(`http://localhost:3000/Account/Preview/${id}`)
            .then(res => res.json())
            .then(data => {
                setaccount(data);
                setLoading(false);
            })
    }

    useEffect(() => {
        if (token != null) {
            fetch("http://localhost:3000/Account/Getid", {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            }).then(res => res.json())
                .then(
                    data => {
                        if (data === id) {
                            window.open(`http://localhost:3000/account`, "_self");
                        }
                        else {
                            userId.current = data
                            gettingData(id);
                        }
                    }
                )
        }
        else {
            gettingData(id)
        }

    }, [id])

    return (
        <Row >
            <Col span={11} offset={1}>
                <Row>
                    <Col span={24}>
                        <PreviewProfile
                            account={account}
                            loading={loading}
                            userId={userId.current}
                        />
                    </Col>
                    <Col span={24}>
                        <FollowingTabPreview
                            account={account}
                            loading={loading}
                        />
                    </Col>
                </Row>

            </Col>
            <Col span={11} offset={1}>
                <FavouriteRestaurantCard2
                    account={account}
                    loading={loading}
                />
            </Col>
        </Row>
    )
}