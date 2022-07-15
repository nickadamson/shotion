import { ChangeEvent, FC } from "react";

type TitleProps = {
  temporaryValue?: string;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  updateTitle: () => Promise<void>;
  level?: Number;
};

const PageTitle: FC<TitleProps> = (props: TitleProps) => {
  const { temporaryValue, handleChange, updateTitle, level } = props;

  return (
    <div className="inline-flex items-center max-w-full min-h-4 mb-12">
      {/* <PageIcon
      block={object}
      // defaultIcon={defaultIcon}
      className="notion-page-title-icon"
    /> */}
      <h1
        className={`font-sans font-medium whitespace-nowrap overflow-ellipsis overflow-hidden ${
          level === 0 ? "text-4xl top-px" : ""
        }`}
      >
        <input
          name="title"
          className="relative border-none border-b-neutral-900 focus:outline-none"
          placeholder="Untitled"
          value={temporaryValue ?? ""}
          onChange={(e) => handleChange(e)}
          onBlur={() => updateTitle()}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.currentTarget.blur();
          }}
        />
      </h1>
    </div>
  );
};

export default PageTitle;
