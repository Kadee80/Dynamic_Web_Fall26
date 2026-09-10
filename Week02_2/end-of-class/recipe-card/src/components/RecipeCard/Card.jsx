import styles from './RecipeCard.module.css'

// `children` is a prop we get for free. It is whatever we put between
// the opening and closing <Card> tags.
// Hmm. This looks like a reusable UI component... hold that thought.
export default function Card(props) {
  const {children} = props
  return <div className={styles.card}>{children}</div>
}
