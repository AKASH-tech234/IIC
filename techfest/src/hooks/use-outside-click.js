import { useEffect } from "react"

/**
 * Hook to detect clicks outside of a component
 * Used by carousel and expandable cards
 */
export const useOutsideClick = (ref, callback) => {
  useEffect(() => {
    const listener = (event) => {
      // Do nothing if the element being clicked is the target element or their children
      if (!ref.current || ref.current.contains(event.target)) {
        return
      }
      callback(event)
    }

    document.addEventListener("mousedown", listener)
    document.addEventListener("touchstart", listener)

    return () => {
      document.removeEventListener("mousedown", listener)
      document.removeEventListener("touchstart", listener)
    }
  }, [ref, callback])
}
