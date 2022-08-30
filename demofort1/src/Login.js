import React, { useState } from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import axios from 'axios';
import { useCookies } from 'react-cookie';


// µÇÂ½½çÃæ
export default function Login() {
    const navigate = useNavigate();
    const [cookies, setCookie, removeCookie] = useCookies(['cookie-name']);

    const [state, setState] = useState({
        username: "",
        hash: "",
    })

    const [remind, setRemind] = useState("")

    function saveHeaders(type) {

        return (event) => {

            state[type] = event.target.value
        }

    }

    function submit() {
        if ((state.username) && (state.hash)) {
            axios({
                method: "POST",
                url: "http://127.0.0.1:8000/madmin/enterprises/ent/login/",
                data: {
                    username: state.username,
                    hash: state.hash,
                }
            }).then(response => {
                //console.log(response.data)
                if (response.data["result"] === "no") {
                    setRemind("\u7528\u6237\u540D\u6216\u5BC6\u7801\u4E0D\u6B63\u786E");
                } else if (response.data["result"] === "ok") {
                    setRemind("\u767B\u9646\u6210\u529F");
                    setCookie("name", response.data["name"], {
                        maxAge: 7200,
                    })
                    navigate("/login/in", {
                        replace: true,
                        
                    })
                }
            })
        } else {
            setRemind("\u7528\u6237\u540D\u6216\u5BC6\u7801\u4E0D\u80FD\u4E3A\u7A7A");
        }
    }


    return (
        <div>
            <NavLink to="/">{"\u8FD4\u56DE"}</NavLink><br />
            {"\u516C\u53F8\u8D26\u6237\u767B\u9646"}<br />
            {"\u7528\u6237\u540D\uFF1A"}<input type="text" onChange={saveHeaders('username')} /><br />
            {"\u5BC6\u7801\uFF1A"}<input type="password" onChange={saveHeaders('hash')} /><br />
            {remind}<br />
            <button onClick={submit}>{"\u767B\u9646"}</button>
        </div>
        )

}

/*
class Login extends React.Component {

    state = {
        username: "",
        hash: "",
        remind: "",

    }

    saveHeaders = (type) => {
        return (event) => {
            this.setState({
                [type]: event.target.value
            })
        }
    }

    submit = () => {
        if ((this.state.username) && (this.state.hash)) {
            axios({
                method: "POST",
                url: "http://127.0.0.1:8000/madmin/enterprises/ent/login/",
                data: {
                    username: this.state.username,
                    hash: this.state.hash,
                }
            }).then(response => {
                if (response.data["result"] === "no") {
                    this.setState({ remind: "\u7528\u6237\u540D\u6216\u5BC6\u7801\u4E0D\u6B63\u786E" })
                } else if (response.data["result"] === "ok") {
                    this.setState({ remind: "\u767B\u9646\u6210\u529F" })
                }
            })
        } else {
            this.setState({ remind: "\u7528\u6237\u540D\u6216\u5BC6\u7801\u4E0D\u80FD\u4E3A\u7A7A" })
        }
    }

    render() {
        return (
            <div>
                <NavLink to="/">{"\u8FD4\u56DE"}</NavLink><br />
                {"\u516C\u53F8\u8D26\u6237\u767B\u9646"}<br />
                {"\u7528\u6237\u540D\uFF1A"}<input type="text" onChange={this.saveHeaders('username')} /><br />
                {"\u5BC6\u7801\uFF1A"}<input type="password" onChange={this.saveHeaders('hash')} /><br />
                {this.state.remind}<br />
                <button onClick={this.submit}>{"\u767B\u9646"}</button>
            </div>
            )
    }

}*/



