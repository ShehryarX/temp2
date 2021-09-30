import React, { useState } from 'react';
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

export function App() {
  const [dashboardVisible, setDashboardVisible] = useState(true);
  const [mapType, setMapType] = useState(0);

  const mapButtons = <> <Row style={mapViewRowStyle}>
  <Col span={2}><Button style={mapViewButtonStyle} onClick={() => setMapType(0)}>  <img src={controlImage} style ={mapViewImageStyle}></img> </Button></Col>
  <Col span={2}><Button style={mapViewButtonStyle} onClick={() => setMapType(1)}> <img src={clusterImage} style ={mapViewImageStyle}></img> </Button></Col>
  <Col span={2}><Button style={mapViewButtonStyle} onClick={() => setMapType(2)}> <img src={heatmapImage} style ={mapViewImageStyle}></img> </Button></Col>
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
            <div className="mapWrapper">
              {mapType == 0 && <Controls buttons={mapButtons}/>}
              {mapType === 1 && <Clusters buttons={mapButtons} setVisible={setDashboardVisible}/>}
              {mapType === 2 && <Heatmap buttons={mapButtons}/>}

            </div>
            <DashboardModal visible={dashboardVisible} setVisible={setDashboardVisible}/>
          </Content>
        </Layout>
      </div>
    )
};