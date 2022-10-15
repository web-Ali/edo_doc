import {MenuFoldOutlined, MenuUnfoldOutlined, SettingOutlined, UserOutlined} from "@ant-design/icons";
import style from './Header.module.scss'
import React, {useContext, useEffect, useState} from "react";
import {Link, NavLink} from "react-router-dom";
import {HOME_ROUTE, SETTINGS_PROFILE_ROUTE} from "../../routing/consts";
import {GlobalContext} from "../../contexts";
import {Button,  Popover} from "antd";
import {useAppDispatch, useAppSelector } from "../../hooks/redux";
import { RootState } from "../../store/store";
import {useGetNotificationsMessageQuery, useGetSelfInfoQuery} from "../../store/api/signularisApi";
import { setnew } from "../../store/slices/userinfoSlice";
import { notification  } from "antd";
import { NotificationType } from "../../types/types";


type IHeadProps = {
    toogleMenu: () => void,
    hideMenu: boolean
}



function AvatarPopover() {

    const [exited, setExited] = useState(false);

    const handleExit = () => {
        localStorage.removeItem("token")
        setExited(true)
    }

    if (exited) {
        window.location.href = '/';
    }


    return (
        <>
            <Link to={HOME_ROUTE}>На главную</Link>
            <br />
            <Button type="link" style={{color: "red", padding: 0}} onClick={handleExit}>Выход</Button>
        </>
    )
}



const NotificationMessage = () => {

    const {data} =  useGetNotificationsMessageQuery(null, {
        refetchOnMountOrArgChange: true,
        pollingInterval: 5000
    })


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

    const openNotificationWithIcon = (type: NotificationType, text: string) => {
        notification[typeNotificationConvert(type)]({
            message: text,
            duration: 7
        });
    };
    useEffect(()=>{
        if(data){
            if (data.notifications){
                data.notifications.forEach(({type, text})=>{
                    openNotificationWithIcon(type,text)
                })
            }
        }
    },[data])
    return <>

    </>
}

const Header: React.FC<IHeadProps> = ({toogleMenu, hideMenu}) => {
    const userInfo = useAppSelector((state: RootState) => state.userinfo)


    const dispatch = useAppDispatch()
    const {data: newUsInfo} = useGetSelfInfoQuery()




    useEffect(() => {
        if (newUsInfo) {
            dispatch(setnew(newUsInfo))
        }

    }, [newUsInfo])

    const {title} = useContext(GlobalContext);


    return (
        <header>
            {userInfo.id && <NotificationMessage/> }
            <div className={style.wrapper}>
                <div className={style.headerLeft}>
                    <span onClick={toogleMenu} className={style.menuIcon}>
                        {hideMenu ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
                    </span>
                    <span className={style.pageTitle}>{title}</span>
                </div>
                <div className={style.headerRight}>
                    <span className={style.userName}>{`${userInfo.firstname} ${userInfo.lastname}`}</span>
                    <span className={style.userIcon}>
                            { /* @ts-ignore */ }
                        <Popover placement="bottom" trigger="click" content={AvatarPopover}>
                           <UserOutlined/>
                        </Popover>
                    </span>
                    <span className={style.settingIcon}><NavLink
                        to={SETTINGS_PROFILE_ROUTE}><SettingOutlined/></NavLink></span>
                </div>
            </div>
        </header>
    );
};

export default Header;