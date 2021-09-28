import * as React from 'react';
import {useState, useEffect, useMemo} from 'react';
import {render} from 'react-dom';
import MapGL, {Source, Layer} from 'react-map-gl';
import ControlPanel from './control-panel';
import {heatmapLayer} from './map-style';
import 'mapbox-gl/dist/mapbox-gl.css';
const MAPBOX_TOKEN = 'sk.eyJ1IjoidHBpbnRvNyIsImEiOiJja3UyMXNrb3UxdHJhMnV0aHBpdzE3M3k2In0.B-D9tE8Oxfl-DPoR95fmAQ'; // Set your mapbox token here

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

export default function Map() {
const [viewport, setViewport] = React.useState({
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8
    });

    return (
    <MapGL
        {...viewport}
        width="100%"
        height="100%"
        onViewportChange={(viewport) => setViewport(viewport)}
        mapboxApiAccessToken={MAPBOX_TOKEN}
    />
    );
}
