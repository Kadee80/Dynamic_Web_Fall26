function shout(word) {
  return word.toUpperCase() + '!'
}

const shout = (word) => {
  return word.toUpperCase() + '!'
}

const shout = (word) => word.toUpperCase() + '!'

const user = {name: 'Ada', role: 'admin'}

const {name, role} = user

const recipe = {title: 'Pancakes', servings: 4}
// "Pancakes serves 4"  recipe.title + ' serves ' + recipe.servings + '.'
const literal = `${recipe.title} serves ${recipe.servings}. `

const ingredients = ['butter', 'milk', 'egg']

const INGREDIENTS = ingredients.map((ingredient) => {
  return ingredient.toUpperCase()
})

// const INGREDIENTS = ingredients.map((ingredient) => ingredient.toUpperCase())
