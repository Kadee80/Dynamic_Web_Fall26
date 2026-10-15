import {useState, useEffect} from 'react'
import Card from './Card'
import Bilbo from '../assets/bilbo-baggins.png'
import Cameron from '../assets/cameron-poe.png'
import Nikki from '../assets/nikki-cage.png'
import Pollux from '../assets/pollux-troy.png'

const cardImages = [{src: Bilbo}, {src: Cameron}, {src: Nikki}, {src: Pollux}]

const Grid = () => {
  // the deck lives in state, because the board has to change when somebody
  // clicks New Game
  const [cards, setCards] = useState([])
  const [choiceOne, setChoiceOne] = useState(null)
  const [choiceTwo, setChoiceTwo] = useState(null)
  const [turns, setTurns] = useState(0)
  const [disabled, setDisabled] = useState(false)
  const [won, setWon] = useState(false)

  const shuffleCards = () => {
    const shuffled = [...cardImages, ...cardImages]
      // sort calls this for pairs of items. A negative number leaves them
      // alone, a positive number swaps them -- so a random one shuffles.
      .sort(() => Math.random() - 0.5)
      // every card needs its own id: there are two of each image now, so
      // `src` no longer tells the two copies apart
      .map((card) => ({...card, id: crypto.randomUUID()}))

    setCards(shuffled)
    setTurns(0)
  }

  const handleChoice = (card) => {
    // guard clause: get the impossible clicks out of the way first,
    // so that real logic underneath only runs on a legal move
    if (disabled || card === choiceOne || card === choiceTwo) {
      return
    }

    // no choice yet? this is choice one. Otherwise it is choice two.
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card)

    // This will not work (yet), because state updates are queued until the next render
    if (choiceOne && choiceTwo) {
      // console.log('comparing', choiceOne.src, choiceTwo.src)
    }
  }

  const resetTurn = () => {
    setChoiceOne(null)
    setChoiceTwo(null)
    // re-allow click events for the next turn
    setDisabled(false)
    // add one count to turns whenever the cards reset
    setTurns((prevTurns) => prevTurns + 1)
  }

  // a seconds effect, watches different pieces of state than the other
  // cards changes when a pair is matched, so that is when we need the check
  // cards.length > 0 keeps it from declaring a win on an empty board
  useEffect(() => {
    if (cards.length > 0 && cards.every((card) => card.matched)) {
      setWon(true)
    }
  }, [cards])

  useEffect(() => {
    // make sure we have both choices before bothering to compare
    if (choiceOne && choiceTwo) {
      // we have both choices, disable any more clicks
      setDisabled(true)
      // do they match?
      if (choiceOne.src == choiceTwo.src) {
        console.log('match')
        // they match, reset choices to null
        setCards((prevCards) => {
          return prevCards.map((card) => {
            if (card.src === choiceOne.src) {
              return {...card, matched: true}
            }
            return card
          })
        })
        // no set timeout here, they match and its set in state,
        // so the matched true logic is added to the flipped logic in the card
        // render itself
        resetTurn()
      } else {
        console.log('no match')
        // without the wait, the pair is compared and reset before the 0.6s the flip takes to finish
        // nobody ever sees the second card, an the app looks broken
        setTimeout(() => resetTurn(), 2000)
      }
    }
  }, [choiceOne, choiceTwo])

  return (
    <>
      <button
        onClick={shuffleCards}
        className="bg-blue-900 text-white uppercase px-8 py-4 rounded-lg mb-6"
      >
        New Game
      </button>
      <p className="mb-6 text-lg">Turns used: {turns}</p>

      {won && (
        <p className="mb-6 text-2xl font-bold text-green-700">
          You cleared the board in {turns} turns!
        </p>
      )}

      <div className="grid grid-cols-4 gap-4 max-w-3xl">
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            handleChoice={handleChoice}
            flipped={card === choiceOne || card === choiceTwo || card.matched}
          />
        ))}
      </div>
    </>
  )
}

export default Grid
