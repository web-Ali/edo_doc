import React from 'react'
import {NavLink} from "react-router-dom"
import {
    CREATE_DOCUMENT_ROUTE,
    HOME_ROUTE, META_DOCUMENT_LIST_ROUTE
} from "../../routing/consts"
import logo from '../../assets/images/logo-2.svg'
import style from './Navigation.module.scss'
import {CaretRightOutlined, FileAddOutlined, FileOutlined,  HomeOutlined} from '@ant-design/icons'
import {Badge, Collapse} from 'antd'
import { useGetDocumentCountQuery } from '../../store/api/signularisApi'

type ISubMenu = Array<{
    route: string,
    title: string,
    type: string,
    count: number | undefined
}>
type INavigationProps = {
    hideMenu: boolean,
    openMenu: () => void
}
type IMenu = Array<{
    route: string | null,
    title: string,
    icon: JSX.Element,
    subMenu?: ISubMenu
}>



const Navigation: React.FC<INavigationProps> = ({hideMenu,openMenu}) => {

    const newDocuments = useGetDocumentCountQuery('new',{
        pollingInterval: 60000
    })
    const signedDocuments = useGetDocumentCountQuery('signed',{
        pollingInterval: 60000
    })
    const declinedDocuments = useGetDocumentCountQuery('declined',{
        pollingInterval: 60000
    })
    const createdDocuments = useGetDocumentCountQuery('created',{
        pollingInterval: 60000
    })
    const viewDocuments = useGetDocumentCountQuery('view',{
        pollingInterval: 60000
    })

    const menu: IMenu = [
        {
            route: HOME_ROUTE,
            title: 'Главная',
            icon: <HomeOutlined />
        },
        {
            route: CREATE_DOCUMENT_ROUTE,
            title: 'Создать',
            icon: <FileAddOutlined />
        },
        {
            route: null,
            title: 'Документы',
            icon: <FileOutlined/>,
            subMenu: [
                {
                    route: META_DOCUMENT_LIST_ROUTE + '/new',
                    title: 'Входящие',
                    type: 'new',
                    count: newDocuments.data?.count
                },
                {
                    route: META_DOCUMENT_LIST_ROUTE + '/signed',
                    title: 'Подписанные',
                    type: 'signed',
                    count: signedDocuments.data?.count
                },
                {
                    route: META_DOCUMENT_LIST_ROUTE + '/declined',
                    title: 'Отклоненные',
                    type: 'declined',
                    count: declinedDocuments.data?.count
                },
                {
                    route: META_DOCUMENT_LIST_ROUTE + '/created',
                    title: 'Созданные',
                    type: 'created',
                    count: createdDocuments.data?.count
                },
                {
                    route: META_DOCUMENT_LIST_ROUTE + '/view',
                    title: 'Просматриваемые',
                    type: 'view',
                    count: viewDocuments.data?.count
                }
            ]
        },

    ]
    const {Panel} = Collapse;

    const navLinkClass = ({isActive}: any) : string | undefined =>{
        return  (isActive ? style.active : '') + ' ' + (hideMenu ? 'disabled-link' : '')

    }

    return (
        <div onClick={openMenu}  className={style.wrap  + ' ' + (hideMenu  ? style.hideMenu : '')}>
            <div className={style.logo}>
                <div className={style.imgWrap}>
                    <img src={logo} alt="logo"/>
                </div>
                <h5 className={style.title}>
                    ФГБОУ ВО "ГГНТУ им. акад. <br/> М.Д. Миллионщикова"
                </h5>
            </div>
            <h1>Документооборот</h1>

            <nav className={style.nav} >
                <ul>
                    {menu.map(item => (
                            <li key={item.route} className={style.listItem}>
                                {(!item.subMenu?.length && item.route) ?
                                    <NavLink to={item.route}
                                             className={navLinkClass}
                                    >
                                        <div className={style.title}>
                                            <div className={style.icon}>{item.icon}</div>
                                            <div className={style.text}>{item.title}</div>
                                        </div>
                                    </NavLink> :
                                    <Collapse
                                        defaultActiveKey={['1']}
                                        className={style.subMenu}
                                        expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
                                        expandIconPosition={'end'}

                                    >
                                        <Panel header={<div className={style.title}>
                                            <div className={style.icon}>{item.icon}</div>
                                            <div className={style.text}>{item.title}</div>
                                        </div>} key="1">
                                            <ul>
                                                {
                                                    item.subMenu?.map(subItem => (
                                                        <li key={subItem.route }>
                                                            <NavLink to={subItem.route}  className={navLinkClass}>
                                                                <div className={style.title}>
                                                                    <div className={style.text}><span>- {subItem.title}</span> <span className={style.count}>{subItem.count}</span></div>
                                                                </div>
                                                            </NavLink>
                                                        </li>
                                                    ))
                                                }
                                            </ul>
                                        </Panel>
                                    </Collapse>
                                }

                            </li>
                        )
                    )}

                </ul>
            </nav>
        </div>
    );
};

export default Navigation