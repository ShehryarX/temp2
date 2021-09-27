

import React from 'react';
import { Card, Layout } from 'antd';
import Map from './Map';
import Map2 from './Map2';

const { Header, Footer, Sider, Content } = Layout;

export class App extends React.Component {
  render() {
    return (
      <div>
        <Layout style={{ minHeight: '100vh' }}>
          <Header>
            <div style={{ color: 'white' }}>
              Fire Guardian
            </div>
          </Header>
          {/* <Content> */}
{/*             
            add ur stuff here
            <div>
              <Card title="Card title" bordered={false} style={{ width: 300 }}>
                <p>Card content</p>
                <p>Card content</p>
                <p>Card content</p>
              </Card>
            </div> */}

            <Map style={ {width: '100%', height: '100%', position: 'relative' }}/>
            {/* <Map2 style={ {width: '100%', height: '100%', position: 'relative' }}/> */}

          {/* </Content> */}
        </Layout>
      </div>
    )
  }
}