const RecipeImg = (props) => {
  // destructuring props to get imgSrc and imgAlt
  const {imgSrc, imgAlt} = props
  // const imgSrc = props.imgSrc
  // const imgAlt = props.imgAlt
  return <img className="img" src={imgSrc} alt={imgAlt} />
}

export default RecipeImg

// props = {
//   imgSrc: 'path/to/image.jpg',
//   imgAlt: 'Description of the image',
// }
