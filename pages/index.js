
import { useRef, useEffect, useState } from "react"
import { MarkerF, MarkerClustererF } from "@react-google-maps/api"
import Form from 'react-bootstrap/Form'
import Dropdown from 'react-bootstrap/Dropdown'

import { Big_Shoulders_Stencil_Display, Open_Sans } from 'next/font/google'


import ListingsMap from "../components/ListingsMap"
import HouseListingCard from '../components/HouseListingCard'
import HouseListingModal from "../components/HouseListingModal"

import styles from '../styles/Home.module.scss'

import { getFilteredListings, getMapCenter, getPriceOptions, formatCount } from "../src/helperFunctions"

const fontBSD = Big_Shoulders_Stencil_Display({
  subsets: ['latin'], weight: ['800']
});
const fontOS = Open_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700']
})

export const getServerSideProps = (async context => {
  // const res = await fetch('https://qonditive.com/tests/api/listings.json');
  // const rawData = await res.json();
  const rawData = require('C:\\Users\\dani\\ab.json');
  var initialFilterData = {};
  initialFilterData.minPrice = parseInt(rawData.result.listings[0].listPrice);
  initialFilterData.maxPrice = initialFilterData.minPrice;
  initialFilterData.maxBathrooms = rawData.result.listings[0].baths.total;
  initialFilterData.maxBeds = rawData.result.listings[0].beds;

  rawData.result.listings.forEach(listing => {
    if (parseInt(listing.listPrice) > initialFilterData.maxPrice)
      initialFilterData.maxPrice = listing.listPrice;
    else if (parseInt(listing.listPrice) < initialFilterData.minPrice)
      initialFilterData.minPrice = listing.listPrice;
    if (listing.baths.total > initialFilterData.maxBathrooms)
      initialFilterData.maxBathrooms = listing.baths.total;
    if (listing.beds > initialFilterData.maxBeds)
      initialFilterData.maxBeds = listing.beds;
  })
  const data = rawData.result.listings.map(listing => {
    return {
      id: listing.id,
      status: listing.status,
      location: {
        lat: listing.coordinates.latitude,
        lng: listing.coordinates.longitude,
        city: (listing.address.city || '').toLowerCase(),
        zip: (listing.address.zip || '').toLowerCase(),
        street: (listing.address.street || '').toLowerCase(),
        county: listing.county,
        state: (listing.address.state || '').toLowerCase(),
      },
      images: listing.images.slice(0, 5).map(imageLink => imageLink.slice(40)),
      price: listing.listPrice,
      beds: listing.beds,
      baths: listing.baths.total,
      surfaceArea: listing.lotSize ? listing.lotSize.sqft : 'unknown',
      agency: listing.listingOffice.name,
      listingDate: listing.listingDate
    }
  })
  console.log(initialFilterData);
  return { props: { data, initialFilterData } }
})

export default function Home({ data, initialFilterData }) {

  const [selectedListing, setSelectedListing] = useState(data[0]);
  const [showModal, setShowModal] = useState(false);

  const [textField, setTextField] = useState('');
  const [sendText, setSendText] = useState('');

  const [minPrice, setMinPrice] = useState(initialFilterData.minPrice);
  const [maxPrice, setMaxPrice] = useState(initialFilterData.maxPrice);
  const [minBeds, setMinBeds] = useState(0);
  const [minBaths, setMinBaths] = useState(0);

  const [listSorting, setListSorting] = useState('newest');

  const priceOptions = getPriceOptions(initialFilterData, minPrice, maxPrice);
  const [filteredListings, setFilteredListings] = useState(data);


  const [mapCenter, setMapCenter] = useState({
    lat: 40.62392,
    lng: -94.48370,
  })
  useEffect(() => {
    setMapCenter(getMapCenter(filteredListings));
  }, [filteredListings])

  useEffect(() => {
    setFilteredListings(getFilteredListings(initialFilterData, data, minPrice, maxPrice, minBaths, minBeds, sendText, listSorting))
  }, [initialFilterData, data, minPrice, maxPrice, minBaths, minBeds, sendText, listSorting])

  const timeout = useRef(null);
  useEffect(() => {
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      if (textField.length > 2)
        setSendText(textField)
      else if (textField.length < 1)
        setSendText('');
    }, 1000)
  }, [textField])

  useEffect

  return (
    <div className={styles.layoutContainer + ' ' + fontOS.className}>
      {showModal ? <HouseListingModal onClose={() => {
        setShowModal(false);
      }} listingData={selectedListing} /> : ''}
      <div className={styles.headerContainer + ' ' + fontBSD.className}>
        <div>!Zillow</div>
      </div>
      <div className={styles.filtersWrapper}>
        <div>
          <Form.Text id="textSearchFilterHelpBlock">Your dream house is at..</Form.Text>
          <Form.Control
            size="md"
            type="text"
            id="textSearchFilter"
            placeholder="City, Address, ZIP..."
            aria-describedby="textSearchFilterHelpBlock"
            onChange={e => { setTextField(e.target.value) }}
          />
        </div>
        <div>
          <Form.Text id="minPriceFilterHelpBlock">Minimum Price</Form.Text>
          <Form.Select
            id="minPriceFilter"
            aria-describedby="minPriceFilterHelpBlock"
            onChange={e => { setMinPrice(e.target.value) }}>
            {priceOptions.map((option, index) =>
              <option key={index} value={option.value}>{option.textContent}</option>)}
          </Form.Select>
        </div>
        <div>
          <Form.Text id="maxPriceFilterHelpBlock">Maximum Price</Form.Text>
          <Form.Select
            id="maxPriceFilter"
            aria-describedby="maxPriceFilterHelpBlock"
            onChange={e => { setMaxPrice(e.target.value) }}>
            {(JSON.parse(JSON.stringify(priceOptions))).reverse().map((option, index) =>
              <option key={index} value={option.value}>{option.textContent}</option>)}
          </Form.Select>

        </div>
        <div>
          <Form.Text id="minBedsFilterHelpBlock">Beds</Form.Text>
          <Form.Select
            id="minBedsFilter"
            aria-describedby="minBedsFilterHelpBlock"
            onChange={e => { setMinBeds(e.target.value) }}>
            {[...Array(initialFilterData.maxBeds + 1).keys()].map((option, index) =>
              <option key={index} value={option}>{option + "+"}</option>)}
          </Form.Select>
        </div>
        <div>
          <Form.Text id="minBathsFilterHelpBlock">Bathrooms</Form.Text>
          <Form.Select
            id="minBathsFilter"
            aria-describedby="minBathsFilterHelpBlock"
            onChange={e => { setMinBaths(e.target.value) }}>
            {[...Array(initialFilterData.maxBathrooms + 1).keys()].map((option, index) =>
              <option key={index} value={option}>{option + "+"}</option>)}
          </Form.Select>
        </div>
      </div>
      <div className={styles.appContainer}>
        <div className={styles.mapContainer}>
          <div className={styles.mapWrapper}>
            <ListingsMap
              center={mapCenter}
              markers={filteredListings}
            >
              <MarkerClustererF
                averageCenter
                maxZoom={16}
                gridSize={80}
              >
                {clusterer => filteredListings.map((listing, index) =>
                  <MarkerF
                    position={{
                      lat: listing.location.lat,
                      lng: listing.location.lng
                    }}
                    key={listing.id}
                    onClick={() => {
                      handleClick(index);
                    }}
                    clusterer={clusterer}
                  />)}
              </MarkerClustererF>
            </ListingsMap>
          </div>
        </div>
        <div className={styles.listContainer}>
          <div className={styles.listHeader}>
            <div className={styles.resultCount}>
              {formatCount(filteredListings.length)} results
            </div>
            <div className={styles.sortControl}>
              <Dropdown align="end" onSelect={(eventKey, e) => { setListSorting(eventKey) }}>
                <Dropdown.Toggle variant="Primary">Sort: {listSorting}</Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item eventKey="newest">
                    Sort by Newest
                  </Dropdown.Item>
                  <Dropdown.Item eventKey="oldest">
                    Sort by Oldest
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
          <ul className={styles.listWrapper}>
            {
              filteredListings.map((listing, index) => {
                return <li key={listing.id} onClick={
                  () => {
                    setSelectedListing(filteredListings[index]);
                    setShowModal(true);
                  }
                }>
                  <HouseListingCard
                    listingData={listing}
                  />
                </li>
              })}

          </ul>
        </div>
      </div>
    </div>
  )
}

