import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Input, Button, Alert, Divider, Row, Col, message, Popover, Progress } from 'antd';
import styles from './Style.less';
import { md5Hash, randomNumber } from '../../../utils/cryptoUtils';

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

const passwordStatusMap = {
  ok: <div className={styles.success}>强度：强</div>,
  pass: <div className={styles.warning}>强度：中</div>,
  poor: <div className={styles.error}>强度：太短</div>,
};

const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

@connect(({ forgetpassword, loading, sms }) => ({
  submitting: loading.effects['forgetpassword/submitStepForm'],
  email: forgetpassword.email,
  validating: forgetpassword.userValidating,
  forgetpassword,
  sms,
}))
@Form.create()
export default class ForgetPasswordConfirm extends React.PureComponent {
  state = {
    user: undefined,
    requestResult: undefined,
    acceptResult: undefined,
  };

  componentWillMount() {
    const { user } = this.props.forgetpassword;
    if (user && user.results.length > 0) {
      const u = user.results[0];
      if (u && u.objectId) {
        this.setState({
          user: u,
        });
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.forgetpassword.requestResult !== nextProps.forgetpassword.requestResult) {
      this.setState({
        requestResult: nextProps.forgetpassword.requestResult,
      });
    }
    if (this.props.forgetpassword.acceptResult !== nextProps.forgetpassword.acceptResult) {
      this.setState({
        acceptResult: nextProps.forgetpassword.acceptResult,
      });
    }
  }

  onGetCaptcha = () => {
    if (!this.state.user) {
      return;
    }
    const { mobile } = this.state.user;
    const { dispatch } = this.props;
    const code = randomNumber(4);
    const content = `验证码：${code}，十分钟内有效，如非本人操作请忽略。`;
    const now = new Date();
    const invalidAt = { __type: 'Date', iso: new Date(now.getTime() + (10 * 60 * 1000)).toISOString() };
    if (mobile) {
      dispatch({
        type: 'forgetpassword/SmsRequestResetPassword',
        payload: {
          mobile,
          code,
          content,
          invalidAt,
        },
      }).then(() => {
        const { requestResult } = this.state;
        if (requestResult && requestResult.result) {
          let count = 59;
          this.setState({ count });
          this.interval = setInterval(() => {
            count -= 1;
            this.setState({ count });
            if (count === 0) {
              clearInterval(this.interval);
            }
          }, 1000);
        }
      });
    } else {
      message.error('请输入手机号码！');
    }
  };

  getInfo = () => {
    const { user } = this.state;
    if (user && user.username) {
      return '请获取并输入验证码进行重置密码。';
    } else {
      return '该手机号码无效！请重新输入手机号码。';
    }
  };

  getPasswordStatus = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };

  checkPassword = (rule, value, callback) => {
    if (!value) {
      this.setState({
        help: '请输入密码！',
        visible: !!value,
      });
      callback('error');
    } else {
      this.setState({
        help: '',
      });
      if (!this.state.visible) {
        this.setState({
          visible: !!value,
        });
      }
      if (value.length < 6) {
        callback('error');
      } else {
        const { form } = this.props;
        if (value && this.state.confirmDirty) {
          form.validateFields(['confirm'], { force: true });
        }
        callback();
      }
    }
    callback();
  };

  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不匹配!');
    } else {
      callback();
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (!this.state.requestResult) {
      message.error('验证码错误！请重新发送验证码。');
      return;
    }

    const { dispatch } = this.props;
    const { validateFields } = this.props.form;
    validateFields({ force: true }, (err, values) => {
      if (!err) {
        const { mobile } = this.state.user;
        const code = values.captcha;
        const { token } = this.state.requestResult.result;
        const password = md5Hash(values.password);
        dispatch({
          type: 'forgetpassword/SmsAcceptResetPassword',
          payload: {
            mobile,
            code,
            token,
            password,
          },
        }).then(() => {
          const { acceptResult } = this.state;
          if (acceptResult && acceptResult.error === undefined) {
            dispatch(routerRedux.push('/account/forgetpassword/forgetpasswordresult'));
          }
        });
      }
    });
  };

  renderPasswordProgress = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    const passwordStatus = this.getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  render() {
    const { user, count } = this.state;
    const { form, dispatch, submitting } = this.props;
    const { getFieldDecorator } = form;
    const onPrev = () => {
      dispatch(routerRedux.push('/account/forgetpassword'));
    };

    return (
      <Form layout="horizontal" className={styles.stepForm}>
        <Alert
          closable
          showIcon
          message={this.getInfo()}
          style={{ marginBottom: 24 }}
        />
        <Form.Item
          {...formItemLayout}
          className={styles.stepFormText}
          label="帐号"
        >
          { user ? user.username || '' : '' }
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          className={styles.stepFormText}
          label="手机号码"
        >
          { user ? user.mobile || '' : '' }
        </Form.Item>
        <Divider style={{ margin: '24px 0' }} />
        <Form.Item
          {...formItemLayout}
          label="验证码"
          required={false}
        >
          <Row gutter={8}>
            <Col span={12}>
              {getFieldDecorator('captcha', {
                rules: [
                  { fieldname: 'captcha', required: true, message: '请输入验证码！' },
                  { fieldname: 'captcha', required: true, message: '输入验证码错误或已失效！', validator: this.handleValidate },
                ],
                validateFirst: true,
                validateTrigger: 'onBlur',
              })(<Input placeholder="验证码" />)}
            </Col>
            <Col span={8}>
              <Button
                disabled={!user && count}
                className={styles.getCaptcha}
                onClick={this.onGetCaptcha}
              >
                {count ? `${count} s` : '获取验证码'}
              </Button>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="新密码"
          required={false}
          help={this.state.help}
        >
          <Popover
            content={
              <div style={{ padding: '4px 0' }}>
                {passwordStatusMap[this.getPasswordStatus()]}
                {this.renderPasswordProgress()}
                <div style={{ marginTop: 10 }}>
                  请至少输入 6 个字符。请不要使用容易被猜到的密码。
                </div>
              </div>
            }
            overlayStyle={{ width: 240 }}
            placement="right"
            visible={this.state.visible}
          >
            {getFieldDecorator('password', {
              rules: [
                {
                  validator: this.checkPassword,
                },
              ],
            })(
              <Input type="password" autoComplete="off" style={{ width: '80%' }} />
            )}
          </Popover>
        </Form.Item>
        <Form.Item
          {...formItemLayout}
          label="确认新密码"
          required={false}
        >
          {getFieldDecorator('confirm', {
            rules: [
              { required: true, message: '请确认密码！' },
              { validator: this.checkConfirm },
            ],
          })(
            <Input type="password" autoComplete="off" style={{ width: '80%' }} />
          )}
        </Form.Item>
        <Form.Item
          style={{ marginBottom: 8 }}
          wrapperCol={{
            xs: { span: 24, offset: 0 },
            sm: { span: formItemLayout.wrapperCol.span, offset: formItemLayout.labelCol.span },
          }}
          label=""
        >
          <Button onClick={onPrev}>
            上一步
          </Button>
          <Button
            disabled={!user}
            type="primary"
            onClick={this.handleSubmit}
            loading={submitting}
            style={{ marginLeft: 20 }}
          >
            提交
          </Button>
        </Form.Item>
      </Form>
    );
  }
}
