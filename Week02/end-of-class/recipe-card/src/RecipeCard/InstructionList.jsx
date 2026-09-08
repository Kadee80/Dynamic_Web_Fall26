const InstructionList = (props) => {
  const {instructions} = props
  return (
    <div className="instructions_list">
      <h3 className="list_title">Instructions:</h3>
      <ol>
        {instructions.map((inst, index) => {
          return <li key={index}>{inst}</li>
        })}
      </ol>
    </div>
  )
}

export default InstructionList
