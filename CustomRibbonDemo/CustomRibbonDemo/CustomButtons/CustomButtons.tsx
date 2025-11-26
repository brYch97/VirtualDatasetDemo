
//@ts-nocheck
import { PrimaryButton, ThemeProvider } from "@fluentui/react"
import { useControlTheme } from "@talxis/base-controls";
import * as React from "react";
import { getCustomButtonsStyles } from "./styles";

interface ICustomButtonsProps {
    items: ICommandBarItemProps[];
    context: ComponentFramework.Context<any, any>;
}

export const CustomButtons = (props: ICustomButtonsProps) => {
    const { context, items } = {...props};
    const theme = useControlTheme(context.fluentDesignLanguage);
    const styles = React.useMemo(() => getCustomButtonsStyles(context.mode.allocatedHeight), [context.mode.allocatedHeight]);
    return <ThemeProvider className={styles.customButtonsRoot} theme={theme}>
        {items.map(command => {
            return <PrimaryButton
                key={command.key}
                disabled={command.disabled}
                onClick={command.onClick}
                text={command.text} />
        })}
    </ThemeProvider>
}