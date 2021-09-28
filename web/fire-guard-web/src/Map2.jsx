   
import * as React from 'react';
import {useState, useRef, useEffect, useCallback} from 'react';
import {render} from 'react-dom';
import MapGL, {Source, Layer} from 'react-map-gl';
import { Modal, List } from 'antd';


import ControlPanel from './control-panel-2';
import {clusterLayer, clusterCountLayer, unclusteredPointLayer} from './layers';
import 'mapbox-gl/dist/mapbox-gl.css';
import './Map.css';
const MAPBOX_TOKEN = 'pk.eyJ1IjoidHBpbnRvNyIsImEiOiJja2JicWYwMzkwM3NnMnNtZnZkbXU5dGhkIn0.NdzHwoMYvZ-fSTIA9xXXfw'; // Set your mapbox token here

export default function Map2() {
  const [viewport, setViewport] = useState({
    latitude: 40.67,
    longitude: -103.59,
    zoom: 3,
    bearing: 0,
    pitch: 0
  });
  const mapRef = useRef(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  // const [features, setFeatures] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    setLeaves([]);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setLeaves([]);
  };

  // const handleContextMenu = (e) => { 
  //   console.log("starting")
  //   showModal();
  //   e.preventDefault();
  //     console.log("hussf")
  //     console.log(e);
  //   if(e.features) { 
  //     console.log(e.features);
  //   }
  //   console.log(e.features)
  //   setFeatures(e.features);
  //   // setXPos(`${e.pageX}px`);
  //   // setYPos(`${e.pageY}px`);
  //   showModal();
  // }

  // const handleContextMenu = useCallback(
  //   (e) => {
  //     console.log("starting")
  //     showModal();
  //     e.preventDefault();
  //       console.log("hussf")
  //       console.log(e);
  //     if(e.features) { 
  //       console.log(e.features);
  //     }
  //     console.log(e.features)
      
  //     // setXPos(`${e.pageX}px`);
  //     // setYPos(`${e.pageY}px`);
  //     showModal();
  //   },
  //   []
  // );

  const handleClick = useCallback((event) => {

    if(!isModalVisible && event.features && event.features[0].properties) {
      console.log("testsetste")
      console.log(isModalVisible)
      const feature = event.features[0]; 
        const clusterId = feature.properties.cluster_id;
        console.log(clusterId)
        const mapboxSource = mapRef.current.getMap().getSource('earthquakes');
        if(feature.layer.id === "clusters") { 
            mapboxSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
                if (err) {
                    return;
                }
                setViewport({
                    ...viewport,
                    longitude: feature.geometry.coordinates[0],
                    latitude: feature.geometry.coordinates[1],
                    zoom,
                    transitionDuration: 500
                });
            });
        } else if(feature.layer.id == "unclustered-point"){ 

          setViewport({
              ...viewport,
              longitude: feature.geometry.coordinates[0],
              latitude: feature.geometry.coordinates[1],
              transitionDuration: 500
          });

        } else { 

            setViewport({
                ...viewport,
                longitude: feature.geometry.coordinates[0],
                latitude: feature.geometry.coordinates[1],
                transitionDuration: 500
            });
        }
    }

  }, [isModalVisible, setViewport]);

  useEffect(() => {
    document.addEventListener("click", handleClick);
    // document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.addEventListener("click", handleClick);
      // document.removeEventListener("contextmenu", handleContextMenu);
    };
  });

  const onClick = (e) => { 
    if(e.features) { 
      const feature = e.features[0];
      var clusterId = feature.properties.cluster_id,
      point_count = feature.properties.point_count,
      clusterSource = mapRef.current.getMap().getSource(/* cluster layer data source id */'earthquakes');
     
      // Get all points under a cluster
      // let leaves;
      if(feature.layer.id === "clusters") {  
        clusterSource.getClusterLeaves(clusterId, point_count, 0, function(err, aFeatures){
          if(err) {
            console.log(err);
            return;
          }
          setLeaves(aFeatures);
          console.log(aFeatures)
        });
        setIsModalVisible(true);
      } else { 
        // TODO: set to shehryar's model for single dashboard
        setIsModalVisible(true);
      }
    }
  }

  return (
    <>
      <MapGL
        {...viewport}
        width="1000px"
        height="500px"
        mapStyle="mapbox://styles/mapbox/dark-v9"
        onViewportChange={setViewport}
        mapboxApiAccessToken={MAPBOX_TOKEN}
        interactiveLayerIds={[clusterLayer.id, unclusteredPointLayer.id]}
        onClick={onClick}
        ref={mapRef}
      >
        <Source
          id="earthquakes"
          type="geojson"
          data="https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson"
          cluster={true}
          clusterMaxZoom={14}
          clusterRadius={50}
        >
          <Layer {...clusterLayer} />
          <Layer {...clusterCountLayer} />
          <Layer {...unclusteredPointLayer} />
        </Source>
      </MapGL>
      <Modal title="Cluster's beacons" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <List
          dataSource={leaves}
          renderItem={item => (
            <List.Item>{item.properties.id}</List.Item>
          )}

        />
     
      </Modal>
      <ControlPanel />
    </>
  );
}
