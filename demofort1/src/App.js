import * as React from 'react';


import { useRoutes } from "react-router-dom"


// 所有页面

import Main from "./Main"
import Register from './Register';
import Login from './Login';
import LoginIn from './LoginIn';


import './App.css';

// 根组件：配置路由
export default function App() {
    const element = useRoutes([
        {
            path: "/",
            element: <Main />
        },
        {
            path: "/register",
            element: <Register />
        },
        {
            path: "/login",
            element: <Login />
        },
        {
            path: "/login/in",
            element: <LoginIn />
        }
    ])

    return (
            <div>
                <div>
                    {element}
                </div>
            </div>
            )

}


