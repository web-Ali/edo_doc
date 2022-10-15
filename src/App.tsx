import PageRouter from "./components/Routes/PageRouter";
import axios from "axios";
import { useEffect } from "react";
import { TokenInfo } from "./types/types";
import {useNavigate} from "react-router-dom";
import {LOGIN_PAGE_ROUTE} from "./routing/consts";


function App() {

    let  navigate = useNavigate()


    useEffect(() => {
        const token = localStorage.getItem('token');
        const now = new Date().valueOf();

        if(token){
            axios.get<TokenInfo>(
                `/api/v1/gettokeninfo/${token}`, {headers: {'Authorization': `Bearer ${token}`}}
            )
                .then((response) => {
                    if (now - response.data.exp <= 86400) {
                        axios.get('/api/v1/getnewtoken', {headers: {'Authorization': `Bearer ${token}`}})
                            .then((generatedToken) => {localStorage.setItem('token', generatedToken.data.token)})
                            .catch((err) => {
                                localStorage.removeItem('token');
                                navigate(LOGIN_PAGE_ROUTE)
                            })
                    }
                })
                .catch(() => {
                    localStorage.removeItem('token');
                    navigate(LOGIN_PAGE_ROUTE)
                })
        }

    }, [])

    return (
        <div className="App">
            <PageRouter/>
        </div>

    );
}

export default App;
