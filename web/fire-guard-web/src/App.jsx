

import React from 'react';
import { Card, Layout } from 'antd';
const { Header, Footer, Sider, Content } = Layout;


export class App extends React.Component {
  render() {
    return (
      <div>
        <Layout>
          <Header>
            <div style={{ color: 'white' }}>
              Fire Guardian
            </div>
          </Header>
          <Content>
            
            add ur stuff here
            <div>
              <Card title="Card title" bordered={false} style={{ width: 300 }}>
                <p>Card content</p>
                <p>Card content</p>
                <p>Card content</p>
              </Card>
            </div>

          </Content>
        </Layout>
      </div>
    )
  }
}