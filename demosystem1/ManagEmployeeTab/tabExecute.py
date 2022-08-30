# -*- coding: utf-8 -*-
"""
Created on Sat Aug 20 23:48:03 2022

@author: PC
"""

import pymysql

# 初始化
def init():
    conn = pymysql.connect(
        host = "localhost",
        port = 3306,
        user = "root",
        password = "a961164866",
        charset = "utf8",
        )
    cursor = conn.cursor()
    return conn,cursor

# 入口函数
def operate(headers):
    conn,cursor = init()
    enterprisesname = headers["enterprisesname"] # 数据库名
    if tryConn(enterprisesname,cursor):
        func = headers["action"]
        if func == "descTab":
            result = descTab(headers,cursor)
            return result
        elif func == "selectData":
            result = selectData(headers,cursor)
            return result
        try:
            exec("%s(headers,cursor)"%func)
            cursor.close()
            conn.commit()
            conn.close()
        except Exception as ex:
            return str(ex)
        return "done"
    else:
        return "error"


# 连接或创建数据库
def tryConn(enterprisesname,cursor):
    
    sql2 = "create database if not exists %s"%enterprisesname
    try:
        cursor.execute(sql2)
    except:
        return False
    
    sql = "use %s"%enterprisesname
    cursor.execute(sql)
    return True
    
# 新增单个字段
def add(tabname,item,cursor):
    if item[1][1]:
        item[1][1] = "("+item[1][1]+")"
    data_head = item[0]+ " " + " ".join(item[1])
    sql = "alter table {0} add {1}".format(tabname,data_head)
    cursor.execute(sql)
    
# 创建新表
"""
headers = {
    "enterprisesname":"自来水有限公司",
    "tabname":"员工表模板1",
    "action":"newTab",
    "settings":{
        "员工编号":["char","8","not null"],
        "姓名":["varchar","15","not null"],
        "生日":["date","","not null"],
        "身份证号码":["char","20","not null"],
        "电话":["varchar","30","not null"],
        "地址":["varchar","30","not null"],
        "电子邮箱":["varchar","30","not null"],
        "所属部门":["varchar","15","not null"],
        "职称":["varchar","10","not null"],
        "聘用时间":["date","","not null"],
        "绩效考核":["varchar","50","not null"],
        "工资奖金":["varchar","50","not null"],
        "就职情况":["varchar","50","not null"],
        },
    }
"""
def newTab(headers,cursor):
    
    try:
        sql = "create table %s (nid int, primary key(nid))"%headers["tabname"]
        cursor.execute(sql)
    except:
        return "existed"
    
    for item in headers["settings"].items():
        add(headers["tabname"],item,cursor)
    

# 删除表
"""
headers = {
    "enterprisesname":"自来水有限公司",
    "tabname":"员工表模板1",
    "action":"delTab",
    "settings":{},
    }
"""
def delTab(headers,cursor):
    try:
        sql = "drop table %s"%headers["tabname"]
        cursor.execute(sql)
    except:
        return "not existed"

# 获取表结构
"""
headers = {
    "enterprisesname":"自来水有限公司",
    "tabname":"员工表模板1",
    "action":"descTab",
    "settings":{},
    }
"""
def descTab(headers,cursor):
    sql = "desc %s"%headers["tabname"]
    cursor.execute(sql)
    desc = cursor.fetchall()
    return desc



# 新增表字段
"""
headers = {
    "enterprisesname":"自来水有限公司",
    "tabname":"员工表模板1",
    "action":"newCol",
    "settings":{
        "性别":["tinyint","1","not null","default","1"],
        },
    }
"""
def newCol(headers,cursor):
    for item in headers["settings"].items():
        add(headers["tabname"],item,cursor)
        
        
        
# 修改表字段
"""
headers = {
    "enterprisesname":"自来水有限公司",
    "tabname":"员工表模板1",
    "action":"modifyCol",
    "settings":{
        "就职情况":["tinyint","1","not null","default","1"],
        "性别":["tinyint","1","not null"],
        },
    }
"""
def modifyCol(headers,cursor):
    
    for item in headers["settings"].items():
        if item[1][1]:
            item[1][1] = "("+item[1][1]+")"
        data_head = item[0]+ " " + " ".join(item[1])
        sql = "alter table {0} modify {1}".format(headers["tabname"],data_head)
        cursor.execute(sql)
        

# 删除表字段
"""
headers = {
    "enterprisesname":"自来水有限公司",
    "tabname":"员工表模板1",
    "action":"delCol",
    "settings":{
        "就职情况":[],
        },
    }
"""
def delCol(headers,cursor):
    
    for name in headers["settings"]:
        sql = "alter table {0} drop column {1}".format(headers["tabname"],name)
        cursor.execute(sql)
        
# 查询数据
"""
headers = {
    "enterprisesname":"自来水有限公司",
    "tabname":"员工表模板1",
    "action":"selectData",
    "settings":["员工编号","姓名"],
    "conditions":["姓名"],
    "data":[["张三"]],
    }
"""
def selectData(headers,cursor):
    if headers["settings"]:
        settings = ",".join(headers["settings"])
    else:
        settings = "*"
    sql = "select {0} from {1}".format(settings,headers["tabname"])
    
    result = descTab(headers,cursor)
    charindexs = []
    for i in range(len(headers["conditions"])):
        for desc in result:
            
            if desc[0] == headers["conditions"][i] and "char" in desc[1]:
                charindexs.append(i)
    indexs = []
    if headers["data"]:
        for i in range(len(headers["data"])):
            for index in headers["data"][i]:
                if i in charindexs:
                    indexs.append("'"+index+"'")
                else:
                    indexs.append(index)
            if not i:
                sql += " where {0} in ({1})".format(headers["conditions"][i],",".join(indexs))
            else:
                sql += " and {0} in ({1})".format(headers["conditions"][i],",".join(indexs))
    
    cursor.execute(sql)
    data = cursor.fetchall()
    return data
    

# 插入数据
"""
headers = {
    "enterprisesname":"自来水有限公司",
    "tabname":"员工表模板1",
    "action":"insertData",
    "data":[["1","20004034","张三","2002-04-09","440711200204096311","13652727360","东厂里","961164867@qq.com",
            "技术部","技术员","2022-8-22","无","5000","0"],]
    }
"""
def insertData(headers,cursor):
    result = descTab(headers,cursor)
    indexs = []
    for i in range(len(result)):
        if "char" in result[i][1]:
            indexs.append(i)
        
    for instance in headers["data"]:
        for i in indexs:
            instance[i] = "'"+ instance[i] +"'"
        sql = "insert into {0} values({1})".format(headers["tabname"],",".join(instance))
        cursor.execute(sql)

# 删除数据
"""
headers = {
    "enterprisesname":"自来水有限公司",
    "tabname":"员工表模板1",
    "action":"deleteData",
    "conditions":["nid","姓名"],
    "data":[["1"],["张三"]],
    }
"""
def deleteData(headers,cursor):
    
    sql = "delete from {0}".format(headers["tabname"])
    result = descTab(headers,cursor)
    charindexs = []
    for i in range(len(headers["conditions"])):
        for desc in result:
            
            if desc[0] == headers["conditions"][i] and "char" in desc[1]:
                charindexs.append(i)
    indexs = []
    if headers["data"]:
        for i in range(len(headers["data"])):
            for index in headers["data"][i]:
                if i in charindexs:
                    indexs.append("'"+index+"'")
                else:
                    indexs.append(index)
            if not i:
                sql += " where {0} in ({1})".format(headers["conditions"][i],",".join(indexs))
            else:
                sql += " and {0} in ({1})".format(headers["conditions"][i],",".join(indexs))
    cursor.execute(sql)

# 更新数据

headers = {
    "enterprisesname":"自来水有限公司",
    "tabname":"员工表模板1",
    "action":"updateData",
    "data":[["1","20004034","张三","2002-04-09","440711200204096311","13652727360","东厂里","961164867@qq.com",
            "技术部","技术员","2022-8-22","无","5000","0"],]
    }

def updateData(headers,cursor):
    indexs = []
    for instance in headers["data"]:
        indexs.append(instance[0])
    temps = {
        "enterprisesname":headers["enterprisesname"],
        "tabname":headers["tabname"],
        "action":"deleteData",
        "conditions":["nid"],
        "data":indexs,
        }
    
    deleteData(temps,cursor)
    insertData(headers,cursor)
    

if __name__ == "__main__":
    
    r = operate(headers)
    print(r)
