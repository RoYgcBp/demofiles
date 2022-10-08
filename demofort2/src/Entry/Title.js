import React, { useState,useEffect } from 'react';
import { Unity, useUnityContext } from "react-unity-webgl";
import { useNavigate } from 'react-router-dom';

import "./Title.css";

export default function Title() {
    // 路由
    const navigate = useNavigate();

    // 锁定页面
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        }
    },[])

    // 背景
    const { unityProvider, unload, loadingProgression } = useUnityContext({
        loaderUrl: "Build/cubeBackground3.loader.js",
        dataUrl: "Build/cubeBackground3.data",
        frameworkUrl: "Build/cubeBackground3.framework.js",
        codeUrl: "Build/cubeBackground3.wasm",
    });

    const [loadingTxt, setLoadingTxt] = useState("0 %")
    const [loadingHidden, setLoadingHidden] = useState("")
    useEffect(() => {
        setLoadingTxt(parseInt(loadingProgression * 100) + " %");
    }, [loadingProgression])

    // 离开首页

    const [leftMask, setLeftMask] = useState("mask-left");
    const [rightMask, setRightMask] = useState("mask-right");

    async function goTo(url) {
        await unload();
        setLoadingHidden("none-display");
        if (url === "signIn/") {
            setLeftMask("mask-left2");
        } else if (url === "signUp/") {
            setRightMask("mask-right2");
        }
        setTimeout(() => {
            navigate(url, {
                replace: false,
            })
        }, 1000)
        
    }



    return (
        <div>
            <div id="title-win">
                <div id="intro">{"\u76F4\u89C2 \u9AD8\u6548 \u5F3A\u5927 \u5B89\u5168"}</div>
                <div id="btns-div">
                    <div className="btn-style1 sign-up-btn1"><button onClick={ event => { goTo("signIn/") } }>{"\u767B \u5F55"}<div></div></button></div>
                    <div className="btn-style1 sign-in-btn1"><button onClick={ event => { goTo("signUp/") }}>{"\u6CE8 \u518C"}<div></div></button></div>
                </div>
            </div>
            <div id="background">
                <Unity unityProvider={unityProvider} />
            </div>
            <div className={"mask " + leftMask}>
                
            </div>
            <div className={"mask " + rightMask}>
                <div id="loading" className={loadingHidden}>
                    {"\u52A0\u8F7D\u4E2D\uFF0C\u8BF7\u7A0D\u540E ... " + loadingTxt}
                </div>
            </div>
        </div>
    )
}
