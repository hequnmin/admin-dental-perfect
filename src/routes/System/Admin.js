import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Card, Tabs, Icon, Radio, Input, List, Menu, Dropdown, Avatar, Tag, Button, Form, Select, Spin } from 'antd';
import styles from './Admin.less';

@connect(({ user, role, loading }) => ({
  user,
  role,
  loading: loading.models.user || loading.models.role,
}))
@Form.create()
export default class Admin extends PureComponent {
  state = {
    creating: false,
    createRole: {
      data: [],
      value: [],
      fetching: false,
    },
  };

  componentWillMount() {
    this.handleQueryUser({});
    this.handleQueryRole({});
    this.handleQueryRoleUser({});
  }

  handleQueryUser = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchUsers',
      payload: params,
    });
  };

  handleSearchUser = (value) => {
    const params = {
      where: {
        $or: [
          { username: { $regex: `(?i)${value}` } },
          { mobile: { $regex: `(?i)${value}` } },
          { nickname: { $regex: `(?i)${value}` } },
        ],
      },
    };
    this.handleQueryUser(params);
  };

  handleQueryRole = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/fetchRoles',
      payload: params,
    });
  };

  handleSearchRole = (value) => {
    const params = {
      where: {
        $or: [
          { name: { $regex: `(?i)${value}` } },
        ],
      },
    };
    this.handleQueryRole(params);
  };

  handleQueryRoleUser = (params) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'role/fetchRoleUsers',
      payload: { ...params, include: 'pointerUser,pointerRole' },
    });
  };

  handleCreateRole = (e) => {
    e.preventDefault();
    this.setState({ creating: true });
  };

  fetchUser = (value) => {
    this.setState({ createRole: { data: [], fetching: true } });

    const params = {
      limit: 5,
      where: {
        $or: [
          { username: { $regex: `(?i)${value}` } },
        ],
      },
    };
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchUsers',
      payload: params,
    }).then(() => {
      const { users } = this.props.user;
      const data = users.results.map(user => ({
        text: user.username,
        value: user.username,
      }));
      this.setState({ createRole: { data, fetching: false } });
    });
  };

  handleCancel = (e) => {
    e.preventDefault();
    this.setState({ creating: false });
  };

  render() {
    const { form, user: { users }, role: { roles }, loading } = this.props;
    const { getFieldDecorator } = form;

    const { creating, createRole } = this.state;

    const UserMenu = (
      <Menu>
        <Menu.Item>
          <a>编辑</a>
        </Menu.Item>
        <Menu.Item>
          <a>禁用</a>
        </Menu.Item>
      </Menu>
    );

    const UserMenuMore = () => (
      <Dropdown overlay={UserMenu}>
        <a>
          更多 <Icon type="down" />
        </a>
      </Dropdown>
    );

    const RoleMenu = (
      <Menu>
        <Menu.Item>
          <a>编辑</a>
        </Menu.Item>
        <Menu.Item>
          <a>禁用</a>
        </Menu.Item>
      </Menu>
    );

    const RoleMenuMore = () => (
      <Dropdown overlay={RoleMenu}>
        <a>
          更多 <Icon type="down" />
        </a>
      </Dropdown>
    );

    const newRole = {
      objectId: 'newRole',
      name: '',
    };

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };

    return (
      <Card>
        <Tabs defaultActiveKey="User">
          <Tabs.TabPane tab={<span><Icon type="user" />用户管理</span>} key="User">
            <Card bordered={false}>
              <div>
                <Radio.Group defaultValue="all">
                  <Radio.Button value="all" onClick={() => this.handleQueryUser({})}>全部</Radio.Button>
                  <Radio.Button value="admin" onClick={() => this.handleQueryUser({})}>管理员</Radio.Button>
                  <Radio.Button value="enable" onClick={() => this.handleQueryUser({})}>在用</Radio.Button>
                  <Radio.Button value="disable" onClick={() => this.handleQueryUser({})}>停用</Radio.Button>
                </Radio.Group>
                <Input.Search
                  className={styles.extraContentSearch}
                  placeholder="请输入用户名或者手机号码进行查找"
                  enterButton
                  onSearch={value => this.handleSearchUser(value)}
                />
              </div>
              <Card bordered={false}>
                <List
                  size="large"
                  rowKey="objectId"
                  loading={loading}
                  pagination={false}
                  dataSource={users.results}
                  renderItem={item => (
                    <List.Item
                      actions={[<Link to={`/system/auth/${item.objectId}`}>认证</Link>, <UserMenuMore />]}
                    >
                      <List.Item.Meta
                        avatar={<Avatar src={item.avatar} shape="square" size="large" />}
                        title={<a href={item.id}>{item.username}</a>}
                        description={<span><Icon type="mobile" /> {item.mobile} </span>}
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Card>
          </Tabs.TabPane>
          <Tabs.TabPane tab={<span><Icon type="team" />角色权限</span>} key="Role">
            <Card bordered={false}>
              <div>
                <Button
                  type="primary"
                  htmlType="button"
                  onClick={e => this.handleCreateRole(e)}
                ><Icon type="plus" /> 创建
                </Button>
                <Input.Search
                  className={styles.extraContentSearch}
                  placeholder="请输入角色名称进行查找..."
                  enterButton
                  onSearch={e => this.handleSearchRole(e)}
                />
              </div>
              <Card bordered={false}>
                <Card
                  bordered={false}
                  hoverable
                  hidden={!creating}
                  className={styles.createCard}
                >
                  <Form>
                    <Form.Item
                      {...formItemLayout}
                      label="角色名称"
                    >
                      {getFieldDecorator('name', {
                        initialValue: newRole ? newRole.name || '' : '',
                        rules: [
                          { required: true, message: '请输入角色名称！' },
                        ],
                      })(
                        <Input placeholder="请输入角色名称..." />
                      )}
                    </Form.Item>
                    <Form.Item
                      {...formItemLayout}
                      label="角色用户"
                    >
                      {getFieldDecorator('users', {
                        initialValue: createRole.value,
                      })(
                        <Select
                          mode="multiple"
                          labelInValue
                          // value={value}
                          placeholder="选择用户"
                          notFoundContent={createRole.fetching ? <Spin size="small" /> : null}
                          filterOption={false}
                          onSearch={this.fetchUser}
                          onChange={this.handleChange}
                          style={{ width: '100%' }}
                        >
                          {createRole.data.map(d => <Select.Option key={d.value}>{d.text}</Select.Option>)}
                        </Select>
                      )}
                    </Form.Item>
                    <Form.Item
                      wrapperCol={{ span: 12, offset: 12 }}
                    >
                      <Button type="default" htmlType="button" className={styles.button} onClick={e => this.handleCancel(e)}>取消</Button>
                      <Button type="primary" htmlType="button" className={styles.button} onClick={e => this.handleOK(e)} loading={loading}>保存</Button>
                    </Form.Item>
                  </Form>
                </Card>
                <List
                  size="large"
                  // rowKey="objectId"
                  loading={loading}
                  pagination={false}
                  dataSource={roles.results}
                  renderItem={item => (
                    <List.Item
                      actions={[<RoleMenuMore />]}
                    >
                      <List.Item.Meta
                        title={item.name}
                        description={
                          <div>
                            <p>
                              {item.users.map(i => <Tag key={i.objectId}><Icon type="user" /> {i.username} </Tag>)}
                            </p>
                            <p>
                              {item.roles.map(i => <Tag key={i.objectId}><Icon type="team" /> {i.name} </Tag>)}
                            </p>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Card>
          </Tabs.TabPane>
        </Tabs>
      </Card>
    );
  }
}
