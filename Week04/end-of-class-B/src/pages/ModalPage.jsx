import {useState} from 'react'
import Button from '../components/Button'
import Modal from '../components/Modal'

const LIPSUM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis pretium, nisl sed iaculis dignissim, tellus odio fermentum nisl, vel mollis risus ipsum eget urna. Fusce et aliquam dui, sed interdum quam. Etiam a luctus purus. Aliquam ultricies tellus a pellentesque dapibus. Praesent sit amet tincidunt orci. Morbi porttitor semper neque, eu sodales lorem scelerisque vitae. Proin vulputate, enim a semper gravida, mauris metus interdum tortor, sit amet accumsan enim tellus eu urna.'

const ModalPage = () => {
  const [modalOpen, setModalOpen] = useState(false)

  const handleClick = () => {
    setModalOpen(true)
  }

  const handleCloseClick = () => {
    setModalOpen(false)
  }

  const modalContent = (
    <p>This is modal content populated by the children prop!</p>
  )

  const actionBar = (
    <>
      <Button
        success
        outline
        onClick={() => {
          console.log('Other button function fired!')
        }}
      >
        Some Prompt
      </Button>

      <Button danger outline onClick={handleCloseClick} className="ml-4">
        Close
      </Button>
    </>
  )

  return (
    <div className="relative">
      {[...Array(15)].map((_, index) => (
        <p key={index} className="mb-8">
          {LIPSUM}
        </p>
      ))}

      <Button success rounded onClick={handleClick}>
        Open Modal!
      </Button>

      {/* Coming Soon, Modal ot Render */}
      {modalOpen && (
        <Modal
          onClose={handleCloseClick}
          title="Yay Modals!"
          actionBar={actionBar}
          crazy
        >
          {modalContent}
        </Modal>
      )}
    </div>
  )
}

export default ModalPage
