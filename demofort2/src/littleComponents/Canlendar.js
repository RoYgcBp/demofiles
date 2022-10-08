import React, { useState,useEffect } from 'react';

import './Canlendar.css';

export default function Canlendar(props) {
    // 通过key值强制刷新
    const [keyValue, setKeyValue] = useState(10000);

    const [now, setNow] = useState(props.now);
    const [dateDataList, setDateDataList] = useState(props.dateDataList);

    useEffect(() => {
        changeDate();
        //console.log(now);
    },[])


    function changeDate() {
        //console.log(now);
        let box = [
            now.getFullYear(),
            now.getMonth() + 1,
            now.getDate(),
        ]
        now.setDate(1);
        box.push(now.getDay());
        now.setDate(box[2]);
        setDateDataList(box);
        props.returnNow(now);
        props.returnDate(box);
    }

    function calculateDays(year, month) {
        let isRn = false,
            days = 0;
        if ((year % 400 === 0) || (year % 4 === 0 && year % 100 !== 0)) {
            // 判断是否为闰年：能被400整除或者能被4整除，但不能被100整除
            isRn = true
        } else {
            isRn = false
        }
        if (month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month === 10 || month === 12) {
            // 1、3、5、7、8、10、12 每月31天
            days = 31
        } else if (month === 2) {
            if (isRn) {
                // 为闰年，则多一天为29天
                days = 29
            } else {
                days = 28
            }
        } else if (month === 4 || month === 6 || month === 9 || month === 11) {
            // 4、6、9、10、11
            days = 30
        }
        return days;
    }

    function changeDay(year, month, day) {
        now.setFullYear(year);
        now.setMonth(month - 1);
        now.setDate(day);
        changeDate();
        setKeyValue(keyValue + 1);
    }


    const makeDays = () => {
        
        let year = dateDataList[0],
            month = dateDataList[1],
            w = dateDataList[3],
            days = calculateDays(year, month),
            lastDays = 0,
            daysList = [];
            
        if (month === 1) {
            lastDays = calculateDays(year - 1, 12);
        } else {
            lastDays = calculateDays(year, month-1);
        }
        
        for (let i = 0; i < w; i++) {
            daysList.push(lastDays + i - w + 1);
        } for (let i = 1; i <= days; i++) {
            daysList.push(i);
        } for (let i = 1; i <= 42 - (w + days); i++) {
            daysList.push(i);
        }
        let box = [], totIndex = 0;
        for (let ulIndex = 0; ulIndex < 6; ulIndex++) {
            let lis = [];
            for (let liIndex = 0; liIndex < 7; liIndex++) {
                let index = ulIndex * 7 + liIndex;
                
                if ((totIndex < w)) {
                    lis.push(<li key={totIndex + keyValue * 4}><button className="gray" key={totIndex + keyValue}
                        onClick={(event) => {
                            if (month === 1) {
                                changeDay(year - 1, 12, daysList[index]);
                            } else {
                                changeDay(year, month - 1,daysList[index])
                            }
                        }}
                        
                        defaultValue={daysList[index]} >{daysList[index]}</button></li>);
                } else if (totIndex > (w + days - 1)) {
                    lis.push(<li key={totIndex + keyValue * 4}><button className="gray" key={totIndex + keyValue}
                        
                        onClick={(event) => {
                            if (month === 12) {
                                changeDay(year + 1, 1, daysList[index]);
                            } else {
                                changeDay(year, month + 1, daysList[index])
                            }
                        }}
                        defaultValue={daysList[index]} >{daysList[index]}</button></li>);
                } else if (daysList[index] === dateDataList[2]) {
                    lis.push(<li key={totIndex + keyValue*4} ><button className="red" key={totIndex + keyValue} 
                        
                        defaultValue={daysList[index]} >{daysList[index]}</button></li>);
                } else {
                    lis.push(<li key={totIndex + keyValue * 4}><button key={totIndex + keyValue}
                        onClick={(event) => {
                            changeDay(year, month, daysList[index])
                        }}
                        
                        defaultValue={daysList[index]} >{daysList[index]}</button></li>);
                }
                
                totIndex++;
            }
            box.push(<ul key={keyValue * 2 + ulIndex}>
                {lis}
            </ul>)
        }


        return (<div id="days">
            {box}
        </div>)
    }

    return (<div id="canlendar-win">
        <div className="center-div">
            <button key={keyValue * 3 + 3} className="change-month" onClick={(event) => {
                if (dateDataList[1] === 1) {
                    changeDay(dateDataList[0] - 1, 12, dateDataList[2]);
                } else {
                    changeDay(dateDataList[0], dateDataList[1]-1, dateDataList[2]);
                }
            }} >{"<"}</button>
            <input className="year-month" type="number" key={keyValue * 3 + 1} onChange={(event) => {
                now.setFullYear(event.target.value);
                now.setMonth(dateDataList[1]-1);
                changeDate();
                setKeyValue(keyValue + 1);
            }} defaultValue={dateDataList[0]} max={dateDataList[0] + 50} min={dateDataList[0] - 50} />{"\u5E74"}

            <input className="year-month" type="number" key={keyValue * 3 + 2} onChange={(event) => {
                now.setMonth(event.target.value-1);
                changeDate();
                setKeyValue(keyValue + 1);
            }} defaultValue={dateDataList[1]} max={12} min={1} />{"\u6708"}

            

            <button key={keyValue * 3 + 4} className="change-month" onClick={(event) => {
                if (dateDataList[1] === 12) {
                    changeDay(dateDataList[0] + 1, 1, dateDataList[2]);
                } else {
                    changeDay(dateDataList[0], dateDataList[1]+1, dateDataList[2]);
                }
            }}>{">"}</button>
        </div>
        <div className="center-div">
            <ul id="week">
                <li key={"1"}>{"\u5468\u5929"}</li>
                <li key={"2"}>{"\u5468\u4E00"}</li>
                <li key={"3"}>{"\u5468\u4E8C"}</li>
                <li key={"4"}>{"\u5468\u4E09"}</li>
                <li key={"5"}>{"\u5468\u56DB"}</li>
                <li key={"6"}>{"\u5468\u4E94"}</li>
                <li key={"7"}>{"\u5468\u516D"}</li>
            </ul>
        </div>
        {makeDays()}

    </div>)
}

