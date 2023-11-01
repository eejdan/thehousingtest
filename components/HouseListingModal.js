import Image from 'next/image'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { Big_Shoulders_Stencil_Display } from 'next/font/google'

import ModalContainer from './base/ModalContainer'

import styles from '../styles/components/HouseListingModal.module.scss'

import { formatCount } from '../src/helperFunctions'

const fontBSD = Big_Shoulders_Stencil_Display({
    subsets: ['latin'], weight: ['800']
});

export default function HouseListingModal(props) {
    return (
        <ModalContainer>
            <div className={styles.wrapper}>
                <div className={styles.header}>
                    <div className={styles.closeLink} onClick={props.onClose}>
                        <div className={styles.closeLinkWrapper}>
                            <FontAwesomeIcon icon={faChevronLeft} />
                            <div>Back to search</div>
                        </div>
                    </div>
                    <div className={styles.headerTitle + ' ' + fontBSD.className}>!Zillow</div>
                    <div className={styles.closeLink + ' unselectable'}>&nbsp;</div>
                </div>
                <div className={styles.contentWrapper}>
                    <div className={styles.imagesContainer}>
                        {(props.listingData.images.slice(0, 5)).map((image, index) => {
                            return <li key={index}><Image src={"https://listing-images.homejunction.com/" + image}
                                style={{
                                    width: 'auto',
                                    height: '100%',
                                }}
                                width={1024}
                                height={1024}
                                alt={"test" + index} /></li>
                        })}
                    </div>
                    <div className={styles.infoContainer}>
                        <div>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(parseInt(props.listingData.price))}</div>
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
                        <div>{props.listingData.beds}</div>
                        <div>beds</div>
                        <div>{props.listingData.baths}</div>
                        <div>baths</div>
                        <div>{formatCount(props.listingData.surfaceArea, ',')}</div>
                        <div>sqft</div>
                    </div>
                </div>
            </div>
        </ModalContainer>
    )
}