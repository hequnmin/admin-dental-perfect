import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Row, Table, Button, Icon } from 'antd';
import { Link, routerRedux } from 'dva/router';
import queryString from 'query-string';
import styles from './Articles.less';

@connect(({ loading, article }) => ({
  loading: loading.models.article,
  article,
}))
export default class Articles extends PureComponent {
  state = {
  };

  handlePageChange = (page) => {
    const { dispatch } = this.props;
    // let { query } = article.articles;
    // const { limit } = query;
    const query = { limit: 10, skip: (page - 1) * 10, count: true };
    const search = queryString.stringify(query);
    const location = search ? `/article/articles?${search}` : '/article/articles';
    dispatch(routerRedux.push(location));
  };

  render() {
    const { articles } = this.props.article;
    const { query } = articles;

    const columns = [
      { title: '文章标题', dataIndex: 'title', key: 'title' },
      { title: '文章内容', dataIndex: 'content', key: 'content' },
    ];

    const pagination = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: parseInt(query.limit, 0),
      total: articles === undefined ? 0 : articles.count,
      current: query && query.skip ? parseInt(query.skip / 2, 0) + 1 : 0,
      onChange: this.handlePageChange,
    };


    return (
      <Card
        titile="文章管理"
      >
        <Row>
          <Button type="primary"><Link className={styles.createArticle} to="/article/article"><Icon type="plus" /> 发表文章</Link></Button>
        </Row>
        <Row>
          <Table
            columns={columns}
            dataSource={articles.results}
            rowKey="objectId"
            pagination={pagination}
          />
        </Row>
      </Card>
    );
  }
}
