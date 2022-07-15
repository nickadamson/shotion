import PageTitle from "../Blocks/PageTitle";
import TextArea from "../Blocks/TextArea";
import { useWorkspaceContext } from "./Context";
import { ChangeEvent, Dispatch, FC, ReactNode, SetStateAction } from "react";
import Heading from "../Blocks/Heading";
import DatabaseViewer from "../Database";
import { DatabaseWithRelations } from "src/pages/api/databases/[databaseId]";
import { FormattedPageWRelations } from "src/pages/api/pages/[pageId]";
import { FormattedBlockWRelations } from "src/pages/api/blocks/[blockId]";
import AddElementDropdown from "../Dropdowns/AddElementDropdown";

interface BlockTypeRendererProps {
  block:
    | DatabaseWithRelations
    | FormattedPageWRelations
    | FormattedBlockWRelations;
  level: number;
  temporaryValue?: any;
  setTemporaryValue?: Dispatch<SetStateAction<any>>;
  updateTitle: () => Promise<void>;
  updateText: () => Promise<void>;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  updateMethod: (updated: any) => Promise<Boolean>;
  children?: ReactNode;
}

export const BlockTypeRenderer: FC<BlockTypeRendererProps> = (props) => {
  const ctx = useWorkspaceContext();
  const { fullPage } = ctx;

  const {
    block,
    level,
    temporaryValue,
    setTemporaryValue,
    updateTitle,
    updateText,
    handleChange,
    children,
  } = props;

  switch (block.type) {
    case "collectionViewPage":
    // fallthrough
    case "page":
      if (level === 0) {
        if (fullPage) {
          return (
            <main>
              {/* <AddElementDropdown block={block} /> */}
              <PageTitle
                temporaryValue={temporaryValue}
                handleChange={handleChange}
                updateTitle={updateTitle}
                level={level}
              />

              {block.type !== "collectionViewPage" && (
                <article>
                  {children}
                  {/* TODO ADD NEW BLOCK */}
                  <span>++++</span>
                </article>
              )}
            </main>
          );
        } else {
          return <main>{block.type !== "collectionViewPage" && children}</main>;
        }
      }

    case "heading1":
    // fallthrough
    case "heading2":
    // fallthrough
    case "heading3": {
      return (
        <Heading
          temporaryValue={temporaryValue}
          headingType={block.type}
          handleChange={handleChange}
          updateHeading={updateText}
          level={level}
          // color={color}
        />
      );
    }

    case "divider":
      return (
        <hr className="p-0 mx-6 w-full border-t-0 border-opacity-10 border-neutral-800" />
      );

    case "text":
      return (
        <TextArea
          temporaryValue={temporaryValue}
          handleChange={handleChange}
          updateText={updateText}
        >
          {children}
        </TextArea>
      );

    case "columnList":
      return <div>{children}</div>;

    case "column": {
      // note: notion uses 46px
      const spacerWidth = `min(32px, 4vw)`;
      const ratio = block?.format?.columnRatio || 0.5;
      const columns = 2;
      //   parent?.content?.length || Math.max(2, Math.ceil(1.0 / ratio));

      const width = `calc((100% - (${
        columns - 1
      } * ${spacerWidth})) * ${ratio})`;
      const style = { width };

      return (
        <>
          <div>{children}</div>

          <div />
        </>
      );
    }

    case "childDatabase":
      if (block?.object === "block") {
        return (
          <>
            <>{children}</>
          </>
        );
      }
      if (block?.object === "database") {
        // if (block?.defaultView?.type === "table") {
        // database renderer/wrapper here
        return (
          <>
            <DatabaseViewer
              database={block as DatabaseWithRelations}
              temporaryTitleValue={temporaryValue}
              handleTitleChange={handleChange}
              updateTitle={updateTitle}
            />
          </>
        );
      } else {
      }

    case "toggle":
      return (
        <>
          <details>
            <summary>
              {/* <TextArea
                handleChange={handleChange}
                temporaryValue={temporaryValue}
                updateText={updateText}
              /> */}
            </summary>

            {children}
          </details>
        </>
      );

    default:
      if (process.env.NODEENV !== "production") {
        console.log(
          "Unsupported type " + (block as any).type,
          JSON.stringify(block, null, 2)
        );
      }

      return <div />;
  }
};
