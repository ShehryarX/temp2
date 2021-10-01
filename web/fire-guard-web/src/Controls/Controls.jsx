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
export default function Controls(props) {
  const [viewport, setViewport] = useState({
    latitude: 40,
    longitude: -100,
    zoom: 3.5,
    bearing: 0,
    pitch: 0
  });
  const [popupInfo, setPopupInfo] = useState(null);

  const  { buttons, setVisible, setBeaconName } = props;

  const onClick = (e) => { 
    if (e) { 
      setVisible(true);
      setBeaconName("us2000amhu");
    }
  }


  return (
    <div>
      <Layout>
        <Content>
      
            <MapGL
              {...viewport}
              height="100vh"
              width="auto"
              mapStyle="mapbox://styles/mapbox/dark-v9"
              onViewportChange={setViewport}
              mapboxApiAccessToken={TOKEN}
            >
              {/* TODO: Colour for pins + pin IDs */}
              <Pins data={CITIES} onClick={onClick} />
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

              {buttons}
              
            </MapGL>
        </Content>
      </Layout>
    </div>
  )
}
