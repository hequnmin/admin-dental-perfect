import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Form, Input, Button } from 'antd';
import styles from './Role.less';

@connect(({ role, loading }) => ({
  role,
  loading: loading.models.role,
}))
@Form.create()
export default class Role extends PureComponent {
  state = {};

  handleOK = () => {
  };

  handleCancel = () => {
  };

  render() {
    const { form, loading, role: { role } } = this.props;
    const { getFieldDecorator } = form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
      },
    };

    return (
      <Card>
        <Form>
          <Form.Item
            {...formItemLayout}
            label="角色名称"
          >
            {getFieldDecorator('name', {
              initialValue: role ? role.name || '' : '',
              rules: [
                { required: true, message: '请输入角色名称！' },
              ],
            })(
              <Input placeholder="请输入角色名称..." />
            )}
          </Form.Item>
          <Form.Item
            wrapperCol={{ span: 12, offset: 12 }}
          >
            <Button type="default" htmlType="button" className={styles.button} onClick={e => this.handleCancel(e)} >取消</Button>
            <Button type="primary" htmlType="button" className={styles.button} onClick={e => this.handleOK(e)} loading={loading} >保存</Button>
          </Form.Item>
        </Form>
      </Card>
    );
  }
}
