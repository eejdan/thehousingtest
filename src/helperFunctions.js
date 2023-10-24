

export const getPriceOptions = (initialFilterData) => {
  let aroundMinPrice = initialFilterData.minPrice;
  aroundMinPrice = aroundMinPrice + 50000 - aroundMinPrice % 50000;
  let newPriceOptions = [];
  newPriceOptions.push({
    textContent: formatPrice(initialFilterData.minPrice),
    value: initialFilterData.minPrice
  })
  for (let i = 0; aroundMinPrice + i * 50000 < initialFilterData.maxPrice; i++) {
    newPriceOptions.push({
      textContent: formatPrice(aroundMinPrice + i * 50000),
      value: aroundMinPrice + i * 50000
    })
  }
  newPriceOptions.push({
    textContent: formatPrice(initialFilterData.maxPrice),
    value: initialFilterData.maxPrice
  })
  return newPriceOptions;
}
export const getMapCenter = (filteredListings) => {
  let sumlat = 0, sumlng = 0, count = 0;
  filteredListings.forEach(listing => {
    if (!!listing.coordinates) {
      if (!!listing.coordinates.latitude && !!listing.coordinates.longitude) {
        sumlat += listing.coordinates.latitude; sumlng += listing.coordinates.longitude;
        count++;
      }
    }
  })
  return {
    lat: sumlat / count,
    lng: sumlng / count
  }
}
export const formatPrice = rawPrice => {
  rawPrice = (rawPrice + '').split('').reverse();
  for (let i = 3; i < rawPrice.length; i += 4) {
    rawPrice = [...rawPrice.slice(0, i), ',', ...rawPrice.slice(i)]
  }
  rawPrice = rawPrice.reverse().join('');
  return '$' + rawPrice;
}
export const getFilteredListings = (initialFilterData, listings, minPrice, maxPrice, minBaths, minBeds, textFilter) => {
  if(textFilter)
    var keywords = (textFilter+'').toLowerCase().split(' ');
  let newList = [];
  listings.forEach(listing => {
    if(initialFilterData.minPrice != minPrice)
      if(listing.price < minPrice)
        return;
    if(initialFilterData.maxPrice != maxPrice)
      if(listing.price > maxPrice)
        return;
    if(listing.baths < minBaths)
      return;
    if(listing.beds < minBeds)
      return;
    if(!keywords)
      return newList.push(listing);

    let found = false;
    keywords.forEach(word => {
      if(listing.location.city.search(word) > -1 || listing.location.zip.search(word) > -1 || listing.location.street.search(word) > -1)
        found = true;
    })
    if(found === true)
      newList.push(listing);
  })
  
  return newList;
}

export const displayIfNotEmpty = (field, opts) => {
  if(field != '')
    return <div>field</div>
  return '';
}
export const wrapIn = (field) => {

}