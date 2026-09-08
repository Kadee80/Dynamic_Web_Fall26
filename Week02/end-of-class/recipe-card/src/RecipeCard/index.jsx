import {RECIPE_DATA} from './recipe-data.js'
import Card from './Card.jsx'
import RecipeImg from './RecipeImg.jsx'
import RecipeInfo from './RecipeInfo.jsx'
import IngredientList from './IngredientList.jsx'
import InstructionList from './InstructionList.jsx'

const RecipeCard = () => {
  return (
    <Card>
      <RecipeImg imgSrc={RECIPE_DATA.imgSrc} imgAlt={RECIPE_DATA.imgAlt} />
      <RecipeInfo
        title={RECIPE_DATA.title}
        description={RECIPE_DATA.description}
      />
      <IngredientList ingredients={RECIPE_DATA.ingredients} />

      <InstructionList instructions={RECIPE_DATA.instructions} />
    </Card>
  )
}

export default RecipeCard
