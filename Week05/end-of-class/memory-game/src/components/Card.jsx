import cx from 'classnames'
import styles from './Card.module.css'
import CardPattern from '../assets/moroccan-flower-dark.png'

const Card = (props) => {
  const {card, handleChoice, flipped} = props

  const handleClick = () => {
    // the Card does not decide whether it is flipped. It reports the click
    // and lets the Grid decide -- the same trade as every component since
    // the Accordion.
    handleChoice(card)
  }

  return (
    <div className={styles.card}>
      <div
        onClick={handleClick}
        className={cx(styles.inner, {[styles.flipped]: flipped})}
      >
        <div className={styles.front}>
          <img src={CardPattern} alt="" />
        </div>
        <div className={styles.back}>
          <img src={card.src} alt="" />
        </div>
      </div>
    </div>
  )
}

export default Card
