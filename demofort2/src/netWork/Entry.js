
import axios from 'axios';

export async function toSignUp(params) {
    
    let result;

    await axios({
        method:"post",
        url:"http://127.0.0.1:8000/companys/info/",
        data: {
            companyName: params.name,
            companyEmail: params.emailAdress,
            companyAddress: params.adress,
            companyTele: params.tele,
            companyResume: "\u65E0",
            hash: params.hash,
        },
    }).then(response => {
        if (response.data.result === "already existed"){
            result = false;
        } else if (response.data.result === "done"){
            result = true;
        }
    }).catch(error => {
        if (error) {
            result = false;
        }
    })

    // 新建公司数据库
    if (result) {
        await axios({
            method: "post",
            url: "http://127.0.0.1:8000/datamanagement/operate/firstpost/",
            data: {
                companyName: params.name,
            }
        }).then(response => {
            if (response.data.result === "done") {
                result = true;
            } else {
                result = false;
            }
        }).catch(error => {
            if (error) {
                result = false;
            }
        })
    }


    return result;
}


