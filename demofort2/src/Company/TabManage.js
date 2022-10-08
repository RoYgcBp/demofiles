import React, { useState, useEffect } from 'react';

// 请求数据和表格函数
import { initTab, operateTab, sumbitNewFields } from '../netWork/Management';

// 小组件
import Canlendar from '../littleComponents/Canlendar'

import './TabManage.css';

export default function TabManage() {
    // keyValue 强制刷新用
    const [keyValue, setKeyValue] = useState(10000);

    // tool1函数 对象状态用
    function tool1(obj, objFunc, type, value) {
        let box = obj;
        box[type] = value;
        objFunc(box);
    }

    // tool2函数 数组状态用
    function tool2(arr, arrFunc, index, value) {
        let box = arr;
        box[index] = value;
        arrFunc(box);
    }

    // tool3函数 二维数组状态用
    function tool3(arr, arrFunc, index1 ,index2 , value) {
        let box = arr;
        box[index1][index2] = value;
        arrFunc(box);
    }

    

    // 存储状态变量
    const [companyName, setCompanyName] = useState("demoCompany");
    const [allTables, setAllTables] = useState([]);
    const [currentTab, setCurrentTab] = useState("");
    const [currentDesc, setCurrentDesc] = useState([]);
    const [descNumber, setDescNumber] = useState(0);

    // 初始化 -> 获得所有表格名
    async function getTablesName() {
        let result;
        result = await initTab(companyName);
        if (result) {
            
            setAllTables(result);
            setCurrentTab("\u804C\u5458\u603B\u8868");
            console.log(result);

        } else {
            alert("NetWork Error !");
        }
        return result;
    }
    


    // -> 获得员工表结构
    async function getCurrentDesc() {
        let result;
        result = await operateTab("desc_Tab", companyName, currentTab);
        if (result) {
            setCurrentDesc(result);
        } else {
            alert("NetWork Error !");
        }
        return result;
    }

    // 初始化 -> 获得所有表格名
    useEffect(() => {
        getTablesName();
        //console.log(currentTab);
    },[])

    // 监听当前表格
    useEffect(() => {
        if (currentTab) {
            setReTabName(currentTab);
            getCurrentDesc();
            setDeleteNid([]);
        }
    }, [currentTab]);

    // 切换当前表格
    const [allListDisplay, setAllListDisplay] = useState("none-display");

    // 添加表格
    const [isAddTab, setIsAddTab] = useState(false);

    // 所有表格列表 -> 添加表格
    const allTableList = (allTables) => {
        let box = [];
        for (let i = 2; i < allTables.length; i++) {
            box.push(
                <li key={keyValue + i} onClick={event => {
                    if (allTables[i][0] !== currentTab) {
                        setSaveBtn("none-display");
                        setDelBtn(((allTables[i][0] === "\u7BA1\u7406\u5458\u603B\u8868" || allTables[i][0] === "\u804C\u5458\u603B\u8868") ? "none-display" : ""));
                        setCurrentTab(allTables[i][0]);
                        setIsDelete(false);
                    }
                    
                }}>
                    {allTables[i][0]}
                </li>
            )
        }
        // 添加表格按钮
        box.push(<li key={keyValue + allTables.length + 1} className="red" onClick={event => {
            setIsAddTab(true);
        }}>
            {"\u65B0\u5EFA\u8868\u683C ..."}
        </li>)

        return (
            <div id="all-tab-div">
                <div id="all-tab-title" onMouseEnter={event => {
                    setAllListDisplay("ul-enter");
                    
                }}>{"\u516C\u53F8\u6570\u636E\u5E93"}</div>
                <ul className={allListDisplay} onMouseLeave={event => {
                    setAllListDisplay("ul-quit");
                    
                }}>
                    {box}
                </ul>
            </div>
        )

    }

    // 表格更名
    const [reTabName, setReTabName] = useState("");
    const changeTabname = (delBtn) => {

        if (delBtn === "none-display") {
            return currentTab;
        } else if (delBtn === "") {
            return (<input id="re-tab-name" type="text" key={keyValue * 9 - 1} onChange={event => {
                setReTabName(event.target.value);
                setSaveBtn("");
            }} defaultValue={reTabName} />)
        }
    }


    // 表格字段管理
    const [saveBtn, setSaveBtn] = useState("none-display");
    const [delBtn, setDelBtn] = useState("none-display");

    // tool3_1 监听更改
    function tool3_1(arr, arrFunc, index1, index2, value) {
        tool3(arr, arrFunc, index1, index2, value);
        setSaveBtn("");
        if (animStyles[animStyles.length - 1] === "desc-items-li-enter") {
            for (let i in animStyles) {
                tool2(animStyles, setAnimStyle, i, "");
            }
        }
        setAddtnAnim("");
        setKeyValue(keyValue + 1000);
    }
    // 表头
    const tableManageTitle = () => {
        let box = [], titles = [
            "\u5E8F\u53F7",
            "\u9879\u76EE\u540D",
            "\u6570\u636E\u7C7B\u578B",
            "\u80FD\u5426\u4E3A\u7A7A",
            "\u9ED8\u8BA4\u503C",
        ];
        for (let i in titles) {
            box.push(
                <li key={keyValue + i}>
                    {titles[i]}
                </li>
            )
        }

        return (
            <ul id="tab-manage-title" className="desc-items-li-enter">
                {box}
            </ul>
        )
    }

    // 项目名称
    const fieldName = (i) => {
        let nameInput;
        if (currentDesc[i][1] === "int" || currentDesc[i][0] === "\u5DE5\u53F7" || currentDesc[i][1] === "varchar(800)") {
            nameInput = (<input className="field-name" defaultValue={currentDesc[i][0]} key={keyValue * 2 + i} readOnly />)
        } else {
            nameInput = (<input className="field-name" onChange={event => {
                tool3(currentDesc, setCurrentDesc, i, 0, event.target.value);
                setSaveBtn("");
                //console.log(currentDesc,i);
            }} defaultValue={currentDesc[i][0]} key={keyValue * 2 + i} />)
        }
        return nameInput;
    }

    // 数据类型
    const typeSelections = (i) => {
        let box;
        if (currentDesc[i][1] === "int") {
            box = (<select className="type-name" defaultValue={currentDesc[i][1]} key={keyValue * 3 + i}>
                <option value={"int"}>{"\u5BC6\u7801"}</option>
            </select>)
        } else if (currentDesc[i][0] === "\u5DE5\u53F7") {
            box = (<select className="type-name" defaultValue={currentDesc[i][1]} key={keyValue * 3 + i}>
                <option value={"varchar(50)"}>{"\u5C0F\u6BB5\u6587\u672C"}</option>
            </select>)
        } else if (currentDesc[i][1] === "varchar(800)") {
            box = (<select className="type-name" defaultValue={currentDesc[i][1]} key={keyValue * 3 + i}>
                <option value={"varchar(800)"}>{"\u6743\u9650"}</option>
            </select>)
        } else {
            box = (<select className="type-name" onChange={event => {
                tool3(currentDesc, setCurrentDesc, i, 1, event.target.value);
                tool3(currentDesc, setCurrentDesc, i, 4, null);
                setSaveBtn("");
                saveCache(i);
                setIsDefault(true);
                setCurrentDefault(i);
                if (allListDisplay === "ul-enter") {
                    setAllListDisplay("ul-quit");
                }
                //console.log(currentDesc, i, event.target.value);
            }} defaultValue={currentDesc[i][1]} key={keyValue * 3 + i}>
                <option value={"varchar(50)"}>{"\u5C0F\u6BB5\u6587\u672C"}</option>
                <option value={"varchar(500)"}>{"\u5927\u6BB5\u6587\u672C"}</option>
                <option value={"float"}>{"\u6570\u5B57"}</option>
                <option value={"varchar(30)"}>{"\u65E5\u671F"}</option>
            </select>)
        }

        return (<span>
            {box}
        </span>)
    }

    //能否为空
    const [canNullStyle, setCanNullStyle] = useState([]);

    function initCanNullStyle(currentDesc) {
        let box = [],box2=[];
        for (let i = 1; i < currentDesc.length; i++) {
            if (currentDesc[i][2] === 'NO') {
                box.push("");
            } else {
                box.push("null-or-not-label2");
            }
            box2.push("desc-items-li-enter");
        }
        setCanNullStyle(box);
        // 列表加载动画
        setAnimStyle(box2);
        //console.log(animStyles);
    }

    useEffect(() => {
        setDescNumber(currentDesc.length - 1);
        initCanNullStyle(currentDesc);
        setKeyValue(keyValue + 1000);
    }, [currentDesc]);

    // 修改默认值
    const [isDefault, setIsDefault] = useState(false);
    const [currentDefault, setCurrentDefault] = useState(1);
    const [cacheDefault, setCacheDefault] = useState("");

    const [casheDate, setCasheDate] = useState("");
    const [now, setNow] = useState(new Date());
    const [dateDataList, setDateDataList] = useState([
        now.getFullYear(),
        now.getMonth() + 1,
        now.getDate(),
        0,
    ]);

    const changeDefaultDiv = (currentDesc, i) => {
        let title = "";
        let box = null;
        if (currentDesc[i]) {
            title = currentDesc[i][0];
            if (currentDesc[i][1] === "varchar(50)") {
                title += " \u5C0F\u6BB5\u6587\u5B57 (\u6700\u592750\u5B57)";
                box = (<textarea defaultValue={cacheDefault} onChange={event => {
                    tool3(currentDesc, setCurrentDesc, i, 4, event.target.value);
                    //console.log(currentDesc);
                }} maxLength="50" key={keyValue * 5 - i} />)
            } else if (currentDesc[i][1] === "varchar(500)") {
                title += " \u5927\u6BB5\u6587\u5B57 (\u6700\u5927500\u5B57)";
                box = (<textarea defaultValue={cacheDefault} onChange={event => {
                    tool3(currentDesc, setCurrentDesc, i, 4, event.target.value);
                    //console.log(currentDesc);
                }} maxLength="500" key={keyValue * 5 - 2 - i} />)
            } else if (currentDesc[i][1] === "float") {
                title += " \u6570\u5B57 ";
                box = (<input type="number" className="number-input" defaultValue={cacheDefault} onChange={event => {
                    tool3(currentDesc, setCurrentDesc, i, 4, event.target.value);
                    //console.log(currentDesc);
                }} key={keyValue * 5 - 3 - i} />)
            } else if (currentDesc[i][1] === "varchar(30)") {
                title += " \u65E5\u671F ";
                box = (
                    <div>
                        <input type="text" id="date-input" key={keyValue * 5 - 4 - i}
                            defaultValue={casheDate} readOnly />
                        <div className={"cal-position"}>
                            <Canlendar now={now} dateDataList={dateDataList}
                                returnNow={setNow.bind(this)}
                                returnDate={setDateDataList.bind(this)}
                            />

                        </div>
                        <div id="clear-date-btn" className="btn-style1">
                            <button className={"btn-style1-2"} onClick={event => {
                                setCasheDate(null);
                                setKeyValue(keyValue + 1000);
                            }}>{"\u6E05 \u7A7A"}<div></div></button>
                        </div>
                    </div>
                )
            } else if (currentDesc[i][1] === "int") {
                box = (<input type="password" className="number-input" defaultValue={cacheDefault} onChange={event => {
                    tool3(currentDesc, setCurrentDesc, i, 4, event.target.value);
                    //console.log(currentDesc);
                }} key={keyValue * 5 - 3 - i} />)
            }
        }
        

        return (
            <div id="default-div" className="ul-enter">
                <div className="center-div">
                    <p>{title}</p>
                </div>
                <div className="center-div">
                    {box}
                </div>
                <div id="default-btns">
                    <span className="btn-style1">
                        <button className={"btn-style1-2 green "} onClick={event => {
                            setIsDefault(false);
                            setSaveBtn("");
                            setCacheDefault("");
                            setKeyValue(keyValue + 1000);
                            if (currentDesc[i][1] === "varchar(30)") {
                                tool3(currentDesc, setCurrentDesc, i, 4, casheDate);
                            }
                            console.log(currentDesc);
                        } }>{"\u4FDD\u5B58\u7F16\u8F91"}<div></div></button>
                    </span>
                    <span className="btn-style1">
                        <button className={"btn-style1-2 red "} onClick={event => {
                            setIsDefault(false);
                            setCacheDefault("");
                            setCasheDate(null);
                            tool3(currentDesc, setCurrentDesc, i, 4, cacheDefault);
                            setKeyValue(keyValue + 1000);
                            console.log(currentDesc);
                        } }>{"\u8FD4 \u56DE"}<div></div></button>
                    </span>
                </div>
            </div>
        )
    }

    // 监测日期变化
    useEffect(() => {
        setCasheDate(dateDataList[0].toString() + " / " + dateDataList[1].toString() + " / " + dateDataList[2].toString());
        setKeyValue(keyValue + 1000);
    }, [dateDataList])


    // 保存原始值
    function saveCache(i) {
        let txt = currentDesc[i][4];
        //console.log(i, txt)
        setCacheDefault(txt);
        if (currentDesc[i][1] === "varchar(30)") {
            setCasheDate(txt);
            if (txt) {
                let box = txt.split(" / ");
                //console.log(box);
                now.setFullYear(parseInt(box[0]));
                now.setMonth(parseInt(box[1]) - 1);
                now.setDate(parseInt(box[2]));
                setDateDataList([
                    now.getFullYear(),
                    now.getMonth() + 1,
                    now.getDate(),
                    0,
                ]);
            }
        }
        
    }

    
    // 列表加载动画去除
    const [animStyles, setAnimStyle] = useState([]);
    const [addBtnAnim, setAddtnAnim] = useState("add-field-btn-anim");

    // 删除字段
    const [isDelete, setIsDelete] = useState(false);
    // 记录删除旧字段
    const [deleteNid, setDeleteNid] = useState([]);

    // 整个工作表
    const descList = (currentDesc, isDelete) => {
        let box = [],btnStyle;
        let cantDelect = 1;
        if (allTables[0]) {
            if (currentTab === "\u7BA1\u7406\u5458\u603B\u8868") {
                cantDelect = 4;
            } else if (currentTab === "\u804C\u5458\u603B\u8868") {
                cantDelect = 2;
            }
        }
        
        
        for (let i = 1; i < currentDesc.length; i++) {
            if (!isDelete) {
                // 编辑查看
                btnStyle = (<button className="default-btn btn-style1-2" onClick={event => {
                    saveCache(i);
                    setIsDefault(true);
                    setCurrentDefault(i);
                    if (allListDisplay === "ul-enter") {
                        setAllListDisplay("ul-quit");
                    }
                }}>{"\u7F16\u8F91\u67E5\u770B"}<div></div></button>)
            } else {
                // 删除项目
                btnStyle = (<button className={"default-btn btn-style1-2 red " + ((cantDelect > 0) ? "none-used" : "")} onClick={event => {
                    let box = currentDesc, box2 = deleteNid;
                    box.splice(i, 1);
                    let deleteLength = box2.length,font = 0;
                    if (deleteLength) {
                        for (let i in deleteNid) {
                            if (deleteNid[i] >= i) {
                                font++;
                            }
                        }
                    }
                    if (i + font <= descNumber) {
                        box2.push(i + font);
                    }
                    console.log(descNumber);
                    setDeleteNid(box2);
                    setCurrentDesc(box);
                    setSaveBtn("");
                    setKeyValue(keyValue + 1000);
                }}>{"\u5220\u9664\u9879\u76EE"}<div></div></button>);
                cantDelect--;
            }
            let cantNull = false;
            if (currentDesc[i][1] === "int" || currentDesc[i][0] === "\u5DE5\u53F7" || currentDesc[i][1] === "varchar(800)") {
                cantNull = true;
            }
            let nullInput = (<span>
                <input id={"null-or-not" + i} className="null-or-not none-used" type="checkbox" />
                <label htmlFor={"null-or-not" + i} className={"null-or-not-label1 none-used" + canNullStyle[i - 1]}></label>
            </span>);
            if (!cantNull) {
                nullInput = (<span>
                    <input id={"null-or-not" + i} className="null-or-not" type="checkbox" onClick={event => {
                        let style = canNullStyle[i - 1] === "" ? "null-or-not-label2" : "";
                        tool2(canNullStyle, setCanNullStyle, (i - 1), style);
                        tool3_1(currentDesc, setCurrentDesc, i, 2, (style === "" ? "NO" : "YES"));
                    }} />
                    <label htmlFor={"null-or-not" + i} className={"null-or-not-label1 " + canNullStyle[i - 1]}></label>
                </span>)
            }
            box.push(
                <li key={keyValue * 4 + i} className={animStyles[i - 1]}>
                    <div className={"mask-delete" + (isDelete ? "" : "none-display")}></div>
                    <span className="field-nid">{i}</span>
                    {fieldName(i)}
                    {typeSelections(i)}
                    {nullInput}

                    <span className="btn-style1">
                        {btnStyle}
                    </span>
                </li>
            )
        }
        return (
            <ul id="desc-items-tab" key={keyValue * 4 - 1} >
                {box}
            </ul>
        )
    }

    // 增加字段
    function addField(currentDesc) {
        let box = currentDesc;
        box.push(['\u65B0\u9879\u76EE', 'varchar(50)', 'NO', '', null, '']);
        setCurrentDesc(box);
    }

    
    // 验证界面
    const [isVerify, setIsVerify] = useState(false);
    const [password, setPassword] = useState("");
    const [newTab, setNewTab] = useState({
        name: "\u65B0\u589E\u8868\u683C",
        type: "0",
    });

    // 进入验证界面前检查
    function checkFields() {
        let fieldsNames = [];
        for (let i in currentDesc) {
            if (fieldsNames.indexOf(currentDesc[i][0]) != -1) {
                alert("\u5B58\u5728\u91CD\u590D\u7684\u540C\u540D\u9879\u76EE \uFF01");
                return false;
            }
            fieldsNames.push(currentDesc[i][0]);
        }
        return true;
    }

    // 创建新表格
    async function createNewtab() {
        let result, field = [];
        if (newTab.type === "0") {
            field.push(["\u5DE5\u53F7", 'varchar(50)','not null',''])
        }
        result = await operateTab("new_Tab", companyName, newTab.name, field);
        return result;
    }

    // 删除表格
    const [isDeleteTab, setIsDeleteTab] = useState(false);
    async function dropTab() {
        let result;
        result = await operateTab("del_Tab", companyName, currentTab);
        return result;
    }


    // 提交更改
    async function submitVerification() {
        let newDesc = currentDesc;
        let oldDesc = await operateTab("desc_Tab", companyName, currentTab);
        //console.log(oldDesc, newDesc);
        console.log(reTabName, currentTab);
        
        let result = true;
        await sumbitNewFields(companyName, currentTab, oldDesc, newDesc, deleteNid, reTabName).then(result => { result = result });
        //console.log(oldDesc, newDesc, deleteNid, result);
        return result;
    }

    // 重新获取所有表格
    function regetTablesName() {
        let result;
        setTimeout(() => {
            result = getTablesName();
        }, 500);
        console.log(result);
    }

    return (
        <div>
            <div id="all-tab">
                <span>{allTableList(allTables)}</span>
                <span className={(isAddTab) ? "none-display" : ""}>
                    <span id="current-tabname" >
                        {"\u5F53\u524D\u5DE5\u4F5C\u8868 \uFF1A"}{changeTabname(delBtn)}
                    </span>
                    <span className="btn-style1">
                        <button className={"btn-style1-2 green " + saveBtn} style={{ marginLeft: "50px" }} onClick={event => {
                            if (checkFields()) {
                                setDelBtn("none-display");
                                setIsVerify(true);
                            }
                        
                        } }>{"\u4FDD\u5B58\u7F16\u8F91"}<div></div></button>
                    </span>
                    <span className="btn-style1">
                        <button className={"btn-style1-2 red " + delBtn} style={{ marginLeft: "50px" }} onClick={event => {
                            setIsDeleteTab(true);
                        } }>{"\u5220\u9664\u672C\u8868"}<div></div></button>
                    </span>
                </span>
            </div>
            <div id="desc-tab-div" className={(isDefault || isVerify || isAddTab || isDeleteTab) ?"none-display":""}>
                {tableManageTitle()}
                {descList(currentDesc, isDelete)}
                <div className={addBtnAnim}>
                    <div id="add-field-btn" className="btn-style1" key={keyValue * 3 - 1} >
                        <button className="btn-style1-2" onClick={event => {
                            setSaveBtn("");
                            addField(currentDesc);
                            initCanNullStyle(currentDesc);
                            //console.log(currentDesc);
                            setKeyValue(keyValue + 1000);
                        }}>{"\u6DFB\u52A0\u9879\u76EE"}<div></div></button>
                        <button className={"btn-style1-2 red " + (isDelete ? "none-display" : "")} onClick={event => {
                            setIsDelete(true);
                            initCanNullStyle(currentDesc);
                            //console.log(currentDesc);
                            setKeyValue(keyValue + 1000);
                        }}>{"\u5220\u9664\u9879\u76EE"}<div></div></button>
                        <button className={"btn-style1-2 " + (isDelete ? "" : "none-display")} onClick={event => {
                            setIsDelete(false);
                            initCanNullStyle(currentDesc);
                            //console.log(currentDesc);
                            setKeyValue(keyValue + 1000);
                        }}>{"\u8FD4 \u56DE"}<div></div></button>
                    </div>
                </div>
                
            </div>
            
            {/*默认值窗口*/}
            <div className={isDefault ? "" : "none-display"}>
                {changeDefaultDiv(currentDesc, currentDefault)}
            </div>
            {/*验证窗口*/}
            <div className={"ul-enter " + ((isVerify || isAddTab || isDeleteTab) ? "" : "none-display")}>
                
                <div id="verify-title" className={"center-div " + ((isAddTab) ? "none-display" : "")}>
                    {"\u8BF7\u518D\u6B21\u8F93\u5165\u5BC6\u7801\u4EE5\u7EE7\u7EED\u64CD\u4F5C"}
                </div>
                <div id="new-tab-title" className={((isAddTab) ? "" : "none-display")}>
                    <div className={"center-div"}>
                        {"\u65B0\u8868\u683C\u540D :"}
                        <input type="text" className="new-tab-name" onChange={event => {
                            tool1(newTab, setNewTab, "name", event.target.value);
                        }} defaultValue={newTab.name} />
                    </div>
                    <div className={"center-div"}>
                        {"\u8868\u683C\u7C7B\u578B :"}
                        <select className="new-tab-type" onChange={event => {
                            tool1(newTab, setNewTab, "type", event.target.value);
                        }} defaultValue={newTab.type}>
                            <option value={"0"}>{"\u4EBA\u4E8B\u8868"}</option>
                            <option value={"1"}>{"\u6570\u636E\u8868"}</option>
                        </select>
                    </div>
                    <div className={"center-div"}>
                        {"\u8BF7\u518D\u6B21\u8F93\u5165\u5BC6\u7801\u4EE5\u7EE7\u7EED\u64CD\u4F5C"}
                    </div>
                </div>
                <div className="center-div">
                    <input type="password" className="number-input" onChange={event => {
                        setPassword(event.target.value);
                    }} defaultValue={password} />
                </div>
                <div className="center-div">
                    <span className="btn-style1" style={{ marginRight: "50px" }}>
                        {/*修改字段*/}
                        <button className={"green " + ((isAddTab || isDeleteTab) ? "none-display" : "")} onClick={event => {
                            if (submitVerification()) {
                                regetTablesName();
                                setIsVerify(false);
                            } else {
                                alert("network error!");
                            }
                        }}>{"\u63D0 \u4EA4"}<div></div></button>
                        {/*新建表格*/}
                        <button className={"green " + ((isAddTab) ? "" : "none-display")} onClick={event => {
                            let repeat = false;
                            for (let i in allTables) {
                                if (newTab.name === allTables[i][0]) {
                                    repeat = true;
                                }
                            }
                            if (!repeat) {
                                createNewtab();
                                regetTablesName();
                                setCurrentTab(newTab.name);
                                
                                setIsAddTab(false);
                            } else {
                                alert("\u5B58\u5728\u91CD\u590D\u7684\u540C\u540D\u8868\u683C \uFF01");
                            }
                        }}>{"\u521B \u5EFA"}<div></div></button>
                        {/*删除表格*/}
                        <button className={"red " + ((isDeleteTab) ? "" : "none-display")} onClick={event => {
                            dropTab();
                            regetTablesName();
                            setIsDeleteTab(false);
                            setDelBtn("none-display")
                        }}>{"\u5220 \u9664"}<div></div></button>
                    </span>
                    <span className="btn-style1">
                        <button onClick={event => {
                            setIsVerify(false);
                            setIsAddTab(false);
                            setIsDeleteTab(false);
                        } }>{"\u8FD4 \u56DE"}<div></div></button>
                    </span>
                </div>
            </div>
            <div id="mask-database" className={(isDefault || isVerify || isAddTab || isDeleteTab) ? "" : "none-display"}></div>
            
        </div>
    )
}