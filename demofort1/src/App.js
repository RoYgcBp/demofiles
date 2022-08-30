import * as React from 'react';


import { useRoutes } from "react-router-dom"


// ����ҳ��

import Main from "./Main"
import Register from './Register';
import Login from './Login';
import LoginIn from './LoginIn';


import './App.css';

// �����������·��
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


