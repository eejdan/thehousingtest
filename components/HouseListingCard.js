import Image from 'next/image'

import styles from '../styles/components/HouseListingCard.module.scss'

export default function HouseListingCard(props) {

  return (
    <div className={styles.card}>
      <div className={styles.statusRibbon + ' ' +
        (props.listingData.status == 'Active'                ? styles.statusActive : ''
      ||props.listingData.status == 'Pending'               ? styles.statusPending : ''
      ||props.listingData.status == 'Active Under Contract' ? styles.statusAUC : '' )
      }>
        {props.listingData.status}
      </div>
      <div className={styles.imageWrapper}>
        <Image src={"https://listing-images.homejunction.com/" + props.listingData.images[0]} alt=''
          sizes="100vw"
          style={{
            width: '100%',
            height: 'auto',
          }}
          width={350}
          height={200}
          loading='lazy' />
      </div>
      <div className={styles.priceContainer}>
        { new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(parseInt(props.listingData.price))}
      </div>
      <div className={styles.specsContainer}>
        <div className={styles.specsWrapper}>
          <div><strong>{props.listingData.beds}</strong> bds </div>
          <div>&nbsp;<strong>{props.listingData.baths}</strong> ba </div>
          { props.listingData.surfaceArea != '' 
          ? <div>&nbsp;<strong>{props.listingData.surfaceArea}</strong> sqft </div> 
          : ''}
        </div>
      </div>
      <div className={styles.addressContainer}>
        {
          [
            props.listingData.location.street, 
            props.listingData.location.city, 
            (props.listingData.location.state + '').toUpperCase() + ' ' + props.listingData.location.zip
          ].map((field, index) => {
            if (field != '' && field != ' ')
              return <div key={index}>{field}</div>
            return '';
          })
        }
      </div>
      <div className={styles.agentContainer}>{props.listingData.agency}</div>
    </div>
  )
}