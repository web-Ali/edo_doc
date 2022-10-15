import {Navigate, Route, Routes} from "react-router-dom";
import { authPageRoutes, publicPageRoutes } from "../../routing/routes";


const PageRouter = () => {
    const token = localStorage.getItem('token');
    // const token = true

    return (
        <>
            <Routes>
                {!token && publicPageRoutes.map(({ path, Component }) =>
                    <Route key={path} path={path} element={Component}  />
                )}
                {token && authPageRoutes.map(({ path, Component , Screens}) =>
                    <Route key={path} path={path} element={Component}  >
                        {
                            Screens && Screens.length > 0 && <>
                            {Screens.map(({ path, Component }) =>
                                (
                                    <Route key={path} path={path} element={Component}  />
                                )
                            )}
                            <Route  path={"*"} element={Screens[0].Component}  />
                            </>
                        }
                    </Route>
                )}
                <Route path='/' element={<Navigate to={token ? authPageRoutes[0].path : publicPageRoutes[0].path} />} />
            </Routes>
        </>
    );
};

export default PageRouter;

