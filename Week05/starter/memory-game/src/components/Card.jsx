import styles from './Card.module.css'
import CardPattern from '../assets/moroccan-flower-dark.png'

// The card knows how one card LOOKS. It does not know the rules of the game,
// and by the end of class it still will not.
const Card = (props) => {
  const {card} = props

  return (
    <div className={styles.card}>
      <div className={styles.inner}>
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
