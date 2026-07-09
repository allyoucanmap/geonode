
export function createIcon(displayName, children) {
  function Icon({ size = '1em', title, className, ...rest }) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="currentColor"
        className={className}
        role={title ? 'img' : undefined}
        aria-hidden={title ? undefined : true}
        {...rest}
      >
        {title ? <title>{title}</title> : null}
        {children}
      </svg>
    )
  }
  Icon.displayName = displayName
  return Icon
}
