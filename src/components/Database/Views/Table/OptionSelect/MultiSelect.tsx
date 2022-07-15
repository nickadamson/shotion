const MultiSelect = (props: Props) => {
  const node = useRef();
  const [inputValue, changeInputValue] = useState("");
  const [headCell] = useState(
    props.tables[props.tableIndex].rows[0].data[props.colIndex]
  );
  const [data] = useState(
    props.tables[props.tableIndex].rows[props.rowIndex + 1].data[props.colIndex]
  );
  const [transform, setTransform] = useState("");
  const [opacity, setOpacity] = useState(0);

  );
};

export default MultiSelect;
