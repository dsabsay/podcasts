# TODO

## Problem: Media queries don't work in inline styles
Media queries cannot be used in inline styles. Most styling in Elementary is accomplished through inline styles. Media queries can be used directly in JS using `window.matchMedia` as in the example below:
    ```javascript
        if (window.matchMedia(`(min-width: ${bp}px`).matches) {
            ...
        }
    ```
    However, if this is used for conditional styling based on viewport size breakpoints, the media query won't necessarily be re-evaluated when the browser is resized. The component containing the `window.matchMedia` call would have to be re-rendered. Thus, when the browser is resized and crosses a breakpoint, the conditional styling will not take effect until the page is refreshed, or the component is re-rendered due to some other event (e.g. a state update).

### Potential Solutions
#### 1. Create stylesheet and generate unique id for component

Create a stylesheet with the media queries and attach it to the DOM. Then we'd need some CSS selectors to apply the rules to only the desired elements. We could write a function that would generate a unique id for the element and use that in the CSS rule/stylesheet. 

This function would have to be called during the render phase, inside the Elementary libary, probably in the `compose()` or `makeHTML()` function.

How would we expose this feature to users?

Could be exposed via a special prop.

Another way to do this would be to just create a wrapper Function Component with a special prop. The wrapper component could add the CSS stylesheet to the DOM, add the generated ID to the element, and return the wrapped component.

An interface like the following would be nice:

```javascript
/* Allows user to apply media queries to the wrapped component.
 *
 * comp - The component that will be wrapped.
 */
const MediaQuery = function(comp) {
  
}
```

How would we prevent duplicate stylesheets getting added to the DOM? (One would get added every time the component is rendered/re-rendered).

Just append the stylesheet to the element. The element will be replaced on the next render.

Upon further investigation, non-trivial modifications will need to be made deep inside Elementary for this to work. The primary problem is there is no easy way to inject a classname into a component from the client perspective. It would probably need to be done by the library itself.

#### 2. Allow user to inject a stylesheet into a component

Allow the user to define a stylesheet (including media queries) and inject that into a component. Make the user responsible for applying the styling to the desired components (by using classes, IDs, etc.).
