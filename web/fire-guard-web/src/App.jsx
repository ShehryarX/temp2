

import React from 'react';
import { Card, Layout } from 'antd';
import Map from './Map';
import Map2 from './Map2';
import MapGL, {Source, Layer} from 'react-map-gl';

const { Header, Footer, Sider, Content } = Layout;
const MAPBOX_TOKEN = 'pk.eyJ1IjoidHBpbnRvNyIsImEiOiJja2JicWYwMzkwM3NnMnNtZnZkbXU5dGhkIn0.NdzHwoMYvZ-fSTIA9xXXfw';

export class App extends React.Component {
  state = { 
    viewport: { 
      latitude: 37.7577,
      longitude: -122.4376,
      zoom: 8
    }

  }
  render() {
    const {viewport} = this.state;
    console.log("testsetsetet")
    return (
      <div>
        <Layout>
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
            {/* <div className="tyler"> 
              <Map style={ {width: '100%', height: '100%', position: 'relative' }}/>
            </div>  */}
            {/* <div className="hussain" width="1000px" height="1000px" position="absolute" top="100px"> 
              <MapGL
                  {...viewport}
                  width="500px"
                  height="500px"
                  onViewportChange={(viewport) => this.setState({viewport})}
                  mapboxApiAccessToken={MAPBOX_TOKEN}
                  visible={true}
              />
            </div> */}
            <Map2 width="500px" height="500px"/>

          {/* </Content> */}
        </Layout>
      </div>
    )
  }
}