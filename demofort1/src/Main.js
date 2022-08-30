import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import { useCookies } from 'react-cookie';

// ÍøÖ·Ö÷Ò³£¬Î´µÇÂ½
export default function Main() {
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies(['cookie-name']);

    const [islogin, setIslogin] = useState("\u60A8\u597D\uFF0C")

    useEffect(() => {
        if (cookies["name"]) {
            navigate("/login/in", {
                replace: true,

            })
        }
    }, [islogin])

    return (
        <div>
            <div>
                <h1>{islogin + "\u6B22\u8FCE!"}</h1>
                <h2>{"\u8BF7"}
                    <NavLink to="/login" >{"\u767B\u9646"}</NavLink>/
                    <NavLink to="/register" >{"\u6CE8\u518C"}</NavLink>
                </h2>
            </div>
        </div>
    )
}



/*
class Main extends React.Component {


    state = {
        islogin: "\u60A8\u597D\uFF0C",
    }

    

    render() {
        return (
            <div>
                <div>
                    <h1>{this.state.islogin + "\u6B22\u8FCE!"}</h1>
                    <h2>{"\u8BF7"}
                        <NavLink to="/login" >{"\u767B\u9646"}</NavLink>/
                        <NavLink to="/register" >{"\u6CE8\u518C"}</NavLink>
                    </h2>
                </div>
            </div>
            )
    }
    
}
*/
