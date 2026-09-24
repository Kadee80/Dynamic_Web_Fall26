import cx from 'classnames'
// twMerge resolves conflicting tailwind classes -- the last one wins.
// Without it, an outline button keeps the `text-white` from its
// colour variant and you get white text on a white background.
import {twMerge} from 'tailwind-merge'

/*
  NOTE ON PROP-TYPES
  ------------------
  Every tutorial you find will validate props with the `prop-types`
  library:

      import PropTypes from 'prop-types'
      Button.propTypes = { primary: PropTypes.bool, … }

  React 19 no longer calls propTypes on function components. The checks
  are silently ignored -- all of the ceremony, none of the safety.

  So: check by hand, like the `count` guard below, or use TypeScript,
  which is where the industry landed and which we get to later.
*/

const Button = (props) => {
  const {
    children,
    primary,
    secondary,
    success,
    warning,
    danger,
    rounded,
    outline,
    ...otherProps
  } = props

  // Only one colour variant should ever be true at a time.
  // !! coerces to a boolean, Number turns that into 0 or 1.
  const count =
    Number(!!primary) +
    Number(!!secondary) +
    Number(!!success) +
    Number(!!warning) +
    Number(!!danger)

  if (count > 1) {
    console.warn(
      'You silly goose! Only one of primary, secondary, success, warning, danger can be TRUE!'
    )
  }

  const baseClass = 'flex items-center px-8 py-3 border'

  // classnames ignores undefined and null -- which is why putting the
  // caller's className first is safe even when they didn't pass one.
  const classes = twMerge(
    cx(otherProps.className, baseClass, {
      // colour variants -- pick one
      'bg-blue-500 border-blue-500 text-white': primary,
      'bg-gray-900 border-gray-900 text-white': secondary,
      'bg-green-500 border-green-500 text-white': success,
      'bg-orange-400 border-orange-500 text-white': warning,
      'bg-red-600 border-red-600 text-white': danger,
      // additional style props
      'rounded-full': rounded,
      'bg-white': outline,
      'text-blue-500': outline && primary,
      'text-gray-900': outline && secondary,
      'text-green-500': outline && success,
      'text-orange-400': outline && warning,
      'text-red-600': outline && danger,
    })
  )

  // ...otherProps collects everything we did NOT destructure above --
  // onClick, onMouseOver, type, disabled -- and forwards it to the
  // real <button>.
  return (
    <button {...otherProps} className={classes}>
      {children}
    </button>
  )
}

export default Button
