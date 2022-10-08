
// api接口 
// useState 保存组件变量api
import React,{ useState,useEffect } from "react";
// useNavigate 切换页面api
import {useNavigate} from 'react-router-dom';

// 获取注册用请求函数
import { toSignUp } from '../netWork/Entry';

import "./SignUp.css";

// 函数式组件
export default function SignUp() {
  // 新建路由操作器
  const navigate = useNavigate();

  // keyValue 强制刷新用
  const [keyValue,setKeyValue] = useState(0);

  // tool1函数 对象状态用
  function tool1(obj,objFunc,type,value){
    let box = obj;
    box[type] = value;
    objFunc(box);
  }

  // tool2函数 数组状态用
  function tool2(arr,arrFunc,index,value){
    let box = arr;
    box[index] = value;
    arrFunc(box);
  }

  // 阻止页面滚动
  useEffect(()=>{
      document.body.style.overflow="hidden";
  },[])

  // 退出重新激活
  useEffect(()=>{
    return ()=>{
      document.body.style.overflow="auto";
    }
},[])

  // 初始化变量
  // 类名变量
  const [maskState,setMaskState] = useState("mask-div-enter");
  const [buttonState,setButtonState] = useState("sign-up-btn");
  const [securityLevelUl,setSecurityLevelUl] = useState(
    ["none-display","","",""]
  );
  const [correct,setCorrect] = useState("none-display");

  // 存储信息
  
  const [data,setData] = useState({
    name:"",
    adress:"",
    tele:"",
    emailAdress:"",
    hash:"",
    hash_1:""
  })

  // 判断安全等级
  function securityJudge(register=false){
    if (!data.hash){
        tool2(securityLevelUl,setSecurityLevelUl,0,"none-display");
        setKeyValue(keyValue + 1);
        return false
    }
    let stuff = [0,0,0,0,0];
    let re = [/\d+/,/[a-z]+/,/[A-Z]+/,/[\x21-\x2f\x3a-\x40\x5b-\x60\x7B-\x7F]/];
    for (let i = 0; i < re.length ; i++){
      if (re[i].test(data.hash)){
        stuff[i] = 1;
      }
    }
    if (data.hash.length >= 8){
      stuff[4] = 1;
    } else if (register) {
      alert("\u5BC6\u7801\u4E0D\u5F97\u5C0F\u4E8E\u516B\u4F4D\uFF01");
      return false
    }
    let level = 0;
    for (let i in stuff){
      if (stuff[i]){
        level++;
      }
    }
    for (let i = 0; i < 5 ; i++){
      tool2(securityLevelUl,setSecurityLevelUl,i,"");
    }
    tool2(securityLevelUl,setSecurityLevelUl,(parseInt((level-1)/2)+1),"white");
    setKeyValue(keyValue + 1);
    return true
  }


    // 注册按钮触发
    const [successTxt, setSuccessTxt] = useState("none-display");

    async function register() {
    for (let type in data){
      if (data[type] === ""){
        alert("\u8BF7\u5B8C\u5584\u4FE1\u606F !");
        return
      }
    }
    if ( data.hash !== data.hash_1){
      alert("\u5BC6\u7801\u4E0D\u4E00\u81F4\uFF0C\u8BF7\u4FEE\u6539 !");
      return 
    } else {
        let result = await toSignUp(data);
        if (result) {
            setSuccessTxt("success-sign-up");
            goTo("/signIn");
        } else {
            alert("\u5DF2\u5B58\u5728\u540C\u540D\u516C\u53F8 \uFF01");
        }
    }
    
  }
  
  // 确认密码
  function verifyPassword(){
    if (data.hash !== ""){
      if (data.hash === data.hash_1){
        setCorrect("correct");
      } else {
        setCorrect("none-display");
      } 
    } else {
      setCorrect("none-display");
    }
    
  }

    // 跳转函数
    function goTo(url) {
        setMaskState("mask-div-quit");
        setButtonState("none-display");
        setTimeout(() => {
            navigate(url, {
                replace: true,
            })
        }, 700)
    }

  // return 虚拟DOM
  return (
  <div>

    <div id="signin-in-win">
    <div>
      <div className="style1 active-input">{"\u516C\u53F8\u540D\u79F0\uFF1A"}
      <input type="text" onChange={
        (event)=>{
          tool1(data,setData,"name",event.target.value);
        }
      } /></div>
      <div className="style1">{"\u516C\u53F8\u5730\u5740\uFF1A"}
      <input type="text" onChange={
        (event)=>{
          tool1(data,setData,"adress",event.target.value);
        }
      }/></div>
      <div className="style1">{"\u516C\u53F8\u7535\u8BDD\uFF1A"}
      <input type="text" onChange={
        (event)=>{
          tool1(data,setData,"tele",event.target.value);
        }
      }/></div>
      <div className="style1">{"\u516C\u53F8\u90AE\u7BB1\uFF1A"}
      <input type="text" onChange={
        (event)=>{
          tool1(data,setData,"emailAdress",event.target.value);
        }
      }/></div>
      <div className="style1">{"\u8D26\u6237\u5BC6\u7801\uFF1A"}
      <input type="password" onChange={
        (event)=>{
            tool1(data,setData,"hash",event.target.value);
            securityJudge();
            verifyPassword();
        }
      }/>
      <ul id="security-level" className={securityLevelUl[0]} key={keyValue}>
        <li className={securityLevelUl[1]} >{"\u4F4E"}</li>
        <li className={securityLevelUl[2]} >{"\u4E2D"}</li>
        <li className={securityLevelUl[3]} >{"\u9AD8"}</li>
      </ul>
      </div>
      <div className="style1">{"\u786E\u8BA4\u5BC6\u7801\uFF1A"}
      <input type="password" onChange={
        (event)=>{
          tool1(data,setData,"hash_1",event.target.value);
          verifyPassword()
        }
      }/>
      <div className={correct}>{"\u221A"}</div>
      </div>
    </div>
      {/*注册*/}
      <div className="submit-btn btn-style1">
        <button onClick={
          (event)=>{
              if (securityJudge(true)) {
                  register();
              } else {
                  alert("\u8BF7\u5B8C\u5584\u4FE1\u606F !");
              }
            
          }
        }>
          {"\u6CE8 \u518C"}
          <div></div>
        </button>
      </div>
    </div>
    {/*>>登录*/}
    <div className={"btn-style1 "+ buttonState} >
        <button onClick={
          (event) => {
              goTo("/signIn");
          }
        }>
          {">>\u767B \u5F55"}
          <div></div>
        </button>
        <button id="back-main-btn" onClick={
           (event) => {
               goTo("/");
           }
        }>
          {">>\u9996 \u9875"}
          <div></div>
        </button>
      </div>
          <div className={maskState}>
              <div className={successTxt}>
                  {"\u6CE8\u518C\u6210\u529F \uFF01"}
              </div>
          </div>
  </div>
  );

}


