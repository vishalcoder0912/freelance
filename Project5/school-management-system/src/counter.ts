/**
 * Sets up a click-counter on the given button element.
 * Each click increments the count and updates the button text.
 *
 * @param element - The button element to attach the counter to.
 */
export function setupCounter(element: HTMLButtonElement) {
  let counter = 0

  // Update the button text to reflect the current count
  const setCounter = (count: number) => {
    counter = count
    element.innerHTML = `Count is ${counter}`
  }

  // Increment counter on each click
  element.addEventListener('click', () => setCounter(counter + 1))
  // Initialize display at 0
  setCounter(0)
}
