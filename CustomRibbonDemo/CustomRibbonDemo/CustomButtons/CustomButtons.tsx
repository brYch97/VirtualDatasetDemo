import { PrimaryButton, ThemeProvider } from "@fluentui/react"
import { useControlTheme } from "@talxis/base-controls";
import { ICommand } from "@talxis/client-libraries";
import * as React from "react";
import { getCustomButtonsStyles } from "./styles";

interface ICustomButtonsProps {
    commands: ICommand[];
    context: ComponentFramework.Context<any, any>;
}

export const CustomButtons = (props: ICustomButtonsProps) => {
    const { context, commands } = props;
    const theme = useControlTheme(context.fluentDesignLanguage);
    const styles = React.useMemo(() => getCustomButtonsStyles(context.mode.allocatedHeight), [context.mode.allocatedHeight]);
    return <ThemeProvider className={styles.customButtonsRoot} theme={theme}>
        {commands.map(command => {
            return <PrimaryButton
                key={command.commandId}
                disabled={!command.canExecute}
                onClick={() => command.execute()} 
                text={command.label} />
        })}
    </ThemeProvider>
}