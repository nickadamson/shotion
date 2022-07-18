// react-notion-x
import { createContext, FC, memo, ReactNode, useContext, useMemo } from "react";

export interface WorkspaceContext {
    workspaceId: string;
    workspaceObject: string;
    fullPage: boolean;
    darkMode: boolean;
    zoom: any;
    children?: ReactNode;
}

export interface PartialWorkspaceContext {
    workspaceId?: string;
    workspaceObject?: string;
    fullPage?: boolean;
    darkMode?: boolean;
    zoom?: any;
    children?: ReactNode;
}

const DefaultLink: FC = (props) => <a target="blank"  {...props} />;
const DefaultLinkMemo = memo(DefaultLink);
const DefaultPageLink: FC = (props) => <a {...props} />;
const DefaultPageLinkMemo = memo(DefaultPageLink);

export const dummyLink = ({ href, rel, target, title, ...rest }) => <span {...rest} />;

// eslint-disable-next-line react/display-name
const dummyComponent = (name: string) => () => {
    console.warn(`Warning: using empty component "${name}" (you should override this in WorkspaceRenderer.components)`);

    return null;
};

// https://reactjs.org/docs/react-api.html#reactmemo
const dummyOverrideFn = (_: any, defaultValueFn: () => ReactNode) => defaultValueFn();

const defaultComponents = {
    Image: null, // disable custom images by default
    Link: DefaultLinkMemo,
    PageLink: DefaultPageLinkMemo,
    Callout: undefined, // use the built-in callout rendering by default

    Code: dummyComponent("Code"),
    Equation: dummyComponent("Equation"),

    Collection: dummyComponent("Collection"),
    Property: undefined, // use the built-in property rendering by default

    propertyTextValue: dummyOverrideFn,
    propertySelectValue: dummyOverrideFn,
    propertyRelationValue: dummyOverrideFn,
    propertyFormulaValue: dummyOverrideFn,
    propertyTitleValue: dummyOverrideFn,
    propertyPersonValue: dummyOverrideFn,
    propertyFileValue: dummyOverrideFn,
    propertyCheckboxValue: dummyOverrideFn,
    propertyUrlValue: dummyOverrideFn,
    propertyEmailValue: dummyOverrideFn,
    propertyPhoneNumberValue: dummyOverrideFn,
    propertyNumberValue: dummyOverrideFn,
    propertyLastEditedTimeValue: dummyOverrideFn,
    propertyCreatedTimeValue: dummyOverrideFn,
    propertyDateValue: dummyOverrideFn,

    Pdf: dummyComponent("Pdf"),
    Tweet: dummyComponent("Tweet"),
    Modal: dummyComponent("Modal"),
};

const defaultContext = {
    workspaceId: "",
    workspaceObject: "",

    components: defaultComponents,

    search: null,

    fullPage: false,
    darkMode: false,
    previewImages: false,
    forceCustomImages: false,
    showCollectionViewDropdown: true,
    linkTableTitleProperties: true,

    showTableOfContents: false,
    minTableOfContentsItems: 3,

    defaultPageIcon: null,
    defaultPageCover: null,
    defaultPageCoverPosition: 0.5,

    zoom: null,
};

const ctx = createContext<WorkspaceContext>(defaultContext);

export const WorkspaceContextProvider: FC<PartialWorkspaceContext> = ({
    workspaceId,
    workspaceObject,
    children,
    ...rest
}) => {
    for (const key of Object.keys(rest)) {
        if (rest[key] === undefined) {
            delete rest[key];
        }
    }

    const value = useMemo(
        () => ({
            ...defaultContext,
            workspaceId,
            workspaceObject,
            ...rest,
        }),
        [workspaceId, workspaceObject, rest]
    );

    return <ctx.Provider value={value}>{children}</ctx.Provider>;
};

export const WorkspaceContextConsumer = ctx.Consumer;

export const useWorkspaceContext = (): WorkspaceContext => useContext(ctx);
