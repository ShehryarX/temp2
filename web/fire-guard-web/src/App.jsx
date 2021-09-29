

import React from 'react';
import { Card, Layout, Row, Col, Button } from 'antd';
import Clusters from './Clusters/Clusters';
import Controls from './Controls/Controls'; 
import Heatmap from './Heatmap/Heatmap';
import MapGL, {Source, Layer} from 'react-map-gl';
import controlImage from './assets/ControlsPreview.jpg';
import clusterImage from './assets/ClusterPreview.jpg';
import heatmapImage from './assets/HeatmapPreview.jpg';

import { DashboardModal } from './dashboard/DashboardModal';
const { Header, Footer, Sider, Content } = Layout;
const MAPBOX_TOKEN = 'pk.eyJ1IjoidHBpbnRvNyIsImEiOiJja2JicWYwMzkwM3NnMnNtZnZkbXU5dGhkIn0.NdzHwoMYvZ-fSTIA9xXXfw';

const mapViewButtonStyle = {
  top: 0,
  left: 735,
  height: "100%",
  width: "100%",
  backgroundSize: "cover",
  padding: '10px'
};

const mapViewRowStyle = {
  top: 0,
  left: 900,
  backgroundSize: "cover",
  padding: '10px'
};

const mapViewImageStyle = {
  objectFit: "contain",
  width: "100%",
  height: "100%"
}



export class App extends React.Component {
  state = { 
    viewport: { 
      latitude: 37.7577,
      longitude: -122.4376,
      zoom: 8
    },
    mapType: 0, 

  };

  render() {
    const mapButtons = <> <Row style={mapViewRowStyle}>
        <Col span={2}><Button style={mapViewButtonStyle} onClick={() => this.setState({mapType: 0})}>  <img src={controlImage} style ={mapViewImageStyle}></img> </Button></Col>
        <Col span={2}><Button style={mapViewButtonStyle} onClick={() => this.setState({mapType: 1})}> <img src={clusterImage} style ={mapViewImageStyle}></img> </Button></Col>
        <Col span={2}><Button style={mapViewButtonStyle} onClick={() => this.setState({mapType: 2})}> <img src={heatmapImage} style ={mapViewImageStyle}></img> </Button></Col>
      </Row> </>;
    // define the deliverables 
    return (
      <div>
        <Layout>
          <Header>
            <div style={{ color: 'white' }}>
              Fire Guardian
            </div>
          </Header>
          <Content> 
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
            {/* <Map2 width="500px" height="500px"/> */}
            <div className="mapWrapper">
              {this.state.mapType === 0 && <Controls buttons={mapButtons}/>}
              {this.state.mapType === 1 && <Clusters buttons={mapButtons}/>}
              {this.state.mapType === 2 && <Heatmap buttons={mapButtons}/>}

              {/* <Row style={mapViewRowStyle}>
                <Col span={2}><Button style={mapViewButtonStyle} onClick={() => this.setState({mapType: 0})}>  <img src={controlImage} style ={mapViewImageStyle}></img> </Button></Col>
                <Col span={2}><Button style={mapViewButtonStyle} onClick={() => this.setState({mapType: 1})}> <img src={controlImage} style ={mapViewImageStyle}></img> </Button></Col>
                <Col span={2}><Button style={mapViewButtonStyle} onClick={() => this.setState({mapType: 2})}> <img src={controlImage} style ={mapViewImageStyle}></img> </Button></Col>
              </Row> */}
            </div>
            <DashboardModal />
          </Content>
        </Layout>
      </div>
    )
  }
}