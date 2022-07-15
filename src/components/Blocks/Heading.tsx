import { ChangeEvent } from "react";

type Props = {
  temporaryValue?: string;
  headingType: string;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  updateHeading: () => Promise<void>;
  level: number;
  color?: string;
};

const Heading = (props: Props) => {
  const {
    temporaryValue,
    headingType,
    handleChange,
    updateHeading,
    color = "default",
  } = props;

  const classNameString =
    "relative inline-block items-center w-full py-1 px-1.5 font-sans font-semibold text-neutral-900 whitespace-pre-wrap break-words placeholder:text-opacity-40";

  return (
    <div className="flex items-start w-full">
      {headingType === "heading1" && (
        // page title takes the h1 so all header blocks are greater
        <h2 className={`mt-8 text-3xl ${classNameString}`}>
          <input
            autoComplete="off"
            onChange={(e) => handleChange(e)}
            className={`border-none focus:outline-none ${color}`}
            placeholder="Heading 1"
            value={temporaryValue ?? ""}
            onBlur={() => updateHeading()}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.blur();
            }}
          />
        </h2>
      )}
      {headingType === "heading2" && (
        <h3 className={`mt-6 text-2xl ${classNameString}`}>
          <input
            autoComplete="off"
            onChange={(e) => handleChange(e)}
            className={`border-none focus:outline-none ${color}`}
            placeholder="Heading 2"
            value={temporaryValue ?? ""}
            onBlur={() => updateHeading()}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.blur();
            }}
          />
        </h3>
      )}
      {headingType === "heading3" && (
        <h4 className={`mt-5 text-xl ${classNameString}`}>
          <input
            autoComplete="off"
            onChange={(e) => handleChange(e)}
            className={`border-none focus:outline-none ${color}`}
            placeholder="Heading 3"
            value={temporaryValue ?? ""}
            onBlur={() => updateHeading()}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.blur();
            }}
          />
        </h4>
      )}
    </div>
  );
};

export default Heading;
