import cx from 'classnames'

const Panel = (props) => {
  const {children, className, ...rest} = props
  const finalClassName = cx(
    className,
    'border rounded-md drop-shadow-md bg-white w-full'
  )

  return (
    <div {...rest} className={finalClassName}>
      {children}
    </div>
  )
}

export default Panel
