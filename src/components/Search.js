import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import ErrorBoundary from "react-error-boundary";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  CardHeader,
  InputGroup,
  Input,
  InputGroupAddon,
} from "reactstrap";
import LeafMap from "./Map";
import app, { getLocationForAddress, searchNearAddress } from "./../stitch";
import {
  getNearbyEvents,
  getNearbyVenues,
} from "./../stitch/services/eventful";
import * as R from "ramda";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import keapVenues from "./../stitch/services/stubs/487keapVenues.json";
import keapLocation from "./../stitch/services/stubs/487keapLocation.json";

const SearchIcon = () => <FontAwesomeIcon icon={faSearch} />;

const SearchBarContainer = styled(InputGroup)`
  width: 100%;
`;
const SearchBarButton = props => {
  const { handleSearch, isSearching } = props;
  const Text = styled.div`
    margin-right: 8px;
    margin-left: 8px;
  `;
  return (
    <InputGroupAddon addonType="append">
      <Button color="info" onClick={handleSearch}>
        {isSearching ? (
          <Text>Searching</Text>
        ) : (
          <>
            <Text>Search</Text>
            <SearchIcon />
          </>
        )}
      </Button>
    </InputGroupAddon>
  );
};
const SearchBarInput = styled(Input)`
  height: 70px !important;
  background-color: white;
  box-sizing: border-box;
  padding-left: 20px;
  padding-right: 20px;
  line-height: 40px;
`;
const SearchBar = React.memo(props => {
  const {
    address,
    searchFor,
    onChange,
    isSearching,
    setVenues,
    setAddressLocation,
    setAddress,
  } = props;
  const handleSearch = () => {
    searchFor(address);
  };
  return (
    <SearchBarContainer>
      <SearchBarInput
        onChange={onChange}
        value={address}
        placeholder="Enter your address..."
      />
      <Button
        onClick={() => {
          setVenues(keapVenues);
          setAddress(keapLocation.formatted_address);
          setAddressLocation(keapLocation);
        }}
      >
        Get Keap
      </Button>
      <SearchBarButton handleSearch={handleSearch} isSearching={isSearching} />
    </SearchBarContainer>
  );
});

export function useVenues() {
  const [address, setAddress] = useState("");
  const [addressQuery, setAddressQuery] = useState("");
  const [addressLocation, setAddressLocation] = useState(null);
  const [searching, setSearching] = useState(false);
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);

  const handleInputChange = e => {
    setAddressQuery(e.currentTarget.value);
  };

  const search = () => !searching && setSearching(true);
  async function handleSearch() {
    if (searching) {
      const result = await searchNearAddress(addressQuery);
      setAddress(result.location.formatted_address);
      setAddressLocation(result.location);
      setVenues(result.venues);
      setEvents(result.events);
      setSearching(false);
    }
  }
  useEffect(
    () => {
      handleSearch();
    },
    [searching],
  );

  return {
    events,
    venues,
    setVenues,
    setAddress,
    setAddressLocation,
    address,
    addressQuery,
    addressLocation,
    search,
    searching,
    handleInputChange,
  };
}

const ContentCard = styled(Card)`
  grid-area: search;
  margin: 10px;
  background-color: #383a3f !important;
  background-color: #3e4348 !important;
  background-color: #1f2124 !important;
  position: relative;
  top: -70px;
`;

const ContentBody = styled(CardBody)`
  display: flex;
  flex-direction: column;
`;

const Search = props => {
  const {
    venues,
    setVenues,
    addressQuery,
    addressLocation,
    search,
    searching,
    handleInputChange,
    setCurrentVenue,
    setAddress,
    setAddressLocation,
  } = props;
  const coords = addressLocation && addressLocation.geometry.location;
  return (
    <ContentCard inverse color="dark">
      <ErrorBoundary>
        <ContentBody>
          <CardHeader>
            <h1>Search Nearby Venues</h1>
            <SearchBar
              onChange={handleInputChange}
              address={addressQuery}
              placeholder="Enter your address..."
              searchFor={search}
              isSearching={searching}
              setVenues={setVenues}
              setAddress={setAddress}
              setAddressLocation={setAddressLocation}
            />
          </CardHeader>
          <LeafMap
            venues={venues}
            center={coords}
            setCurrentVenue={setCurrentVenue}
            searching={searching}
          />
        </ContentBody>
      </ErrorBoundary>
    </ContentCard>
  );
};
export default Search;
