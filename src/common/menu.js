import { isUrl } from '../utils/utils';

const menuData = [{
  name: '控制台',
  icon: 'dashboard',
  path: 'dashboard',
  children: [
    {
      name: '工作台',
      path: 'workspace',
    }, {
      name: '分析页',
      path: 'analysis',
    }, {
      name: '监控页',
      path: 'monitor',
    }, {
      name: '工作台',
      path: 'workplace',
      hideInBreadcrumb: true,
      hideInMenu: true,
    },
  ],
}, {
  name: '结果页',
  icon: 'check-circle-o',
  path: 'result',
  hideInBreadcrumb: true,
  hideInMenu: true,
  children: [{
    name: '成功',
    path: 'success',
  }, {
    name: '失败',
    path: 'fail',
  }],
}, {
  name: '异常页',
  icon: 'warning',
  path: 'exception',
  hideInBreadcrumb: true,
  hideInMenu: true,
  children: [{
    name: '403',
    path: '403',
  }, {
    name: '404',
    path: '404',
  }, {
    name: '500',
    path: '500',
  }, {
    name: '触发异常',
    path: 'trigger',
    hideInMenu: true,
  }],
}, {
  name: '个人中心',
  icon: 'user',
  path: 'personal',
  children: [{
    name: '个人设置',
    path: 'setting',
    // hideInMenu: true,
  }, {
    name: '消息中心',
    path: 'Notices',
    // children: [{
    //   name: '信息详情页',
    //   path: 'detail',
    //   // hideInMenu: true,
    // }],
  }],
}, {
  name: '使用文档',
  icon: 'book',
  path: 'http://pro.ant.design/docs/getting-started',
  hideInBreadcrumb: true,
  hideInMenu: true,
  target: '_blank',
}, {
  name: '系统管理',
  icon: 'setting',
  path: 'system',
  authority: ['admin'],
  children: [{
    name: '管理面板',
    icon: 'tool',
    path: 'admin',
    hideInMenu: true,
  }, {
    name: '菜单管理',
    icon: 'bars',
    path: 'menu',
  }, {
    name: '用户管理',
    icon: 'user',
    path: 'user',
    // path: 'usertable',
  }, {
    name: '角色管理',
    icon: 'usergroup-add',
    path: 'role',
  }, {
    name: '角色权限',
    icon: 'team',
    path: 'roleuser',
  }],
}, {
  name: '文档管理',
  icon: 'book',
  path: 'article',
  children: [{
    name: '文章管理',
    icon: 'book',
    path: 'articles',
  }],
}];

export function formatter(data, parentPath = '/', parentAuthority) {
  return data.map((item) => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
