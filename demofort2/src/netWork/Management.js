
import axios from 'axios';

// �������ʼ��
export async function initTab(companyName) {

    let result;

    await axios({
        method: "post",
        url: "http://127.0.0.1:8000/datamanagement/operate/tablepost/",
        data: {
            headers: {
                dbname: companyName,
                action: "list_Tab",
            }
        }
    }).then(response => {
        //console.log(response.data.result);
        result = response.data.result;
    }).catch(error => {
        if (error) {
            result = false;
        }
        
    })

    return result;

}

// ��ṹ����
export async function operateTab(action, dbname, tabname, fields=[]) {

    let result;

    await axios({
        method: "post",
        url: "http://127.0.0.1:8000/datamanagement/operate/tablepost/",
        data: {
            headers: {
                action: action,
                dbname: dbname,
                tabname: tabname,
                fields: fields,
            }
        }
    }).then(response => {
        //console.log(response.data.result);
        result = response.data.result;
    }).catch(error => {
        if (error) {
            result = false;
        }
    });

    return result;
}

// ��ṹ�ύ -> ����¾ɲ�������
export async function sumbitNewFields(companyName, currentTab, oldDesc, newDesc, deleteNid, reTabName) {
    let result = true;
    if (reTabName !== currentTab) {
        await operateTab("rename_Tab", companyName, currentTab, reTabName);
    }

    // ɾ�����ֶ�
    let delFields = [];
    for (let i in deleteNid) {
        delFields.push([oldDesc[deleteNid[i]][0],]);
        oldDesc.splice(deleteNid[i], 1);
    }
    await operateTab("del_fields", companyName, currentTab, delFields).then(result => { result = result });
    // �����޸ľ��ֶ�
    let updateFields = [];
    for (let i in oldDesc) {
        let desc = newDesc[i];
        //console.log(desc);
        for (let index in desc) {
            if (desc[index] !== oldDesc[i][index]) {
                let defaultTxt = desc[4];
                if (desc[1].search("varchar") !== -1) {
                    defaultTxt = "'" + defaultTxt + "'";
                }
                
                if (index === "0") {
                    //console.log(index, oldDesc[i]);
                    updateFields.push([oldDesc[i][0], desc[0], desc[1], ((desc[2] === 'NO' ? "not null" : "")), ("default " + defaultTxt)]);
                } else {
                    //console.log(index);
                    updateFields.push([desc[0], desc[1], ((desc[2] === 'NO' ? "not null" : "")), ("default " + defaultTxt)]);
                }
                break;
            }
        }
    }
    console.log("upd",updateFields);
    await operateTab("mod_fields", companyName, currentTab, updateFields).then(result => { result = result });
    // ������ֶ�
    let addFields = [];
    for (let i = oldDesc.length; i < newDesc.length; i++) {
        let desc = newDesc[i], defaultTxt = desc[4];
        if (desc[1].search("varchar") !== -1) {
            defaultTxt = "'" + defaultTxt + "'";
        }
        addFields.push([desc[0], desc[1], ((desc[2] === 'NO' ? "not null" : "")), ("default " + defaultTxt)]);
    }
    //console.log("add", addFields);
    await operateTab("add_fields", companyName, currentTab, addFields).then(result => { result = result });

    return result;
}


