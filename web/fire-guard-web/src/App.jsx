

import React from 'react';
import { Button, Card, Layout, Row, Col } from 'antd';

//Controls imports
import {useState} from 'react';
import {render} from 'react-dom';
import MapGL, {
  Popup,
  NavigationControl,
  FullscreenControl,
  ScaleControl,
  GeolocateControl
} from 'react-map-gl';

import ControlPanel from './control-panel';
import Pins from './pins';
import CityInfo from './city-info';
import CITIES from './.data/cities.json';

//Assets
import controlImage from './assets/Houston.jpg'
import DropdownButton from 'antd/lib/dropdown/dropdown-button';
const { Header, Footer, Sider, Content } = Layout;



//mapbox token
const TOKEN = 'pk.eyJ1IjoidHBpbnRvNyIsImEiOiJja2JicWYwMzkwM3NnMnNtZnZkbXU5dGhkIn0.NdzHwoMYvZ-fSTIA9xXXfw';
const mapWidth = "1000px";
const mapHeight = "500px";


//controls styles
const geolocateStyle = {
  top: 0,
  left: 0,
  padding: '10px'
};

const fullscreenControlStyle = {
  top: 36,
  left: 0,
  padding: '10px'
};

const navStyle = {
  top: 72,
  left: 0,
  padding: '10px'
};

const scaleControlStyle = {
  bottom: 36,
  left: 0,
  padding: '10px'
};

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

export default function App(props) {
  const [viewport, setViewport] = useState({
    latitude: 40,
    longitude: -100,
    zoom: 3.5,
    bearing: 0,
    pitch: 0
  });
  const [popupInfo, setPopupInfo] = useState(null);
  CITIES.map((city) => { 
    const i = Math.random() * 3; 
    if(i < 1){ 
      city["color"] = "#00FF00";
    } else if(i < 2) { 
      city["color"] = "#FF3034";
    } else { 
      city["color"] = "#ebae2c";
    }
  });
  return (
    <div>
      <Layout>
        <Header>
          <div style={{ color: 'white' }}>
            Fire Guardian
          </div>
        </Header>
        <Content>
          <>
            <MapGL
              {...viewport}
              width={mapWidth}
              height={mapHeight}
              mapStyle="mapbox://styles/mapbox/dark-v9"
              onViewportChange={setViewport}
              mapboxApiAccessToken={TOKEN}
            >
              {/* TODO: Colour for pins + pin IDs */}
              <Pins data={CITIES} onClick={setPopupInfo} />
              {popupInfo && (
                <Popup
                  tipSize={5}
                  anchor="top"
                  longitude={popupInfo.longitude}
                  latitude={popupInfo.latitude}
                  closeOnClick={false}
                  onClose={setPopupInfo}
                >
                  <CityInfo info={popupInfo} />
                </Popup>
              )}

              <GeolocateControl style={geolocateStyle} />
              <FullscreenControl style={fullscreenControlStyle} />
              <NavigationControl style={navStyle} />
              <ScaleControl style={scaleControlStyle} />
              <Row style={mapViewRowStyle}>
                <Col span={2}><Button style={mapViewButtonStyle}> <img src={controlImage} style ={mapViewImageStyle}></img> </Button></Col>
                <Col span={2}><Button style={mapViewButtonStyle}> <img src={controlImage} style ={mapViewImageStyle}></img> </Button></Col>
                <Col span={2}><Button style={mapViewButtonStyle}> <img src={controlImage} style ={mapViewImageStyle}></img> </Button></Col>
              </Row>
              
            </MapGL>

            <ControlPanel />
          </> 
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
