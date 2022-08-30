import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import axios from 'axios';
import { useCookies } from 'react-cookie';

// ×¢²á½çÃæ
export default function Register() {
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies(['cookie-name']);
    
    const [state, setState] = useState({
        name: "",
        address: "",
        tele: "",
        username: "",
        hash: "",
        repeat: "",
        resume: "",
        responses: "",
    })

    useEffect(() => {
        if (cookies["name"]) {
            navigate("/login/in", {
                replace: true,

            })
        }
    }, [state])

    function saveHeaders(type) {
        
        return (event) => {
            
            state[type] = event.target.value
        }
        
    }

    function submit() {
        if (state.hash !== state.repeat) {
            state.responses = "\u5BC6\u7801\u4E0D\u4E00\u81F4";
        } else {
            console.log(state);
            axios({
                method: "POST",
                url: "http://127.0.0.1:8000/madmin/enterprises/",
                data: {
                    name: state.name,
                    address: state.address,
                    tele: state.tele,
                    username: state.username,
                    hash: state.hash,
                    resume: state.resume,
                }
            }).then(response => {
                if (response.data["result"] === "already existed") {

                    state.responses = "\u5DF2\u6709\u540C\u540D\u516C\u53F8\u5DF2\u6CE8\u518C\uFF0C\u8BF7\u767B\u9646" 
                } else if (response.data["result"] === "done") {
                    state.responses = "\u6CE8\u518C\u6210\u529F";
                    navigate("/login", {
                        replace: true,
                        
                    })

                }

            }).catch(errors => {
                alert(errors);
            })
        }
    }

    return (
        <div>
            <div>
                <NavLink to="/">{"\u8FD4\u56DE"}</NavLink><br />
                {"\u516C\u53F8\u540D\u79F0\uFF1A"}<input type="text" onChange={saveHeaders('name')} /><br />
                {"\u516C\u53F8\u5730\u5740\uFF1A"}<input type="text" onChange={saveHeaders('address')} /><br />
                {"\u8054\u7CFB\u7535\u8BDD\uFF1A"}<input type="text" onChange={saveHeaders('tele')} /><br />
                {"\u516C\u53F8\u767B\u9646\u7528\u8D26\u6237\u540D\uFF1A"}<input type="text" onChange={saveHeaders('username')} /><br />
                {"\u8BBE\u7F6E\u767B\u9646\u5BC6\u7801\uFF1A"}<input type="password" onChange={saveHeaders('hash')} /><br />
                {"\u786E\u5B9A\u767B\u9646\u5BC6\u7801"}<input type="password" onChange={saveHeaders('repeat')} /><br />
                {"\u516C\u53F8\u7B80\u4ECB\uFF1A"}<input type="text" onChange={saveHeaders('resume')} /><br />
                {state.responses}<br />
                <button onClick={submit}>{"\u6CE8\u518C"}</button>
            </div>

        </div>
        )

}




/*
class Register extends React.Component {

    state = {
        name: "",
        address: "",
        tele: "",
        username: "",
        hash: "",
        repeat:"",
        resume: "",
        responses:"",
    }



    saveHeaders = (type) => {
        return (event) => {
            this.setState({
                [type]: event.target.value
            })
        }
    }

    switch = () => {
        const navigate = useNavigate();
        navigate("login", {
            replace: true,
            state: {
                username: this.state.username,

            }
        })
    }

    submit = () => {
        if (this.state.hash !== this.state.repeat) {
            this.setState({ responses: "\u5BC6\u7801\u4E0D\u4E00\u81F4" })
        } else {
            axios({
                method: "POST",
                url: "http://127.0.0.1:8000/madmin/enterprises/",
                data: {
                    name: this.state.name,
                    address: this.state.address,
                    tele: this.state.tele,
                    username: this.state.username,
                    hash: this.state.hash,
                    resume: this.state.resume,
                }
            }).then(response => {
                if (response.data["result"] === "already existed") {
                    
                    this.setState({ responses: "\u5DF2\u6709\u540C\u540D\u516C\u53F8\u5DF2\u6CE8\u518C\uFF0C\u8BF7\u767B\u9646" })
                } else if (response.data["result"] === "done") {
                    this.setState({ responses: "\u6CE8\u518C\u6210\u529F" });
                    this.switch();
                    
                }
                
            }).catch(errors => {
                alert(errors);
            })
        }
    }

    render() {
        return (
            <div>
                <div>
                    <NavLink to="/">{"\u8FD4\u56DE"}</NavLink><br />
                    {"\u516C\u53F8\u540D\u79F0\uFF1A"}<input type="text" onChange={this.saveHeaders('name')} /><br />
                    {"\u516C\u53F8\u5730\u5740\uFF1A"}<input type="text" onChange={this.saveHeaders('address')} /><br />
                    {"\u8054\u7CFB\u7535\u8BDD\uFF1A"}<input type="text" onChange={this.saveHeaders('tele')} /><br />
                    {"\u516C\u53F8\u767B\u9646\u7528\u8D26\u6237\u540D\uFF1A"}<input type="text" onChange={this.saveHeaders('username')} /><br />
                    {"\u8BBE\u7F6E\u767B\u9646\u5BC6\u7801\uFF1A"}<input type="password" onChange={this.saveHeaders('hash')} /><br />
                    {"\u786E\u5B9A\u767B\u9646\u5BC6\u7801"}<input type="password" onChange={this.saveHeaders('repeat')} /><br />
                    {"\u516C\u53F8\u7B80\u4ECB\uFF1A"}<input type="text" onChange={this.saveHeaders('resume')} /><br />
                    {this.state.responses}<br />
                    <button onClick={this.submit}>{"\u6CE8\u518C"}</button>
                </div>
                
            </div>
            )
    }

}
*/

