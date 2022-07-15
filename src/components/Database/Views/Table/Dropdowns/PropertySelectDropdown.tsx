import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import SubjectIcon from "@material-ui/icons/Subject";
import ListIcon from "@material-ui/icons/List";
import EventNoteIcon from "@material-ui/icons/EventNote";
import CheckBoxOutlinedIcon from "@material-ui/icons/CheckBoxOutlined";
import LinkIcon from "@material-ui/icons/Link";

type Props = {
  setShowDropdown: Dispatch<SetStateAction<boolean>>;
};

const PropertySelectDropdown = (props: Props) => {
  const { setShowDropdown } = props;
  const ref = useRef();
  const [transform, setTransform] = useState("");
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const rect = ref?.current?.getBoundingClientRect();

    // If the dropdown is dropping below the window size (meaning we can't see part of it)
    // reverse the direction and have it point upwards
    if (
      rect?.bottom > window?.innerHeight ||
      window?.innerHeight - rect?.bottom < 15
    ) {
      setTransform("translateY(-70%)");

      // Check if dropdown is past the width of the window size
      if (rect?.right > window?.innerWidth) {
        setTransform("translateY(-70%) translateX(-100%)");
      }
    } else {
      // Check if dropdown is past the width of the window size
      if (rect?.right > window?.innerWidth) {
        setTransform("translateX(-88%)");
      }
    }
    setOpacity(100);
  }, []);

  return (
  );
};

export default PropertySelectDropdown;
