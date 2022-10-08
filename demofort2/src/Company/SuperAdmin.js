import React, { useEffect, useState } from 'react';

import './SuperAdmin.css';

// 工作区组件
import MainPage from './MainPage';
import TabManage from './TabManage';
import DataManage from './DataManage';

// 公司总管理界面
export default function SuperAdmin() {
    // keyValue 强制刷新用
    const [keyValue, setKeyValue] = useState(0);

    // tool2函数 数组状态用
    function tool2(arr, arrFunc, index, value) {
        let box = arr;
        box[index] = value;
        arrFunc(box);
    }
    
    // 开场
    const [masks, setMasks] = useState(["super-admin-mask1", "super-admin-mask2"]);

    useEffect(() => {
        document.body.style.backgroundColor = "rgba(0, 0, 0, 0.75)";
        document.body.style.overflow = "hidden";
        setTimeout(() => {
            document.body.style.overflow = "hidden";
            setMasks(["none-display", "none-display"]);
            document.body.style.overflow = "auto";
            setKeyValue(keyValue + 1);
        },550)
    }, []);

    // 导航
    const [subDisplay, setSubDisplay] = useState(["none-display",]);
    const [currentBrench, setCurrentBrench] = useState(<MainPage />);
    function switchTo(brenchName) {
        if (brenchName === "MainPage") {
            setCurrentBrench(<MainPage />);
        } else if (brenchName === "TabManage") {
            setCurrentBrench(<TabManage />);
        } else if (brenchName === "DataManage") {
            setCurrentBrench(<DataManage />);
        }
    }


    return (
        <div>
            <div>
                <div className="guide-column ">
                    <span onClick={event => { switchTo("MainPage") } }>{"\u4E3B\u9875"}</span>
                    <span onMouseEnter={event => {
                        tool2(subDisplay, setSubDisplay, 0, "guide-sub-enter");
                        setKeyValue(keyValue + 1);
                    } }>
                        {"\u7BA1\u7406"}
                    </span>
                    <span>{"\u52A8\u6001"}</span>
                    <span>{"\u5176\u4ED6"}</span>
                    <span id="exit-span">{"\u9000\u51FA"}</span>
                </div>
                <ul key={keyValue + 2} className={"guide-sub manage-sub " + subDisplay[0]} onMouseLeave={event => {
                    tool2(subDisplay, setSubDisplay, 0, "guide-sub-leave");
                    setKeyValue(keyValue + 1);
                }}>
                    <li onClick={event => { switchTo("DataManage") }}>{"\u6570\u636E\u7BA1\u7406"}</li>
                    <li onClick={event => { switchTo("TabManage") }}>{"\u8868\u683C\u7BA1\u7406"}</li>
                </ul>
                <div className="brench-div">
                    {currentBrench}
                </div>
            </div>
            
            <div className={masks[0]} key={keyValue}></div>
            <div className={masks[1]} key={keyValue+1}></div>
        </div>
    )
}