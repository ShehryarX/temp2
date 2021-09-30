import * as React from 'react';
import {useState, useEffect, useMemo} from 'react';
import {render} from 'react-dom';
import MapGL, {Source, Layer} from 'react-map-gl';
import {heatmapLayer} from './map-style';

const MAPBOX_TOKEN = 'pk.eyJ1IjoidHBpbnRvNyIsImEiOiJja2JicWYwMzkwM3NnMnNtZnZkbXU5dGhkIn0.NdzHwoMYvZ-fSTIA9xXXfw'; // Set your mapbox token here

function filterFeaturesByDay(featureCollection, time) {
  const date = new Date(time);
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const features = featureCollection.features.filter(feature => {
    const featureDate = new Date(feature.properties.time);
    return (
      featureDate.getFullYear() === year &&
      featureDate.getMonth() === month &&
      featureDate.getDate() === day
    );
  });
  return {type: 'FeatureCollection', features};
}

export default function Heatmap(props) {
  const [viewport, setViewport] = useState({
    latitude: 40,
    longitude: -100,
    zoom: 3,
    bearing: 0,
    pitch: 0
  });
  const buttons = props.buttons;
  const [allDays, useAllDays] = useState(true);
  const [timeRange, setTimeRange] = useState([0, 0]);
  const [selectedTime, selectTime] = useState(0);
  const [earthquakes, setEarthQuakes] = useState(null);

  useEffect(() => {
    /* global fetch */
    fetch('https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson')
      .then(resp => resp.json())
      .then(json => {
        // Note: In a real application you would do a validation of JSON data before doing anything with it,
        // but for demonstration purposes we ingore this part here and just trying to select needed data...
        const features = json.features;
        const endTime = features[0].properties.time;
        const startTime = features[features.length - 1].properties.time;

        setTimeRange([startTime, endTime]);
        setEarthQuakes(json);
        selectTime(endTime);
      });
  }, []);

  const data = useMemo(() => {
    return allDays ? earthquakes : filterFeaturesByDay(earthquakes, selectedTime);
  }, [earthquakes, allDays, selectedTime]);

  const onClick = (e) => { 
      console.log(e.features);
  }

  return (
    <>
      <MapGL
        {...viewport}
        height="100vh"
        width="auto"
        mapStyle="mapbox://styles/mapbox/dark-v9"
        onViewportChange={setViewport}
        mapboxApiAccessToken={MAPBOX_TOKEN}
        onClick={onClick}
      >
        {data && (
          <Source type="geojson" data={data}>
            <Layer {...heatmapLayer} />
          </Source>
        )}
        {buttons}
      </MapGL>
    </>
  );
}
