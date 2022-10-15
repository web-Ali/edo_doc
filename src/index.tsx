import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/style/index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from "react-router-dom";
import {store} from "./store/store";
import { Provider } from 'react-redux';
import { GlobalContextProvider } from './contexts';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
        <Provider store={store}>
            <BrowserRouter>
                <GlobalContextProvider>
                        <App/>
                </GlobalContextProvider>
            </BrowserRouter>
        </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
