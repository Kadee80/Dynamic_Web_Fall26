import Accordion from '../components/Accordion'

const ITEMS = [
  {
    id: '123',
    label: 'How many chickens should I own?',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sed maximus nunc, a scelerisque erat. Curabitur dapibus mauris ut eros vestibulum lacinia at in nisi. Praesent gravida lacus pharetra, aliquet diam et, aliquam leo.',
  },
  {
    id: '456',
    label: 'Do I need a rooster?',
    content:
      'Quisque vestibulum faucibus volutpat. Sed vitae elementum libero. Quisque accumsan erat eget nisl maximus, vel pulvinar nisl vestibulum. In hac habitasse platea dictumst.',
  },
  {
    id: 'l1kj2i0g',
    label: 'When do chickens molt?',
    content:
      'Duis eget turpis vel ligula imperdiet suscipit eu ut felis. Ut eget neque at ligula aliquam ultricies eu vitae dolor. Proin eu dignissim velit. Morbi convallis volutpat nisl at vulputate.',
  },
]

const AccordionPage = () => {
  return (
    <div>
      <h1 className="text-3xl mb-4">Accordion Page</h1>
      <Accordion items={ITEMS} />
    </div>
  )
}

export default AccordionPage
