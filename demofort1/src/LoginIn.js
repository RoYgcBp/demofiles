import React, { useState,useEffect,createRef } from 'react';
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import { useCookies } from 'react-cookie';

import './LoginIn.css'

// 登陆成功界面
export default function LoginIn() {
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies(['cookie-name']);

    const [islogin, setIslogin] = useState(cookies["name"]);

    const [state, setState] = useState({
        grapename: "",
        resume: "",
        
    })

    function saveHeaders(type) {

        return (event) => {

            state[type] = event.target.value
        }

    }

    const groupNames = [
        (<option key={123} value={1}></option>)

    ];

    
    

    useEffect(() => {
        //console.log(islogin);
        if (!islogin) {
            navigate("/", {
                replace: true,
                
            })
        }
    }, [islogin])


    const [ismasked, setIsmasked] = useState("none-display")

    function newSubadmin(event) {
        //console.log(ismasked)
        setIsmasked("show")
    }
    function quit(event) {
        //console.log(event.target.className)
        if (event.target.className == "show") {
            setIsmasked("none-display")
        }
        
    }

    function exit() {
        removeCookie("name")
        navigate("/", {
            replace: true,

        })
    }




    return (
        <div>
            <div id='main-body'>
                <button onClick={exit}>{"\u9000\u51FA\u767B\u9646"}</button>
                <h1>{islogin + "\u7684\u603B\u7BA1\u7406"}</h1>
                <hr />
                    {/*
                     下辖管理员管理系统
                     */}
                <h2>{"\u4E0B\u8F96\u7BA1\u7406\u5458\u7BA1\u7406\u7CFB\u7EDF"}</h2>

                <div id='group-choice'>
                    {"\u5F53\u524D\u7BA1\u7406\u5458\u7EC4\uFF1A"}
                    <select defaultValue={null}>
                        <option value={null}>{"--\u8BF7\u9009\u62E9\u7BA1\u7406\u5458\u7EC4--"}</option>
                        {groupNames}
                    </select>
                    <button onClick={newSubadmin}>{"\u65B0\u5EFA\u7BA1\u7406\u5458\u7EC4"}</button>
                    <button>{"\u7BA1\u7406\u5458\u7EC4\u8BBE\u7F6E"}</button>
                </div>

                <div className="table-subadmins" style={{ display: 'block' }}>
                    <div id="table-subadmins-hearder">
                        <span>{"\u5E8F\u53F7"}</span>
                        <span>{"\u767B\u9646\u7528\u6237\u540D"}</span>
                        <span>{"\u5BC6\u7801"}</span>
                        <span>{"\u6743\u9650"}</span>
                        <span>{"\u64CD\u4F5C"}</span>
                    </div>
                    <div>
                        <span>{0}</span>
                        <span><input type='text' /></span>
                        <span><input type='password' /></span>
                        <button>{"\u6743\u9650\u8BBE\u7F6E"}</button>
                        <button>{"\u91CD\u7F6E\u5BC6\u7801"}</button>
                        <button>{"\u505C\u7528"}</button>
                        <button>{"\u5220\u9664"}</button>
                    </div>
                </div>
            </div>
            {/*
             新建管理员浮窗
             */}
            <div id='main-mask' className={ismasked} onDoubleClick={quit}>
                <div id='new-group-ui'>
                    <p>{"\u7BA1\u7406\u5458\u7EC4\u540D\u79F0\uFF1A"}</p><input type="text" onChange={saveHeaders('grapename')} /><br />
                    <p>{"\u8BBE\u5B9A\u521D\u59CB\u5BC6\u7801\uFF1A"}</p><input type="password" onChange={saveHeaders('resume')} /><br />
                    <p>{"\u7EC4\u522B\u9ED8\u8BA4\u6743\u9650\uFF1A"}</p>
                    <div><input type="checkbox" name="power" value="1" />{"\u7BA1\u7406\u4E0B\u5C5E\u5458\u5DE5\u8D44\u6599\u4FE1\u606F\u6570\u636E"}</div>
                    <div><input type="checkbox" name="power" value="2" />{"\u7BA1\u7406\u4E0B\u5C5E\u7BA1\u7406\u5458\u8D26\u6237\u6570\u636E"}</div>
                    <div><input type="checkbox" name="power" value="3" />{"\u7BA1\u7406\u672C\u90E8\u95E8\u53CA\u5176\u4E0B\u5C5E\u90E8\u95E8\u6570\u636E\u8868\u5C5E\u6027"}</div>
                    <br /><p>{"\u4E0A\u5C5E\u7BA1\u7406\u5458\u7EC4\uFF1A"}</p>
                    <select defaultValue={null}>
                        <option value={null}>{"\u603B\u7BA1\u7406"}</option>
                        {groupNames}
                    </select>
                    <p>{"\u4E0B\u5C5E\u7BA1\u7406\u5458\u7EC4\uFF1A"}</p>
                    <select defaultValue={null}>
                        <option value={null}>{"\u65E0"}</option>
                        {groupNames}
                    </select>
                </div>
            </div>



        </div>
    )
}