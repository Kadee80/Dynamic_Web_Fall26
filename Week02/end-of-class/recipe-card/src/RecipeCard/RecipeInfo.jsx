const RecipeInfo = (props) => {
  return (
    <div className="recipe_info">
      <h2 className="recipe_title">{props.title}</h2>
      <p>{props.description}</p>
    </div>
  )
}

export default RecipeInfo
