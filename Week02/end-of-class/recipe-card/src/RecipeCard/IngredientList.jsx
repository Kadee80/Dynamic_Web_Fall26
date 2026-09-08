const IngredientList = (props) => {
  const {ingredients} = props
  return (
    <div className="ingredient_list">
      <h3 className="list_title">Ingredients:</h3>
      <ul>
        {ingredients.map((ingred, index) => {
          return (
            <li key={index} className="list_item">
              <span className="measure">{ingred.measure}</span>{' '}
              <span>{ingred.item}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default IngredientList
