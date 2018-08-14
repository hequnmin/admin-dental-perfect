import React from 'react';
import { connect } from 'dva';
import { Card, Form, Input, Button } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import FooterToolbar from '../../components/FooterToolbar';

@connect(({ loading, article }) => ({
  loading: loading.models.article,
  article,
}))
@Form.create()
export default class Article extends React.PureComponent {
  state = {
  };

  handleOK = (e) => {
    e.preventDefault();
    const { validateFields } = this.props.form;
    validateFields({ force: true }, (err, values) => {
      if (err === null || !err) {
        const { dispatch } = this.props;

        const article = {
          title: values.title,
          subhead: values.subhead,
          summary: values.summary,
          content: values.content,
        };
        if (values.objectId) {

          dispatch({
            type: 'article/coverArticle',
            payload: article,
          }).then(() => {
            this.props.history.goBack();
          });
        } else {
          dispatch({
            type: 'article/storeArticle',
            payload: article,
          }).then(() => {
              this.props.history.goBack();
          });
        }
      }
    });
  };

  handleCancel = () => {
    // console.log('Cancel');
  };

  render() {
    const { form, article } = this.props;
    const { getFieldDecorator } = form;

    return (
      <PageHeaderLayout>
        <Card>
          <Form>
            <Form.Item
              label="标题"
            >
              {getFieldDecorator('title', {
                initialValue: article ? article.title || '' : '',
                rules: [
                  { required: true, message: '请输入标题！' },
                ],
              })(
                <Input placeholder="起一个标题..." />
              )}
            </Form.Item>
            <Form.Item
              label="副标题"
            >
              {getFieldDecorator('subhead', {
                initialValue: article ? article.subhead || '' : '',
                rules: [
                  { required: true, message: '请输入副标题！' },
                ],
              })(
                <Input placeholder="起一个副标题..." />
              )}
            </Form.Item>
            <Form.Item
              label="内容"
            >
              {getFieldDecorator('content', {
                initialValue: article ? article.content || '' : '',
                rules: [
                  { required: true, message: '请输入内容！' },
                ],
              })(
                <Input placeholder="编辑内容..." />
              )}
            </Form.Item>
          </Form>
        </Card>
        <FooterToolbar>
          <Button type="default" htmlType="button" onClick={e => this.handleCancel(e)}>取消</Button>
          <Button type="primary" htmlType="button" onClick={e => this.handleOK(e)} loading={this.props.loading}>保存</Button>
        </FooterToolbar>
      </PageHeaderLayout>
    );
  }
}
