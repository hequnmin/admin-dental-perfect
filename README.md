# Dental-Perfect Admin

#### 项目介绍
[Dental-Perfect](http://www.dental-perfect.com/) 后管系统前端

#### 架构核心
* ESLint - 代码格式化工具
* roadhog - 项目启动打包工具
* babel - ES6编译工具
* REST API - API接口标准
* dva - redux框架
* ant-design - UI组件
* ant-design-pro - Ant-Design最佳实践脚手架
* parse-server - [后端数据服务](https://parse-server-dental-perfect.herokuapp.com)
* parse-dashboard - [后端数据管理](https://parse-dashboard-dental-perfect.herokuapp.com)

#### 使用说明


```
$ git clone https://gitlab.becheer.com.cn/dental-perfect/admin.git
$ cd admin
$ npm install
$ npm start
```

#### 项目资源
* parse-server-dental-perfect - [后端数据服务](https://parse-server-dental-perfect.herokuapp.com)
* parse-dashboard-dental-perfect - [后端数据管理](https://parse-dashboard-dental-perfect.herokuapp.com)


#### 开发规范

* dva 开发规范

|Method|Model/effects|Model/reduce|service|api / request|respon|
|-----|-----|-----|-----|-----|------|
|GET|fetchClassNames|queryClassNames|getClassNames|…/className|{results:[],count:0}|
|GET|fetchClassName|queryClassName|getClassName|…/className/objectId|className object|
|POST|storeClassName|appendClassName|postClassName|…/className|{objectId:’’,createAt:date}|
|PUT|coverClassName|resetClassName|putClassName|…/className/objectId|{updateAt:date}|
|DELETE|removeClassName|clearClassName|deleteClassName|…/className/objectId|[]|
|DELETE|removeFile|clearFile|deleteFile|…/files/filename|[]|
| |trashClassName|emptyClassName| | |详见article|


 
#### 
git flow

