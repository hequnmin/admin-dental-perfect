import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Checkbox, Alert, Icon } from 'antd';
import Login from '../../components/Login';
import styles from './Login.less';
import { md5Hash } from '../../utils/cryptoUtils';
import { setAutoLogin } from '../../utils/storage';

const { Tab, UserName, Password, Submit } = Login;

@connect(state => ({
  login: state.login,
}))
export default class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: true,
  };

  onTabChange = (type) => {
    this.setState({ type });
  };

  handleSubmit = (err, values) => {
    if (!err) {
      const emailReg = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
      const password = md5Hash(values.password);

      setAutoLogin(this.state.autoLogin);

      let loginOption = {};
      if (emailReg.test(values.username)) {
        loginOption = {
          email: values.username,
          password,
        };
      } else {
        loginOption = {
          username: values.username,
          password,
        };
      }
      const { dispatch } = this.props;
      dispatch({
        type: 'login/login',
        payload: {
          ...loginOption,
        },
      });
    }
  };

  changeAutoLogin = (e) => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  renderMessage = (content) => {
    return (
      <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon closable />
    );
  };

  render() {
    const { login } = this.props;
    const { type } = this.state;
    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
        >
          <Tab key="account" tab="登录">
            {
              login.status === 'error' && login.type === 'account' && login.submitting === false && this.renderMessage('帐户或密码错误')
            }
            <UserName name="username" placeholder="请输入帐号或邮箱" />
            <Password name="password" placeholder="请输入密码" />
          </Tab>
          <div className={styles.password}>
            <Checkbox checked={this.state.autoLogin} onChange={this.changeAutoLogin}>自动登录</Checkbox>
            <Link className={styles.forgetpassword} to="/account/forgetpassword">忘记密码</Link>
          </div>
          <Submit loading={login.submitting}>登录</Submit>
          <div className={styles.other}>
            其他登录方式
            <Icon className={styles.icon} type="wechat" />
            <Icon className={styles.icon} type="alipay-circle" />
            <Icon className={styles.icon} type="taobao-circle" />
            <Icon className={styles.icon} type="weibo-circle" />
            <Link className={styles.signup} to="/account/signup">注册账户</Link>
          </div>
        </Login>
      </div>
    );
  }
}
