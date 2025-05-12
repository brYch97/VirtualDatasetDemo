import { mergeStyleSets } from "@fluentui/react"

export const getCustomButtonsStyles = (height: number) => {
    return mergeStyleSets({
        customButtonsRoot: {
            display: 'flex',
            gap: 15,
            justifyContent: 'flex-end',
            alignItems: 'center',
            height: height
        }
    })
}