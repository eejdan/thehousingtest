import Image from 'next/image'

import styles from '../styles/components/HouseListingCard.module.scss'

import { formatPrice } from '../src/helperFunctions'

export default function HouseListing(props) {

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}> {/* TODO add status ribbon */}
        <Image src={props.listingData.images[0]} alt=''
          sizes="100vw"
          style={{
            width: '100%',
            height: 'auto',
          }}
          width={500}
          height={300}
          loading='lazy' />
      </div>
      <div className={styles.priceContainer}>{formatPrice(props.listingData.price)}</div>
      <div className={styles.specsContainer}>Specs</div>
      <div className={styles.addressContainer}>address</div>
      <div className={styles.agentContainer}>Agent</div>
    </div>
  )
}