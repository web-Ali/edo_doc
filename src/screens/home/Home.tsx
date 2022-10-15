import {signularisApi, useGetIndexNotificationsQuery} from "../../store/api/signularisApi";
import React, {useEffect, useState} from "react";
import {Alert, Button, Pagination, Result, Select, Skeleton, Space} from "antd";
import {Link} from "react-router-dom";
import { GetNotificationsRequest, NotificationType} from "../../types/types";
import {useAppDispatch} from "../../hooks/redux";


const { Option } = Select;



const Home = () => {
    const [skip, setSkip] = useState<number>(0);
    const [limit, setLimit] = useState<number>(20);
    const [currentPage, setCurrentPage] = useState<number>(1);

    let reqParams: GetNotificationsRequest = {
        skip: skip,
        limit: limit
    }

    const {data, isLoading, isError, refetch} = useGetIndexNotificationsQuery(reqParams,{
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true
    })

    const notifications = data?.notifications
    const count = data?.count


    const handleLimitOptionChange = (value: number) => {
        setLimit(value)
    }

    const handlePaginationChange = (value: number) => {
        setSkip(limit * (value - 1))
        setCurrentPage(value)
    }
    if (isError) return (
        <>
            <Result
                status="error"
                title="Не удалось загрузить уведомления"
                extra={[
                    <Button key="refetch" onClick={() => refetch()}>Обновить</Button>
                ]}
            />
        </>
    )

    if (isLoading) return (
        <>
            <Skeleton />
            <Skeleton />
            <Skeleton />
        </>
    )

    function linkurl (str : string, link: string) {
        return <Link to={link.slice(12)} >{str}</Link>
    }
    const typeNotificationConvert = (type: NotificationType) =>{
        switch (type){
            case "signed":
                return "success"
            case "info":
                return "info"
            case "rejected":
                return "error"
        }
    }
    const formatTime = (time: string) => {
        let tObj = new Date(time)
        let day = tObj.getDate().toString().length === 1 ? "0" + tObj.getDate() : tObj.getDate()
        let month = (tObj.getMonth()+1).toString().length === 1 ? "0" + (tObj.getMonth()+1 ): tObj.getMonth() +1
        let hours = tObj.getHours().toString().length === 1 ? "0" + tObj.getHours(): tObj.getHours()
        let minutes = tObj.getMinutes().toString().length === 1 ? "0" + tObj.getMinutes(): tObj.getMinutes()


        return <><span style={{fontWeight: '500'}}>{`${day}.${month}.${tObj.getFullYear()}`}</span> <span style={{fontStyle: 'italic'}}>{`${hours}:${minutes}`}</span></>
    }

    return  <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        {
            notifications?.length ?
                <>
                    <Select defaultValue={20} onChange={handleLimitOptionChange}>
                        <Option value={20}>20</Option>
                        <Option value={50}>50</Option>
                        <Option value={100}>100</Option>
                    </Select>
                {notifications.map(({type, text,link,createdAt}) =>
                <Alert
                    action={formatTime(createdAt)}
                    showIcon
                    message={linkurl(text,link)}
                    type={typeNotificationConvert(type)}/>
            ) }
                    <Pagination
                        current={currentPage}
                        total={count}
                        pageSize={limit}
                        onChange={handlePaginationChange}
                    />
                </>
                : <p>У вас нет уведомлений</p>
        }
    </Space>
};

export default Home;