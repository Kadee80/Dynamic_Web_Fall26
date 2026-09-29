// receive data as a prop here and map through them
import ImageItem from './ImageItem'

const ImageList = (props) => {
  const {images} = props
  console.log(images)

  const renderedImages = images.map((img) => (
    <ImageItem image={img} key={img.id} />
  ))

  return <div>{renderedImages}</div>
}

export default ImageList
