import { GridCellRenderer } from "@talxis/base-controls/dist/components/GridCellRenderer";
import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as ReactDOM from "react-dom";
import * as React from "react";
import { mergeStyles } from "@fluentui/react";
import { CustomButtons } from "./CustomButtons/CustomButtons";

export class CustomRibbonDemo implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private _container: HTMLDivElement;
    /**
     * Empty constructor.
     */
    constructor() {

    }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     */
    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement): void {
        this._container = container;
        (context as any).factory.fireEvent("onInit", this);
        // Add control initialization code
    }


    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void {
        const that = this;
        if(context.parameters.Type?.raw === 'custom') {
            return ReactDOM.render(React.createElement(CustomButtons, {
                context: context,
                commands: context.parameters.RecordCommands.raw
            }), this._container)
        }
        return ReactDOM.render(React.createElement(GridCellRenderer, {
                context: context,
                parameters: context.parameters as any,
                onOverrideComponentProps(props) {
                    return {
                        ...props,
                        onGetRecordCommandsProps: (props) => {
                            return {
                                ...props,
                                commandBarProps: {
                                    ...props.commandBarProps,
                                    items: props.commandBarProps.items.map((item) => {
                                        return {
                                            ...item,
                                            iconProps: {},
                                            className: mergeStyles({
                                                '.ms-Button-label': {
                                                    fontWeight: 600
                                                }
                                            }),
                                            text: `${that._getEmojiFromString(item.text!)} ${item.text}`,
                                        };
                                    }),
                                }
                            }
                        }
                    }
                },
            }), this._container);
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
     */
    public getOutputs(): IOutputs {
        return {};
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Add code to cleanup control if necessary
    }

    private _getEmojiFromString(inputString: string): string {
        const emojis = [
            '😀', '😂', '😍', '🤓', '😎',
            '😢', '😡', '👍', '👋', '🎉',
            '❤️', '⭐', '🌈', '🍕', '🚀',
            '🐱', '🐶', '🦄', '🌍', '🎸'
        ];
    
        // Convert string to a number based on character codes
        let hash = 0;
        for (let i = 0; i < inputString.length; i++) {
            hash += inputString.charCodeAt(i);
        }
    
        // Use modulo to get a consistent index within array length
        const index = hash % emojis.length;
        return emojis[index];
    }
}
