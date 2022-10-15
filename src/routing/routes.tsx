import Login from "../pages/Login/Login";
import Main from "../pages/Main/Main";
import Home from "../screens/home/Home";
import {
    CREATE_DOCUMENT_ROUTE,
    HOME_ROUTE,
    LOGIN_PAGE_ROUTE,
    MAIN_PAGE_ROUTE,
    SETTINGS_PROFILE_ROUTE,
    TEMPLATES_CREATE_DOCUMENT_ROUTE, META_DOCUMENT_LIST_ROUTE, META_DOCUMENT_INFO_ROUTE
} from "./consts";
import CreateDocument from "../screens/createDocument/CreateDocument";
import Settings from "../screens/settings/Settings";
import Templates from "../screens/createDocument/Templates";
import MetadocList from "../screens/metaDocument/metadocList";
import MetaDocumentInfo from "../screens/metaDocument/metadocumentinfo";



interface routeType {
    path: string,
    Component: JSX.Element,
    Screens?: Array<routeType>
}

export const publicPageRoutes: routeType[] = [
    {
        path: LOGIN_PAGE_ROUTE,
        Component: <Login />
    }
]

export const authPageRoutes: routeType[] = [
    {
        path: MAIN_PAGE_ROUTE,
        Component: <Main />,
        Screens: [
            {
                path: HOME_ROUTE,
                Component: <Home />,
            },
            {
                path: META_DOCUMENT_LIST_ROUTE + '/:type',
                Component: <MetadocList />,
            },
            {
                path: META_DOCUMENT_INFO_ROUTE + '/:id',
                Component: <MetaDocumentInfo />,
            },
            {
                path: SETTINGS_PROFILE_ROUTE,
                Component: <Settings />
            },
            {
                path: CREATE_DOCUMENT_ROUTE,
                Component: <CreateDocument />
            },
            {
                path: TEMPLATES_CREATE_DOCUMENT_ROUTE,
                Component: <Templates />
            },
        ]
    }
]
