import {
  Dispatch,
  forwardRef,
  ReactNode,
  SetStateAction,
  useEffect,
} from "react";

type DropdownProps = {
  translateX?: string;
  translateY?: string;
  setTransform?: Dispatch<SetStateAction<string>>;
  setShowDropdown?: Dispatch<SetStateAction<boolean>>;
  children?: ReactNode;
};

const RowDropdownContentWrapper = forwardRef((props: DropdownProps, ref) => {
  const { translateX, translateY, setTransform, setShowDropdown, children } =
    props;
  useEffect(() => {
    const rect = ref?.current?.getBoundingClientRect();

    // If the dropdown is dropping below the window size (meaning we can't see part of it)
    // reverse the direction and have it point upwards
    if (
      rect.bottom > window.innerHeight ||
      window.innerHeight - rect.bottom < 5
    ) {
      setTransform(`translateY(${translateY || "-95%"})`);

      // Check if dropdown is past the width of the window size
      if (rect.right > window.innerWidth) {
        setTransform(
          `translateY(${translateY || "-95%"}) translateX(${
            translateX || "-20%"
          })`
        );
      }
    } else {
      // Check if dropdown is past the width of the window size
      if (rect.right > window.innerWidth) {
        setTransform(`translateX(${translateX || "-20%"})`);
      }
    }
    setShowDropdown(true);
  }, []);

  return <div>{children}</div>;
});

RowDropdownContentWrapper.displayName = "RowDropdownContentWrapper";

export default RowDropdownContentWrapper;
