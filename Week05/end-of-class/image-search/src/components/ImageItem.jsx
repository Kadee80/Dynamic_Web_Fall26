// an individual image with a div wrapped around for styling purposes
// receives an individual image as props
const ImageItem = (props) => {
  const {image} = props
  return <img src={image.urls.small} alt={image.alt_description} />
}

export default ImageItem
