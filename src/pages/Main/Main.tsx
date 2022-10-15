import Navigation from "../../components/Navigation/Navigation";
import style from './Main.module.scss'
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {HOME_ROUTE, MAIN_PAGE_ROUTE} from "../../routing/consts";
import Header from "../../components/Header/Header";
import Scrollbars from "react-custom-scrollbars-2";
import {signularisApi} from "../../store/api/signularisApi";
import {useAppDispatch} from "../../hooks/redux";

const Main = () => {

    const [hideMenu, setHideMenu] = useState(false)

    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch()


    useEffect(() => {
        if (location.pathname === MAIN_PAGE_ROUTE) {
            navigate(HOME_ROUTE, {replace: true});
        }
        dispatch(signularisApi.util.invalidateTags(['documentCount']))
    }, [location.pathname]);


    const toogleMenu = () => {
        setHideMenu(toggle => !toggle)
    }
    const openMenu = () => {
        setHideMenu(false)
    }


    return (
        <div className={style.app + ' ' + (hideMenu ? style.hideMenu : '')}>
            <div className={style.nav}>
                <Navigation hideMenu={hideMenu} openMenu={openMenu}/>
            </div>
            <div onClick={toogleMenu} className={style.shadow}></div>

            <div className={style.content}>

                <Header hideMenu={hideMenu} toogleMenu={toogleMenu}/>
                <Scrollbars
                    autoHide
                    autoHeight
                    autoHeightMin={'90vh'}
                    style={{width: '100%'}}>
                    <main style={{paddingBottom: 200}}>
                        <Outlet/>
                    </main>
                </Scrollbars>
            </div>

        </div>
    );
};

export default Main;