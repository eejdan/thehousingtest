import styles from './ModalContainer.module.scss'

export default function ModalContainer(props) {
    return(
        <div className={styles.container}>
            {props.children}
        </div>
    )

}