import React, { useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { Map, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import { Card } from "reactstrap";

const ConcertMapContainer = styled.div`
  height: 100%;
  width: 100%;
  padding-top: 20px;
`;
const ConcertMap = styled(Map)`
  width: 100%;
  height: 100%;
  border-radius: 4px;
`;

export default function LeafMap(props) {
  const { venues, setCurrentVenue } = props;

  const renderEventMarkers = () => {
    return (
      venues &&
      venues.map(venue => {
        const setAsCurrent = () => {
          setCurrentVenue(venue);
        };
        return (
          <Marker
            key={venue.id}
            position={[Number(venue.latitude), Number(venue.longitude)]}
            onClick={setAsCurrent}
          >
            <Popup>
              <h2>{venue.name}</h2>
            </Popup>
          </Marker>
        );
      })
    );
  };

  const center = (props.center && [props.center.lat, props.center.lng]) || [
    40.7133111,
    -73.9521927,
  ];
  const radius = 5 * 1000; // 5 kilometers

  const StamenTonerTileLayer = () => (
    <TileLayer
      attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      url="https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.png"
    />
  );

  const DefaultTileLayer = () => (
    <TileLayer
      attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
  );

  return (
    <ConcertMapContainer>
      <ConcertMap center={center} zoom={12}>
        <StamenTonerTileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {venues.length > 0 && (
          <>
            <Circle center={center} fillColor="blue" radius={radius} />
            <Marker position={center}>
              <Popup>
                <strong>Your Address:</strong>
                <br />
                {center}
              </Popup>
            </Marker>
          </>
        )}
        {renderEventMarkers()}
      </ConcertMap>
    </ConcertMapContainer>
  );
}