
import { useEffect, useState } from "react"
import { MarkerF } from "@react-google-maps/api"
import Form from 'react-bootstrap/Form'
import Dropdown from 'react-bootstrap/Dropdown'

import { Big_Shoulders_Stencil_Display } from 'next/font/google'

import DefMap from "../components/DefMap"

import styles from '../styles/Home.module.scss'


const fontBSD = Big_Shoulders_Stencil_Display({
  subsets: ['latin'], weight: ['800']
});

export const getServerSideProps = (async context => {
  const res = await fetch('https://qonditive.com/tests/api/listings.json');
  const data = await res.json();

  var filterData = {};
  filterData.minPrice = data.result.listings[0].listPrice;
  filterData.maxPrice = filterData.minPrice;
  filterData.maxBathrooms = data.result.listings[0].baths.total;

  data.result.listings.forEach(listing => {
    if (listing.listPrice > filterData.maxPrice)
      filterData.maxPrice = listing.listPrice;
    else if (listing.listPrice < filterData.minPrice)
      filterData.minPrice = listing.listPrice;
    if (listing.baths.total > filterData.maxBathrooms)
      filterData.maxBathrooms = listing.baths.total;
  })

  return { props: { data, filterData } }
})

const formatPrice = rawPrice => {
  rawPrice = (rawPrice + '').split('').reverse();
  for (let i = 3; i < rawPrice.length; i += 4) {
    rawPrice = [...rawPrice.slice(0, i), ',', ...rawPrice.slice(i)]
  }
  rawPrice = rawPrice.reverse().join('');
  return '$' + rawPrice;
}

export default function Home({ data, filterData }) {

  const [minPrice, setMinPrice] = useState(filterData.minPrice);
  const [maxPrice, setMaxPrice] = useState(filterData.maxPrice);

  const [priceOptions, setPriceOptions] = useState([]);

  const calibratePriceOptions = () => {
    let aroundMinPrice = filterData.minPrice;
    aroundMinPrice = aroundMinPrice + 50000 - aroundMinPrice % 50000;
    let newPriceOptions = [];
    newPriceOptions.push({
      textContent: formatPrice(filterData.minPrice),
      value: filterData.minPrice
    })
    for (let i = 0; aroundMinPrice + i * 50000 < maxPrice; i++) {
      newPriceOptions.push({
        textContent: formatPrice(aroundMinPrice + i * 50000),
        value: aroundMinPrice + i * 50000
      })
    }
    newPriceOptions.push({
      textContent: formatPrice(filterData.maxPrice),
      value: maxPrice
    })
    setPriceOptions(newPriceOptions);
  }

  const [filteredListings, setFilteredListings] = useState(data.result.listings);
  const [currentListings, setCurrentListings] = useState(data.result.listings.length)
  useEffect(() => setCurrentListings(filteredListings.length), [filteredListings])

  const [mapCenter, setMapCenter] = useState({
    lat: 40.62392,
    lng: -94.48370,
  })
  const calibrateCenter = () => {
    let sumlat = 0, sumlng = 0, count = 0;
    filteredListings.forEach(listing => {
      if (!!listing.coordinates) {
        if (!!listing.coordinates.latitude && !!listing.coordinates.longitude) {
          sumlat += listing.coordinates.latitude; sumlng += listing.coordinates.longitude;
          count++;
        }
      }
    })
    let newCenter = {
      lat: sumlat / count,
      lng: sumlng / count
    }
    setMapCenter(newCenter);
  }
  useEffect(() => {
    calibrateCenter()
    calibratePriceOptions()
  }, [])
  const handleClick = e => {

  }

  return (
    <div className={styles.layoutContainer}>
      <div className={styles.headerContainer + ' ' + fontBSD.className}>
        <div>NotZillow</div>
      </div>
      <div className={styles.appContainer}>
        <div className={styles.mapContainer}>
          <div className={styles.filtersWrapper}>
            <div>
              <Form.Control
                size="md"
                type="text"
                id="textSearchFilter"
                placeholder="City, Address, ZIP..."
              />
            </div>
            <div>
              <Form.Select id="minPriceFilter">
                {priceOptions.map((option, index) =>
                  <option key={index} value={option.value}>{option.textContent}</option>)}
              </Form.Select>
              <Form.Text id="maxPriceFilterHelpBlock">Minimum Price</Form.Text>
            </div>
            <div>
              <Form.Select id="maxPriceFilter" aria-describedby="maxPriceFilterHelpBlock">
                {priceOptions.map((option, index) =>
                  <option key={index} value={option.value}>{option.textContent}</option>)}
              </Form.Select>
              <Form.Text id="maxPriceFilterHelpBlock">Maximum Price</Form.Text>

            </div>
            <div>
              <Form.Select id="maxPriceFilter" aria-describedby="maxPriceFilterHelpBlock">
                {[...Array(5).keys()].map((option, index) =>
                  <option key={index} value={option+1}>{option+"+"}</option>)}
              </Form.Select>
              <Form.Text id="maxPriceFilterHelpBlock">Minimum Bathrooms</Form.Text>
            </div>
          </div>
          <div className={styles.mapWrapper}>
            <DefMap
              center={mapCenter}
            >
              {filteredListings.map((listing, index) =>
                <MarkerF
                  shape={"circle"}
                  position={{
                    lat: listing.coordinates.latitude,
                    lng: listing.coordinates.longitude
                  }}
                  key={listing.id}
                  onClick={() => {
                    handleClick(index);
                  }}
                />)}
            </DefMap>
          </div>
        </div>
        <div className={styles.listContainer}>
          <div>
            Current Listings: {currentListings}
          </div>
          <div>
            <HouseListing />
            <HouseListing />
          </div>
        </div>
      </div>
    </div>
  )
}

function HouseListing() {

  return (
    <div>
      HouseListing
    </div>
  )
}