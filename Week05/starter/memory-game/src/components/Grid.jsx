import Card from './Card'
import Bilbo from '../assets/bilbo-baggins.png'
import Cameron from '../assets/cameron-poe.png'
import Nikki from '../assets/nikki-cage.png'
import Pollux from '../assets/pollux-troy.png'

// Four images. A real game needs eight cards -- two of each -- in a random
// order, which is the first thing we do in class.
const cardImages = [{src: Bilbo}, {src: Cameron}, {src: Nikki}, {src: Pollux}]

const Grid = () => {
  return (
    <div className="grid grid-cols-4 gap-4 max-w-3xl">
      {cardImages.map((card) => (
        <Card key={card.src} card={card} />
      ))}
    </div>
  )
}

export default Grid
