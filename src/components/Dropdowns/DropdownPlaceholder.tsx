import { forwardRef, useEffect } from "react";

const DropdownContentPlaceholder = forwardRef((props, ref) => {
  useEffect(() => {
    const rect = ref.current.getBoundingClientRect();

    // If the dropdown is dropping below the window size (meaning we can't see part of it)
    // reverse the direction and have it point upwards
    if (
      rect.bottom > window.innerHeight ||
      window.innerHeight - rect.bottom < 5
    ) {
      props.setTransform(`translateY(${props.translateY || "-95%"})`);

      // Check if dropdown is past the width of the window size
      if (rect.right > window.innerWidth) {
        props.setTransform(
          `translateY(${props.translateY || "-95%"}) translateX(${
            props.translateX || "-20%"
          })`
        );
      }
    } else {
      // Check if dropdown is past the width of the window size
      if (rect.right > window.innerWidth) {
        props.setTransform(`translateX(${props.translateX || "-20%"})`);
      }
    }
    // props.setOpacity(100);
  }, []);

  return <div>{props.children}</div>;
});
export default DropdownContentPlaceholder;
