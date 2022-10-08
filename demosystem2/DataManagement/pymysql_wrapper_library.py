
import pymysql
import inspect


# 封装sql操作
class SqlManager:
    def __init__(self):
        self.conn = pymysql.connect(
        host = "localhost",
        port = 3306,
        user = "root",
        password = "a961164866",
        charset = "utf8",
        )
        
        
        self.cursor = self.conn.cursor()

    # 连接数据库，若该数据库不存在则创建
    def tryConn(self,dbname):
        try:
            self.cursor.execute("create database if not exists %s"%(dbname))
            self.cursor.execute("use %s"%(dbname))
        except:
            return False
        return True
    
    # 关闭服务
    def quitConn(self):
        self.conn.close()

    # 执行一次sql语句，并提交更改
    def executeSql(self,sql):
        try:
            self.cursor.execute(sql)
            self.conn.commit()
        except:
            return False
        return True
    
    # 执行多次
    def executeManySql(self,sql,data):
        try:
            self.cursor.executemany(sql, data)
            self.conn.commit()
        except:
            return False
        return True
    
# 修改表名
"""
请求头格式：
    headers = {
        "action":"rename_Tab",
        "dbname":"",
        "tabname":"",
        "fields":"newTabname",
    }
    
"""

# 表结构操作约定请求头
"""
请求头格式：
    headers = {
        "action":"",
        "dbname":"",
        "tabname":"",
        "fields":[],
    }
    
    headers = {
        "action":"new_Tab",
        "dbname":"demo",
        "tabname":"t2",
        "fields":[("name","varchar(20)","not null",""),
         ("gender","boolean","not null","default true"),],
    }

字段格式：

    增加字段时：
    "fields":[(<字段名>,<字段类型>,<是否为空>,<默认值>),]
    字段类型: varchar(<最大长度>)  int float boolean
    
    
    [("name","varchar(20)","not null",""),
     ("gender","boolean","not null","default true"),]
    
    
    删除字段时：
    "fields":[(<字段名1>,),(<字段名2>,)]
    
    更改字段时：
    不更名："fields":[(<字段名>,<字段类型>,<是否为空>,<默认值>),]
    
    更名："fields":[(<旧字段名>,<新字段名>,<字段类型>,<是否为空>,<默认值>),]
    "fields":[("name","student_name","varchar(20)","",""),]
    
"""

# 表结构相关操作封装类
class TableManager(SqlManager):

    # 初始化
    def __init__(self):
        super().__init__()
        self.func_list = inspect.getmembers(TableManager,inspect.isfunction)

    # 入口函数
    def operate_Tab(self,headers):
        self.tryConn(headers["dbname"])
        self.headers = headers
        
        for func_tuple in self.func_list:
            if headers["action"] == func_tuple[0] and headers["action"] != "operate_Tab":
                try:
                    result = func_tuple[1](self)
                    return result
                except:
                    return False 
        return False

    

    # 查看表结构
    def desc_Tab(self):
        sql = "desc %s"%(self.headers["tabname"])
        self.executeSql(sql)
        return self.cursor.fetchall()

    # 新增字段
    def add_fields(self):
        if self.headers["fields"]:
            for field in self.headers["fields"]:
                txt = " ".join(field)
                sql = "alter table {0} add {1}".format(self.headers["tabname"],txt)
                self.executeSql(sql)
        return self.desc_Tab()
    
    # 删除字段
    def del_fields(self):
        if self.headers["fields"]:
            for field in self.headers["fields"]:
                sql = "alter table {0} drop {1}".format(self.headers["tabname"],field[0])
                self.executeSql(sql)
        return self.desc_Tab()
    
    # 更改字段
    def mod_fields(self):
        if self.headers["fields"]:
            for field in self.headers["fields"]:
                txt = " ".join(field)
                if len(field) == 4:
                    sql = "alter table {0} modify column {1}".format(self.headers["tabname"],txt)
                    self.executeSql(sql)
                elif len(field) == 5:
                    sql = "alter table {0} change {1}".format(self.headers["tabname"],txt)
                    self.executeSql(sql)
        return self.desc_Tab()

    # 遍历所有表格
    def list_Tab(self):
        sql = "show tables"
        self.executeSql(sql)
        return self.cursor.fetchall()

    # 重命名表
    def rename_Tab(self):
        sql = "rename table {0} to {1}".format(self.headers["tabname"],self.headers["fields"])
        self.executeSql(sql)
        return self.list_Tab()

    # 创建新表
    def new_Tab(self):
        sql = "create table %s (nid int auto_increment primary key)"%self.headers["tabname"]
        self.executeSql(sql)
        return self.add_fields()
    
    # 删除表
    def del_Tab(self):
        sql = "drop table %s"%self.headers["tabname"]
        self.executeSql(sql)
        return self.list_Tab()
    
# 数据相关操作约定请求头
"""
添加数据请求头结构：
    data_headers = {
        "action":"add_Data",
        "dbname":"",
        "tabname":"",
        "fields":[],
        "data":[],
    }
    
    存储数据相应字段名：
        "fields":["name","age","gender"]
    
    数据：
        "data":[("Jack",18,True),
                ("Lucy",20,False),]
        
    data_headers = {
        "action":"add_Data",
        "dbname":"demo",
        "tabname":"t1",
        "fields":["name","age","gender"],
        "data":[("Jack",18,True),
                ("Lucy",20,False),],
    }
    
    
删除数据请求头：
    data_headers = {
        "action":"del_Data",
        "dbname":"",
        "tabname":"",
        "nid":[1,2,5]
    }
    
    # 安全和简洁型考虑，只支持nid索引删除：
    
    
更新数据请求头：
    data_headers = {
        "action":"upd_Data",
        "dbname":"demo",
        "tabname":"t1",
        "nid":[5,6],
        "fields":["age","gender"],
        "data":[
            (19,()),
            (None,True)
        ]
    }
    
    "nid": <nid列表>          需要更改的数据的nid序号
    "fields": <字段名列表>    所有进行过更改的字段
    "data": <元组列表>        顺序与nid一一对应，元组内与字段对应，若无需修改则填入None
    
    注意： 1.若需要将对应字段信息更改为 NULL ，可填入空元组 ()
          2.字符串类型需要用单引号！！！
          ('Mike',19,False)
    
    如：
    "fields":["age","gender"],
    "data":[
        (19,()),
        (None,True)
    ]
    
查询数据请求头：
    
    通过nid精确查找或通过conditions进行条件查找，最后全部返回
    data_headers = {
        "action":"sel_Data",
        "dbname":"demo",
        "tabname":"t1",
        "nid":[5,6],
        "fields":[],
        "conditions":[
            [(<条件一>),(<条件二>)],
            
            [(<条件三>),(<条件四>)]
        ],
    }

    "fields": <所需的字段> 空列表为全都要，nid一定会给不要写
    
    
    如果 "nid" 和 "conditions" 均为空列表，表示取出所有数据
    表达式关系： where (nid in (5,6)) or (<条件一> and <条件二>) or (<条件三> and <条件四>)
    基本条件式:
        
        对于 boolean 类型：
            ("boolean",<字段名>,<真或假>) 例如： ("boolean","gender",True)
        
        对于 int, float 类型：
            ("float",<字段名>,(<最小值>,<是否包含 True/False>),(<最大值>,<是否包含 True/False>))
            
            例如：  20 <= age < 30
            ("int","age",(20,True),(30,False))
            
            若只有一边，另一边放入空元组，
            例如：  age <= 18
            ("int","age",(),(18,True))
        
        对于 varchar 类型：
            ("varchar",<字段名>,<模式>,<内容>)
            
            <模式> : 1. "exact"
                    2. "blur"
                    3. "blur left"
                    4. "blur right"
            
            例如： where name like "张%"
            ("varchar","name","blur right","张")
        
        查询内容为 NULL 则只填数据类型和字段名
        
"""
    
# 数据相关操作封装类
class DataManager(SqlManager):
    # 初始化
    def __init__(self):
        super().__init__()
        self.func_list = inspect.getmembers(DataManager,inspect.isfunction)
    
    # 入口函数
    def operate_Data(self,data_headers):
        self.tryConn(data_headers["dbname"])
        self.data_headers = data_headers
        
        for func_tuple in self.func_list:
            
            if data_headers["action"] == func_tuple[0] and data_headers["action"] != "operate_Data":
                try:
                    
                    result = func_tuple[1](self)
                    return result
                except:
                    return False 
        return False
    
    # 添加数据
    def add_Data(self):
        fields_txt = ",".join(self.data_headers["fields"])
        values_txt = ",".join(["%s"]*len(self.data_headers["fields"]))
        sql = "insert into {0}({1}) values ({2});".format(self.data_headers["tabname"],fields_txt,values_txt)
        return self.executeManySql(sql, self.data_headers["data"])
    
    # 删除数据
    def del_Data(self):
        indexs_txt = ",".join(str(index) for index in self.data_headers["nid"])
        sql = "delete from {0} where nid in ({1})".format(self.data_headers["tabname"],indexs_txt)
        return self.executeSql(sql)
    
    # 更新数据
    def upd_Data(self):
        for i in range(len(self.data_headers["nid"])):
            nid = str(self.data_headers["nid"][i])
            datum = self.data_headers["data"][i]
            field_value_list = []
            for index in range(len(datum)):
                value = datum[index]
                if value == None:
                    continue
                elif value == () or value == [] or value == {}:
                    value = "NULL"
                else:
                    value = str(value)
                field = self.data_headers["fields"][index]
                field_value_list.append("{0} = {1}".format(field, value))
            field_value_txt = ",".join(field_value_list)
            sql = "update {0} set {1} where nid = {2}".format(
                self.data_headers["tabname"],field_value_txt,nid)
            if not self.executeSql(sql):
                return False
        return True
    
    # 查找数据
    def sel_Data(self):
        def analyse_cond(cond):
            if len(cond) == 2:
                return "(" + cond[1] + " is NULL)"
            data_type = cond[0]
            cond_txt = "("
            if data_type == "boolean":
                cond_txt += cond[1] + " = " + str(cond[2])
            elif data_type == "int" or data_type == "float":
                add = False
                if not cond[2] == ():
                    add = True
                    if cond[2][1]:
                        cond_txt += cond[1] + " >= " + str(cond[2][0])
                    else:
                        cond_txt += cond[1] + " > " + str(cond[2][0])
                if not cond[3] == ():
                    if add:
                        cond_txt += " and "
                    if cond[3][1]:
                        cond_txt += cond[1] + " <= " + str(cond[3][0])
                    else:
                        cond_txt += cond[1] + " < " + str(cond[3][0])
            elif data_type == "varchar":
                if cond[2] == "exact": 
                    cond_txt += cond[1] + " = " + cond[3]
                else:
                    if cond[2] == "blur":
                        content = "'%" + cond[3] + "%'"
                    elif cond[2] == "blur left":
                        content = "'%" + cond[3] + "'"
                    elif cond[2] == "blur right":
                        content = "'" + cond[3] + "%'"
                    cond_txt += cond[1] + " like " + content
            cond_txt += ")"
            return cond_txt
                        
                        
        fields = "*" if self.data_headers["fields"] == [] else "nid,"+",".join(self.data_headers["fields"])
        nids = self.data_headers["nid"]
        conditions = self.data_headers["conditions"]
        
        sql = "select {0} from {1}".format(fields, self.data_headers["tabname"])
        
        if nids:
            nids_txt = ",".join(str(nid) for nid in nids)
            sql += " where (nid in ({0}))".format(nids_txt)
            if conditions:
                for condition in conditions:
                    sql += " or "
                    cond_list = []
                    for cond in condition:
                        cond_list.append(analyse_cond(cond))
                    sql += " (" +" and ".join(cond_list) + ") "
        elif not nids and conditions:
            sql += " where "
            
            for condition in conditions:
                
                if condition != conditions[0]:
                    sql += " or "
                cond_list = []
                for cond in condition:
                    
                    cond_list.append(analyse_cond(cond))
                    print(cond_list)
                sql += " (" +" and ".join(cond_list) + ") "
                
        #print(sql)
        if self.executeSql(sql):
            return self.cursor.fetchall()
        
        
