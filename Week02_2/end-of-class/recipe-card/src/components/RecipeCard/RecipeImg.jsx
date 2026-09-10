import styles from './RecipeCard.module.css'

export default function RecipeImg(props) {
  return (
    <img src={props.imgSrc} alt="buttermilk pancakes" className={styles.img} />
  )
}
