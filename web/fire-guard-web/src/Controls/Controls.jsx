import React from 'react';
import { Button, Card, Layout, } from 'antd';

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



export default function Controls(props) {
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
  const buttons = props.buttons; 
  return (
    <div>
      <Layout>
        <Content>
      
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
              {buttons}
              
            </MapGL>

            <ControlPanel />
        </Content>
      </Layout>
    </div>
  )
}
