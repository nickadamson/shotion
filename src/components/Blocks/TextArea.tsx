import { ChangeEvent, FC, ReactNode } from "react";

type TextAreaProps = {
  temporaryValue?: string;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  updateText: () => Promise<void>;
  children?: ReactNode;
};

const TextArea: FC<TextAreaProps> = (props: TextAreaProps) => {
  const { temporaryValue, handleChange, updateText, children } = props;

  return (
    <div className="">
      <input
        name="text"
        className="userInput text"
        placeholder="Type your text here..."
        value={temporaryValue ?? ""}
        onChange={(e) => handleChange(e)}
        onBlur={() => updateText()}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.currentTarget.blur();
        }}
      />
      {children && <div className="notion-text-children">{children}</div>}
    </div>
  );
};

export default TextArea;
