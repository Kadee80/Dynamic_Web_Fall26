import './styles.css'

export default function RecipeInfo(props) {
  // destructuring: pull title and description off the props object
  const {title, description} = props

  return (
    <div className="recipe_info">
      <h2 className="recipe_title">{title}</h2>
      <p>{description}</p>
    </div>
  )
}
