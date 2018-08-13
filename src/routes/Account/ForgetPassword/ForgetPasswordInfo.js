import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Input, Button, Divider, Icon } from 'antd';
import styles from './Style.less';

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

@connect(({ forgetpassword }) => ({
  forgetpassword,
  data: forgetpassword.step,
}))
@Form.create()
export default class ForgetPasswordInfo extends React.PureComponent {
  state = {};

  handleValidate = (rule, value, callback) => {
    if (rule.fieldname !== undefined) {
      if (!value) {
        callback([new Error(rule.message)]);
      } else if (rule.fieldname === 'mobile') {
        this.props.dispatch({
          type: 'forgetpassword/fetchUser',
          payload: { where: { mobile: value } },
        }).then(() => {
          const { user } = this.props.forgetpassword;
          if (!user.results || user.results.length <= 0) {
            callback([new Error(rule.message)]);
          } else {
            callback();
          }
        });
      } else {
        callback();
      }
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        const { mobile } = values;
        const { dispatch } = this.props;

        dispatch({
          type: 'forgetpassword/fetchUser',
          payload: { where: { mobile } },
        }).then(() => {
          const { user } = this.props.forgetpassword;
          if (user && user.results.length > 0) {
            dispatch(routerRedux.push('/account/forgetpassword/forgetpasswordconfirm'));
          }
        });
      }
    });
  };

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <div>
        <Form layout="horizontal" className={styles.stepForm} hideRequiredMark>
          <Form.Item
            {...formItemLayout}
            label="手机号码"
          >
            {getFieldDecorator('mobile', {
              rules: [
                { fieldname: 'mobile', required: true, message: '请输入手机号码！' },
                { fieldname: 'mobile', required: true, pattern: /^1\d{10}$/, message: '手机号码格式错误！' },
                { fieldname: 'mobile', required: true, message: '该手机号码未注册', validator: this.handleValidate },
              ],
              validateFirst: true,
              validateTrigger: 'onBlur',
            })(
              <Input placeholder="手机号码" prefix={<Icon type="mobile" style={{ color: 'rgba(0,0,0,.25)' }} />} />
            )}
          </Form.Item>
          <Form.Item
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: { span: formItemLayout.wrapperCol.span, offset: formItemLayout.labelCol.span },
            }}
            label=""
          >
            <Button type="primary" onClick={this.handleSubmit}>
              下一步
            </Button>
          </Form.Item>
        </Form>
        <Divider style={{ margin: '40px 0 24px' }} />
      </div>
    );
  }
}

