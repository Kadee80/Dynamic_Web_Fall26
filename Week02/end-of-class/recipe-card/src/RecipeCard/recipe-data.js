// Importing the image gives us back a url string that Vite knows how to
// serve in dev and how to fingerprint at build time.
// NOTE: the old create-react-app version of this file used
//   imgSrc: require('../../assets/pancake.jpg')
// require() does not exist in a Vite project. Always use import.
import PANCAKE from '../assets/pancake.jpg'

export const RECIPE_DATA = {
  title: 'Buttermilk Pancakes',
  imgSrc: PANCAKE,
  description:
    'Some sort of lovely description about the best buttermilk pancakes in the world.',
  ingredients: [
    {measure: '3/4 cup', item: 'Melted butter'},
    {measure: '2 tbsp', item: 'Whole milk'},
    {measure: '1', item: 'Egg'},
    {measure: '3/4 cup', item: 'All purpose flour'},
    {measure: '2 tsp', item: 'Baking powder'},
    {measure: '2 tbsp', item: 'Sugar'},
    {measure: '1/2 tsp', item: 'Salt'},
  ],
  instructions: [
    'Melt butter',
    'Beat lightly: milk, butter, egg',
    'Add: flour, baking powder, sugar, salt',
    'Mix',
    'Melt a little butter in the pan',
    'Drop batter by tablespoon into the pan',
    'Turn pancakes over when the top is full of little holes and the base is golden',
  ],
}
