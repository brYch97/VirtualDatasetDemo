const MEMORY_PROVIDER_CONTROL = 'talxis_memorybindingfield';
const COLUMNS_INTERCEPTOR_CONTROL_NAME = 'talxis_talxis_columnsinterceptorbindingfield';
const DYNAMIC_CELL_VALUES_CONTROL_NAME = 'talxis_clientapidynamiccellvalues';
const CELL_VALIDATION_CONTROL_NAME = 'talxis_clientapicellvalidation';
const CELL_DISABLING_CONTROL_NAME = 'talxis_clientapicelldisabling';
const CELL_NOTIFICATIONS_CONTROL_NAME = 'talxis_clientapicellnotifications';
const CELL_LOADING_CONTROL_NAME = 'talxis_clientapicellloading';
const CELL_FORMATTING_CONTROL_NAME = 'talxis_clientapicellformatting';
const CELL_CONTROL_PARAMETERS_CONTROL_NAME = 'talxis_clientapicellcontrolparameters';
const CELL_DYNAMIC_HEIGHT_CONTROL_NAME = 'talxis_clientapicelldynamicheight';
const CELL_CUSTOMIZER_CONTROL_NAME = 'talxis_clientapicellcustomizers';
const CELL_ONE_CLICK_EDIT_CONTROL_NAME = 'talxis_clientapicelloneclickedit';
const CELL_CUSTOMIZER_ASYNC_CONTROL_NAME = 'talxis_clientapicellasynccustomizer';

const CELL_CUSTOMIZER = {
    controls: [{
        appliesTo: 'editor',
        name: 'talxis_TALXIS.PCF.ColorPicker'
    }]
}

const CELL_CUSTOMIZER_ASYNC = {
    alignment: 'left',
    controls: [{
        appliesTo: 'renderer',
        name: 'talxis_TALXIS.PCF.AsyncCellRenderer'
    }]
}


function onFormLoad(executionContext) {
    const formContext = executionContext.getFormContext();

    const memoryProviderControl = formContext.getControl(MEMORY_PROVIDER_CONTROL);
    const columnsInterceptorControl = formContext.getControl(COLUMNS_INTERCEPTOR_CONTROL_NAME);
    const dynamicCellValuesControl = formContext.getControl(DYNAMIC_CELL_VALUES_CONTROL_NAME);
    const cellValidationControl = formContext.getControl(CELL_VALIDATION_CONTROL_NAME);
    const cellDisablingControl = formContext.getControl(CELL_DISABLING_CONTROL_NAME);
    const cellNotificationsControl = formContext.getControl(CELL_NOTIFICATIONS_CONTROL_NAME);
    const cellLoadingControl = formContext.getControl(CELL_LOADING_CONTROL_NAME);
    const cellFormattingControl = formContext.getControl(CELL_FORMATTING_CONTROL_NAME);
    const cellControlParametersControl = formContext.getControl(CELL_CONTROL_PARAMETERS_CONTROL_NAME);
    const cellDynamicHeightControl = formContext.getControl(CELL_DYNAMIC_HEIGHT_CONTROL_NAME);
    const cellCustomizerControl = formContext.getControl(CELL_CUSTOMIZER_CONTROL_NAME);
    const cellOneClickEditControl = formContext.getControl(CELL_ONE_CLICK_EDIT_CONTROL_NAME);
    const cellCustomizerAsyncControl = formContext.getControl(CELL_CUSTOMIZER_ASYNC_CONTROL_NAME);

    registerControl(memoryProviderControl, [registerGeneralEvents]);
    registerControl(columnsInterceptorControl, [registerGeneralEvents, registerColumnsInterceptorEvents])
    registerControl(dynamicCellValuesControl, [registerGeneralEvents, registerDynamicCellValuesEvents]);
    registerControl(cellValidationControl, [registerGeneralEvents, registerDynamicCellValuesEvents, registerValidationEvents])
    registerControl(cellDisablingControl, [registerGeneralEvents, registerCellDisabledEvents])
    registerControl(cellNotificationsControl, [registerGeneralEvents, registerCellNotificationsEvents])
    registerControl(cellLoadingControl, [registerGeneralEvents, registerCellLoadingEvents]);
    registerControl(cellFormattingControl, [registerGeneralEvents, registerCellFormattingEvents])
    registerControl(cellControlParametersControl, [registerGeneralEvents, registerDynamicCellValuesEvents, registerCellControlParametersEvents]);
    registerControl(cellDynamicHeightControl, [registerGeneralEvents, registerDynamicCellHeightEvents]);
    registerControl(cellCustomizerControl, [registerGeneralEvents, (dataset) => registerCellFormattingEvents(dataset, CELL_CUSTOMIZER)]);
    registerControl(cellOneClickEditControl, [registerGeneralEvents, registerCellOneClickEditEvents]);
    registerControl(cellCustomizerAsyncControl, [registerGeneralEvents, (dataset) => registerCellFormattingEvents(dataset, CELL_CUSTOMIZER_ASYNC, false), registerAsyncCellRendererEvents])

}

const registerControl = (control, registerCallbacks) => {
    control.addOnOutputChange(() => {
        const dataset = control.getOutputs()[`${control.getName()}.fieldControl.DatasetControl`].value;
        registerCallbacks.map(callback => callback(dataset))
    })
}

const registerColumnsInterceptorEvents = (dataset) => {
    dataset.setInterceptor('columns', (columns) => {
        const newColumnsMap = getDemoColumnsMap(columns);
        [...newColumnsMap.values()].map(col => {
            const emoji = getEmojiFromString(col.name);
            if (!col.displayName.endsWith(emoji)) {
                newColumnsMap.set(col.name, { ...col, displayName: `${col.displayName} ${emoji}` })
            }
        })
        newColumnsMap.set('interceptor_column', {
            name: 'interceptor_column',
            dataType: "MultiSelectPicklist",
            displayName: `Interceptor MultiSelectOptionSet ${getEmojiFromString()}`,
            metadata: {
                IsValidForUpdate: true,
                OptionSet: [{
                    Label: 'Interceptor Option 1',
                    Value: 1,
                    Color: '#FFC107'
                }, {
                    Label: 'Interceptor Option 2',
                    Value: 2,
                    Color: '#E6E6FA'
                }]
            }
        })
        return [...newColumnsMap.values()];
    });
}

const registerDynamicCellValuesEvents = (dataset) => {
    dataset.setInterceptor('columns', (columns) => {
        const newColumnsMap = getDemoColumnsMap(columns);
        newColumnsMap.set('sum', {
            name: 'sum',
            displayName: 'Sum',
            dataType: 'Decimal'
        })

        return [...newColumnsMap.values()];
    })
    dataset.addEventListener('onRecordLoaded', (record) => {
        record.expressions.setValueExpression('sum', () => {
            const valueA = record.getValue('number') ?? 0;
            const valueB = record.getValue('decimal') ?? 0;
            return valueA + valueB;
        })
        record.expressions.setFormattedValueExpression('text', (defaultFormattedValue) => {
            if(!defaultFormattedValue) {
                return defaultFormattedValue;
            }
            return `${getEmojiFromString(defaultFormattedValue)} ${defaultFormattedValue}`
        })
    })
}

const registerCellOneClickEditEvents = (dataset) => {
    dataset.setInterceptor('columns', (columns) => {
        const newColumnsMap = new Map(columns.map(col => [col.name, col]));
        [...newColumnsMap.values()].map(col => {
            newColumnsMap.set(col.name, { ...newColumnsMap.get(col.name), oneClickEdit: true })
        })
        return [...newColumnsMap.values()];
    })
}

const registerCellDisabledEvents = (dataset) => {
    dataset.setInterceptor('columns', (columns) => {
        const newColumnsMap = getDemoColumnsMap(columns);
        return [...newColumnsMap.values()];
    })
    dataset.addEventListener('onRecordLoaded', (record) => {
        record.expressions.setDisabledExpression('text', () => {
            if (record.getValue('text')?.startsWith('M')) {
                return true;
            }
            return false;
        })
    })
}

const registerDynamicCellHeightEvents = (dataset) => {
    dataset.setInterceptor('columns', (columns) => {
        const newColumnsMap = getDemoColumnsMap(columns);
        newColumnsMap.set('multilinetext', {
            name: 'multilinetext',
            displayName: 'Multiline Text',
            dataType: 'Multiple',
            metadata: {
                IsValidForUpdate: true
            }
        })
        return [...newColumnsMap.values()];
    });
    dataset.addEventListener('onRecordLoaded', (record) => {
        record.expressions?.ui.setHeightExpression('multilinetext', (columnWidth, rowHeight) => {
            const value = record.getValue('multilinetext') ?? "";
            const length = value.length;
            let minHeight = rowHeight;
            let maxHeight = 200;
            if (length === 0) {
                return rowHeight;
            }
            const avgCharWidth = 14 * 0.5;

            // Calculate the max number of characters that fit in one line
            const charsPerLine = Math.floor(columnWidth / avgCharWidth);

            // Calculate the number of lines needed
            const numLines = Math.ceil(value.length / charsPerLine);

            // Calculate the height based on the number of lines
            const lineHeight = 14 * 1.5;
            let totalHeight = numLines * lineHeight;
            if (totalHeight < minHeight) {
                totalHeight = minHeight;
            }
            if (totalHeight > maxHeight) {
                totalHeight = maxHeight
            }
            return Math.ceil(totalHeight);
        })
    })
}

const registerCellFormattingEvents = (dataset, overrides, useCustomFormatting = true) => {
    dataset.setInterceptor('columns', (columns) => {
        const newColumnsMap = getDemoColumnsMap(columns);
        newColumnsMap.set('color', {
            name: 'color',
            dataType: "SingleLine.Text",
            displayName: "Color",
            alignment: 'right',
            metadata: {
                IsValidForUpdate: true
            },
            ...(overrides ? overrides : {})
        })
        return [...newColumnsMap.values()];
    })
    dataset.addEventListener('onRecordLoaded', (record) => {
        record.expressions.ui.setCustomFormattingExpression("color", () => {
            if(!useCustomFormatting) {
                return;
            }
            const color = record.getValue('color');
            if (!color?.startsWith('#')) {
                return undefined;
            }
            return {
                backgroundColor: color,
                themeOverride: {
                    fonts: {
                        medium: {
                            fontFamily: 'Consolas, monaco, monospace',
                            fontWeight: 600
                        }
                    },
                }
            };
        });
        record.expressions.ui.setCustomFormattingExpression('number', (defaultCellTheme) => {
            if(!useCustomFormatting) {
                return;
            }
            const value = record.getValue('number');
            const themeOverride = {
                fonts: {
                    medium: {
                        fontWeight: 600
                    }
                },
            }
            if (value <= 0) {
                return {
                    backgroundColor: defaultCellTheme.semanticColors.errorBackground,
                    textColor: defaultCellTheme.semanticColors.errorText,
                    themeOverride: themeOverride
                }
            }
            return {
                backgroundColor: defaultCellTheme.semanticColors.successBackground,
                textColor: defaultCellTheme.semanticColors.successIcon,
                themeOverride: themeOverride
            }
        })
    })
}

const registerCellLoadingEvents = (dataset) => {
    const loadingMap = new Map();
    dataset.setInterceptor('columns', (columns) => {
        const newColumnsMap = getDemoColumnsMap(columns);
        newColumnsMap.set('actions', {
            name: 'actions',
            displayName: '',
            type: 'action'
        })
        return [...newColumnsMap.values()];
    })
    dataset.addEventListener('onRecordLoaded', (record) => {
        for (const column of dataset.columns) {
            record.expressions?.ui.setLoadingExpression(column.name, () => {
                return loadingMap.get(record.getRecordId()) ?? false;
            })
        }
        record.expressions.ui.setNotificationsExpression('actions', () => {
            return [{
                uniqueId: 'increment',
                iconName: 'LightningBolt',
                text: 'Run async operation',
                actions: [{
                    actions: [async () => {
                        loadingMap.set(record.getRecordId(), true);
                        dataset.render();
                        await new Promise((resolve) => {
                            setTimeout(() => {
                                isLoading = false;
                                resolve(undefined);
                            }, 5000);
                        })
                        loadingMap.set(record.getRecordId(), false);
                        dataset.render();
                    }]
                }]
            }
            ];
        })
    })
}

const registerCellNotificationsEvents = (dataset) => {
    dataset.setInterceptor('columns', (columns) => {
        const newColumnsMap = getDemoColumnsMap(columns);
        newColumnsMap.set('actions', {
            name: 'actions',
            displayName: '',
            visualSizeFactor: 200,
            type: 'action'
        })
        newColumnsMap.set('decimal', { ...newColumnsMap.get('decimal'), oneClickEdit: true })
        return [...newColumnsMap.values()];
    })
    dataset.addEventListener('onRecordLoaded', (record) => {
        record.expressions.ui.setNotificationsExpression('actions', () => {
            return [{
                uniqueId: 'action1',
                iconName: 'LightningBolt',
                text: 'Single Action',
                actions: [{
                    actions: [() => {
                        alert('Single Action')
                    }]
                }]
            },
            {
                uniqueId: 'action2',
                iconName: 'LightningBolt',
                text: 'Two Actions',
                messages: ['Choose one of the following actions:'],
                actions: [{
                    message: 'Action 1',
                    actions: [() => alert('Action 1')]
                }, {
                    message: 'Action 2',
                    actions: [() => alert('Action 2')]
                }]
            },
            {
                uniqueId: 'action3',
                iconName: 'LightningBolt',
                text: 'Multiple Actions',
                messages: ['Choose one of the following actions:'],
                actions: [{
                    message: 'Action 1',
                    actions: [() => alert('Action 1')]
                }, {
                    message: 'Action 2',
                    actions: [() => alert('Action 2')]
                },
                {
                    message: 'Action 3',
                    actions: [() => alert('Action 3')]
                }, {
                    message: 'Action 4',
                    actions: [() => alert('Action 4')]
                }
                ]
            }
            ];
        })
        record.expressions.ui.setNotificationsExpression('decimal', () => {
            return [{
                uniqueId: 'increment',
                iconName: 'Add',
                text: 'Increment',
                buttonProps: {
                    iconOnly: true
                },
                actions: [{
                    actions: [() => {
                        const value = record.getValue('decimal') ?? 0;
                        record.setValue('decimal', value + 1);
                        dataset.render();
                    }]
                }]
            },
            {
                uniqueId: 'decrement',
                iconName: 'Remove',
                buttonProps: {
                    iconOnly: true
                },
                text: 'Decrement',
                actions: [{
                    actions: [() => {
                        const value = record.getValue('decimal') ?? 0;
                        record.setValue('decimal', value - 1);
                        dataset.render();
                    }]
                }]
            }
            ];
        })
        record.expressions.ui.setNotificationsExpression('text', () => {
            return [{
                uniqueId: 'increment',
                iconName: 'BeerMug',
                text: 'Give a Beer',
                buttonProps: {
                    iconOnly: true
                },
                actions: [{
                    actions: [() => {
                        alert(`${record.getValue('text')} has received a beer!`)
                    }]
                }]
            }
            ];
        })
    })
}

const registerValidationEvents = (dataset) => {
    dataset.addEventListener('onRecordLoaded', (record) => {
        record.expressions.setValidationExpression('sum', () => {
            const value = record.getValue('sum') ?? 0;
            return {
                error: value <= 50000000,
                errorMessage: value <= 50000000 ? 'Has to be bigger than 50000000' : ''
            }
        })
    })
}

const registerCellControlParametersEvents = (dataset) => {
    dataset.addEventListener('onRecordLoaded', (record) => {
        record.expressions.ui.setControlParametersExpression('decimal', (defaultParameters) => {
            return {
                ...defaultParameters,
                SuffixIcon: {
                    raw: JSON.stringify({
                        iconName: 'CheckMark'
                    })
                }
            }
        })
        record.expressions.ui.setControlParametersExpression('number', (defaultParameters) => {
            return {
                ...defaultParameters,
                SuffixIcon: {
                    raw: JSON.stringify({
                        imageProps: {
                            src: 'https://img.icons8.com/?size=512&id=OU2ddOKw840K&format=png'
                        }
                    })
                }
            }
        })
    })
}

const registerAsyncCellRendererEvents = (dataset) => {
    const cache = new Map();
    dataset.paging.setPageSize(25);

    dataset.addEventListener("onNewDataLoaded", async () => {
        cache.clear();
        const currentPageRecordIds = [];
        Object.values(dataset.records).map((record) => {
            currentPageRecordIds.push(record.getRecordId());
        });
        await new Promise((resolve) => {
            //this set timeout mock async operation like an API call,
            //you should ideally use one API call to get results for all records on page
            setTimeout(() => {
                currentPageRecordIds.map((id) => {
                    cache.set(
                        id,
                        `${id}_async_value_page_${dataset.paging.pageNumber}`
                    );
                });
                resolve(undefined);
            }, 5000);
        });
        dataset.render();
    });

    dataset.addEventListener("onDatasetDestroyed", () => {
        cache.clear();
    });

    dataset.addEventListener("onRecordLoaded", (record) => {
        record.expressions.ui.setControlParametersExpression("color", (defaultParameters) => {
            const data = cache.get(record.getRecordId());
            if (!data) {
                return defaultParameters;
            }
            return {
                ...defaultParameters,
                Data: {
                    raw: data,
                },
            };
        }
        );
        record.expressions.ui.setLoadingExpression("color", () => {
            if (!cache.get(record.getRecordId())) {
                return true;
            }
            return false;
        });
        record.expressions.ui.setLoadingExpression("color", () => {
            if (!cache.get(record.getRecordId())) {
                return true;
            }
            return false;
        });
    });
}

const registerGeneralEvents = (dataset) => {
    let saveResults = [];
    dataset.addEventListener('onRecordSave', (record) => {
        saveResults.push(JSON.stringify({
            [record.getRecordId()]: record.getChanges()
        }));
        setTimeout(() => {
            if (saveResults.length === 0) {
                return;
            }
            Xrm.Navigation.openAlertDialog({
                title: `onRecordSave (will not be saved to the data source in this demo)`,
                text: `Changed Records: ${JSON.stringify(saveResults)}`
            })
            saveResults = [];
        }, 0);
    })
    dataset.addEventListener('onDatasetItemOpened', (entityReference) => {
        Xrm.Navigation.openAlertDialog({
            title: `onDatasetItemOpened`,
            text: `Opening record ${entityReference.name}`
        })
    })
    dataset.addEventListener('onRecordsSelected', (ids) => {
        console.log(`Selected record ids: ${ids}`);
    })
    dataset.addEventListener('onRecordColumnValueChanged', (record, columnName) => {
        console.log(`${record.getRecordId()}_${columnName}, New value: ${record.getValue(columnName)}
        `)
    })
}

const getDemoColumnsMap = (columns) => {
    const columnsToInclude = ['text', 'number', 'decimal'];
    const newColumns = columns.filter(x => columnsToInclude.includes(x.name));
    const newColumnsMap = new Map(newColumns.map(col => [col.name, col]));
    return newColumnsMap;
}

const getEmojiFromString = (inputString = '') => {
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
};

//Cell customizers provide a flexible way to modify or entirely replace the controls used for rendering cells. Depending on the specific customization requirements, you can choose from various levels of customization to suit your needs.