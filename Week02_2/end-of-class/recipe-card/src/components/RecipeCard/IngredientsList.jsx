import styles from './RecipeCard.module.css'

export default function IngredientsList(props) {
  const {ingredients} = props

  return (
    <div className={styles.ingredients_list}>
      <h3 className={styles.list_title}>Ingredients</h3>
      <ul>
        {/* map turns an array of data into an array of JSX.
            Every item in a mapped list needs a unique `key`. */}
        {ingredients.map((i, index) => (
          <li key={index} className={styles.list_item}>
            <span className={styles.measure}>{i.measure}</span>
            <span>{i.item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
