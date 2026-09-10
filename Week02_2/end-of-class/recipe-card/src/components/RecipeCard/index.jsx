// These are all default exports, so we can name them whatever we like.
import Card from './Card'
import RecipeImg from './RecipeImg'
import RecipeInfo from './RecipeInfo'
import IngredientsList from './IngredientsList'
import InstructionsList from './InstructionsList'
import UserRating from './UserRating'

// A named export needs the exact name and curly braces.
import {RECIPE} from './recipe-data'

import styles from './RecipeCard.module.css'

export default function RecipeCard() {
  return (
    <Card>
      <RecipeImg imgSrc={RECIPE.imgSrc} />
      <div className={styles.card_text}>
        <RecipeInfo title={RECIPE.title} description={RECIPE.description} />
        <div className={styles.card_lists}>
          <IngredientsList ingredients={RECIPE.ingredients} />
          <InstructionsList instructions={RECIPE.instructions} />
        </div>
        <UserRating />
      </div>
    </Card>
  )
}
