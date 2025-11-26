const MEMORY_PROVIDER_CONTROL = 'talxis_memorybindingfield';
const COLUMNS_INTERCEPTOR_CONTROL_NAME = 'talxis_talxis_columnsinterceptorbindingfield';
const DYNAMIC_CELL_VALUES_CONTROL_NAME = 'talxis_clientapidynamiccellvalues';
const CELL_VALIDATION_CONTROL_NAME = 'talxis_clientapicellvalidation';
const CELL_DISABLING_CONTROL_NAME = 'talxis_clientapicelldisabling';
const CELL_NOTIFICATIONS_CONTROL_NAME = 'talxis_clientapicellnotifications';
const CELL_LOADING_CONTROL_NAME = 'talxis_clientapicellloading';
const CELL_FORMATTING_CONTROL_NAME = 'talxis_clientapicellformatting';
const CELL_CONTROL_PARAMETERS_CONTROL_NAME = 'talxis_clientapicellcontrolparameters';
const CELL_CUSTOMIZER_CONTROL_NAME = 'talxis_clientapicellcustomizers';
const CELL_ONE_CLICK_EDIT_CONTROL_NAME = 'talxis_clientapicelloneclickedit';
const CELL_CUSTOMIZER_ASYNC_CONTROL_NAME = 'talxis_clientapicellasynccustomizer';
const ADVANCED_GRID_CONTROL_NAME = 'Subgrid_new_1';
const ADVANCED_GRID_CONTROL_NAME_FULL_TAB = 'Subgrid_new_2';

const CELL_CUSTOMIZER = {
    controls: [{
        appliesTo: 'editor',
        name: 'talxis_TALXIS.PCF.ColorPicker',
        bindings: {
            ShouldStopEditWhenOutputChanges: {
                value: false,
                dataType: 'TwoOptions'
            }
        }
    }]
}

const CELL_CUSTOMIZER_ASYNC = {
    alignment: 'left',
    controls: [{
        appliesTo: 'renderer',
        name: 'talxis_TALXIS.PCF.AsyncCellRenderer'
    }]
}

function hideRibbonButton() {
    return false;
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
    const cellCustomizerControl = formContext.getControl(CELL_CUSTOMIZER_CONTROL_NAME);
    const cellOneClickEditControl = formContext.getControl(CELL_ONE_CLICK_EDIT_CONTROL_NAME);
    const cellCustomizerAsyncControl = formContext.getControl(CELL_CUSTOMIZER_ASYNC_CONTROL_NAME);
    const talxisGridControl = formContext.getControl(ADVANCED_GRID_CONTROL_NAME);
    const talxisGridControlFullTab = formContext.getControl(ADVANCED_GRID_CONTROL_NAME_FULL_TAB);

    registerControl(memoryProviderControl, [registerGeneralEvents]);
    registerControl(columnsInterceptorControl, [registerGeneralEvents, registerColumnsInterceptorEvents])
    registerControl(dynamicCellValuesControl, [registerGeneralEvents, registerDynamicCellValuesEvents]);
    registerControl(cellValidationControl, [registerGeneralEvents, registerDynamicCellValuesEvents, registerValidationEvents])
    registerControl(cellDisablingControl, [registerGeneralEvents, registerCellDisabledEvents])
    registerControl(cellNotificationsControl, [registerGeneralEvents, registerCellNotificationsEvents])
    registerControl(cellLoadingControl, [registerGeneralEvents, registerCellLoadingEvents]);
    registerControl(cellFormattingControl, [registerGeneralEvents, registerCellFormattingEvents])
    registerControl(cellControlParametersControl, [registerGeneralEvents, registerDynamicCellValuesEvents, registerCellControlParametersEvents]);
    registerControl(cellCustomizerControl, [registerGeneralEvents, (dataset) => registerCellFormattingEvents(dataset, CELL_CUSTOMIZER)]);
    registerControl(cellOneClickEditControl, [registerGeneralEvents, registerCellOneClickEditEvents]);
    registerControl(cellCustomizerAsyncControl, [registerGeneralEvents, (dataset) => registerCellFormattingEvents(dataset, CELL_CUSTOMIZER_ASYNC, false), registerAsyncCellRendererEvents])
    registerControl(talxisGridControl, [registerTalxisGridDemo1Events, registerTalxisGridDemo2Events, registerTalxisGridDemo3Events]);
    registerControl(talxisGridControlFullTab, [registerTalxisGridDemo1Events, registerTalxisGridDemo2Events, registerTalxisGridDemo3Events]);

}

function onMainGridLoad(primaryControl) {
    const viewId = sanitizeGuid(primaryControl.getViewSelector().getCurrentView().id);
    const dataset = window.Xrm[`talxis_grid_${primaryControl.getGrid().pageId}`];
    if (viewId === '0b6cfae4-170b-f011-bae2-0022489b5e99') {
        registerTalxisGridDemo1Events(dataset);
    }
    if (viewId === '9c330878-ad0b-f011-bae1-0022489b5e99') {
        registerTalxisGridDemo2Events(dataset);
    }
    if (viewId === 'b73dfe2f-702a-f011-8c4d-0022489b5e99') {
        registerTalxisGridDemo3Events(dataset);
    }
    if (viewId === 'a4bb2b0c-7d2a-f011-8c4d-0022489b5e99') {
        registerTalxisGridDemo3Events(dataset, true);
    }
}

const registerControl = (control, registerCallbacks) => {
    control.addOnOutputChange(() => {
        const isDatasetControl = control.getControlType().startsWith('customsubgrid:');
        const dataset = control.getOutputs()[`${control.getName()}${isDatasetControl ? '' : '.fieldControl'}.DatasetControl`].value;

        if (isDatasetControl) {
            const viewId = sanitizeGuid(control.getViewSelector?.().getCurrentView().id);
            if (viewId === '0b6cfae4-170b-f011-bae2-0022489b5e99') {
                registerCallbacks[0](dataset);
            }
            if (viewId === '9c330878-ad0b-f011-bae1-0022489b5e99') {
                registerCallbacks[1](dataset);
            }
            if (viewId === 'b73dfe2f-702a-f011-8c4d-0022489b5e99') {
                registerCallbacks[2](dataset);
            }
            if (viewId === 'a4bb2b0c-7d2a-f011-8c4d-0022489b5e99') {
                registerCallbacks[2](dataset, true);
            }
            return;
        }
        registerCallbacks.map(callback => callback(dataset))
    })
}

const registerColumnsInterceptorEvents = (dataset) => {
    dataset.setInterceptor('columns', (columns) => {
        const newColumnsMap = getDemoColumnsMap(columns);
        [...newColumnsMap.values()].map(col => {
            const emoji = getEmojiFromString(col.name);
            if (!col.displayName?.endsWith(emoji)) {
                newColumnsMap.set(col.name, { ...col, displayName: `${col.displayName} ${emoji}` })
            }
        })
        newColumnsMap.set('interceptor_column', {
            ...newColumnsMap.get('interceptor_column'),
            isHidden: false,
            name: 'interceptor_column',
            dataType: "MultiSelectPicklist",
            displayName: `Interceptor MultiSelectOptionSet ${getEmojiFromString()}`,
            disableSorting: true,
            metadata: {
                IsValidForUpdate: true,
                CanBeGrouped: true,
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
            ...newColumnsMap.get('sum'),
            isHidden: false,
            name: 'sum',
            alignment: 'right',
            displayName: 'Sum',
            dataType: 'Decimal',
            metadata: {
                ...newColumnsMap.get('sum')?.metadata,
                SupportedAggregations: ['countcolumn', 'count', 'min', 'max', 'sum', 'avg'],
                SupportedFilterConditionOperators: [0, 1, 10],
                IsValidForUpdate: false
            }
        })

        return [...newColumnsMap.values()];
    })
    dataset.addEventListener('onRecordLoaded', (record) => {
        const column = record.getDataProvider().getColumnsMap()['text'];
        let columnName = 'text'
        if (column.grouping?.isGrouped) {
            columnName = column.grouping.alias;
        }
        record.expressions.setFormattedValueExpression(columnName, (defaultFormattedValue) => {
            if (!defaultFormattedValue) {
                return defaultFormattedValue;
            }
            return `${getEmojiFromString(defaultFormattedValue)} ${defaultFormattedValue}`
        });

        record.expressions.setValueExpression('sum', () => {
            const valueA = record.getValue('number') ?? null;
            const valueB = record.getValue('decimal') ?? null;
            if (valueA === null || valueB === null) {
                return undefined;
            }
            return valueA + valueB;
        })
    })
}

const registerCellOneClickEditEvents = (dataset) => {
    dataset.setInterceptor('columns', (columns) => {
        return columns.map(col => {
            return {
                ...col,
                oneClickEdit: true,
                autoHeight: false
            }
        })
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


const registerCellFormattingEvents = (dataset, overrides, useCustomFormatting = true) => {
    dataset.setInterceptor('columns', (columns) => {
        const newColumnsMap = getDemoColumnsMap(columns);
        newColumnsMap.set('color', {
            ...newColumnsMap.get('color'),
            name: 'color',
            dataType: "SingleLine.Text",
            displayName: "Color",
            isHidden: false,
            alignment: 'right',
            metadata: {
                ...newColumnsMap.get('color')?.metadata,
                IsValidForUpdate: true,
                CanBeGrouped: true
            },
            ...(overrides ? overrides : {})
        })
        return [...newColumnsMap.values()];
    })
    dataset.addEventListener('onRecordLoaded', (record) => {
        record.expressions.ui.setCustomFormattingExpression("color", () => {
            if (!useCustomFormatting) {
                return;
            }
            const column = dataset.getDataProvider().getColumnsMap()['color'];
            let color = record.getValue('color');
            if (column.grouping?.isGrouped) {
                color = record.getValue(column.grouping.alias);
            }
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
                    }
                }
            };
        });
        record.expressions.ui.setCustomFormattingExpression('number', (defaultCellTheme) => {
            if (!useCustomFormatting) {
                return;
            }
            let columnName = 'number';
            const column = record.getDataProvider().getColumnsMap()[columnName];
            const summarizationType = record.getSummarizationType();
            if (column.grouping?.isGrouped && summarizationType === 'grouping') {
                columnName = column.grouping.alias;
            }
            else if(column.aggregation?.aggregationFunction && summarizationType === 'aggregation') {
                columnName = column.aggregation.alias;
            }
            const value = record.getValue(columnName);
            if (value <= 0) {
                return {
                    backgroundColor: defaultCellTheme.semanticColors.errorBackground,
                    textColor: defaultCellTheme.semanticColors.errorText,
                }
            }
            return {
                backgroundColor: defaultCellTheme.semanticColors.successBackground,
                textColor: defaultCellTheme.semanticColors.successIcon,
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
            type: 'action',
            disableSorting: true,
            alignment: 'right',
            isDraggable: false
        })
        return [...newColumnsMap.values()];
    })
    dataset.addEventListener('onRecordLoaded', (record) => {
        for (const column of dataset.columns) {
            if (!column.isHidden) {
                record.expressions?.ui.setLoadingExpression(column.name, () => {
                    return loadingMap.get(record.getRecordId()) ?? false;
                })
            }
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
            ...newColumnsMap.get('actions'),
            name: 'actions',
            displayName: '',
            visualSizeFactor: 200,
            type: 'action',
            disableSorting: true,
            alignment: 'right',
            isDraggable: false
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
                        let columnName = 'text';
                        const column = dataset.getDataProvider().getColumnsMap()[columnName];
                        switch (record.getSummarizationType()) {
                            case 'grouping': {
                                alert(`Everyone named ${record.getValue(column.grouping.alias)} receives a beer!`);
                                break;
                            }
                            case 'aggregation': {
                                alert('Everyone receives a beer!');
                                break;
                            }
                            default: {
                                alert(`${record.getValue(columnName)} receives a beer!`)
                            }
                        }
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

const registerTalxisGridDemo1Events = (dataset) => {
    dataset.setInterceptor('columns', (columns) => {
        const columnsMap = new Map(columns.map(col => [col.name, col]));
        columnsMap.set('talxis_sum__virtual', {
            ...columnsMap.get('talxis_sum__virtual'),
            name: 'talxis_sum__virtual',
            displayName: 'Sum',
            dataType: 'Decimal',
            isVirtual: true,
            metadata: {
                IsValidForUpdate: false
            }
        })
        columnsMap.set('_talxis_gridRibbonButtons', {
            ...columnsMap.get('_talxis_gridRibbonButtons'),
            name: '_talxis_gridRibbonButtons',
            displayName: 'Inline Ribbon',
            visualSizeFactor: 400,
            isVirtual: true
        })
        columnsMap.set('talxis_singlelinephone', {
            ...columnsMap.get('talxis_singlelinephone'),
            displayName: 'SingleLine.Phone (Custom PCF)'
        })
        //always keep the columns at the end
        return [...columnsMap.values()].sort((a, b) => {
            const aScore = a.name === '_talxis_gridRibbonButtons' ? 2 : a.name === 'talxis_sum__virtual' ? 1 : 0;
            const bScore = b.name === '_talxis_gridRibbonButtons' ? 2 : b.name === 'talxis_sum__virtual' ? 1 : 0;
            return aScore - bScore;
        });
    });

    dataset.addEventListener('onRecordLoaded', (record) => {
        const getNumber = (value) => {
            try {
                return parseFloat(value)
            }
            catch (err) {
                return 0;
            }
        }
        record.expressions.setValueExpression('talxis_sum__virtual', () => {
            switch (record.getSummarizationType()) {
                case 'grouping': {
                    return undefined;
                }
                case 'aggregation': {
                    return undefined;
                }
                default: {
                    return getNumber(record.getValue('talxis_wholenone')) + getNumber(record.getValue('talxis_decimal'));
                }
            }
        })
        record.expressions.ui.setCustomFormattingExpression('talxis_sum__virtual', (theme) => {
            const value = record.getValue('talxis_sum__virtual');
            return {
                backgroundColor: getColorBasedOnValue(getNumber(value), theme),
            }
        })
        record.expressions.ui.setCustomControlsExpression('talxis_singlelinephone', (controls) => {
            return [{
                appliesTo: "editor",
                name: "talxis_TALXIS.PCF.PhonePicker",
                bindings: {
                    verificationFeature: {
                        isStatic: true,
                        value: "1"
                    }
                }
            }]
        })
        record.expressions.setFormattedValueExpression('talxis_singlelinephone', defaultFormattedValue => {
            if (!defaultFormattedValue) {
                return defaultFormattedValue;
            }
            return JSON.parse(defaultFormattedValue).phoneNumber;
        });
        record.expressions.ui.setControlParametersExpression('talxis_singlelinephone', (defaultParameters) => {
            if (!defaultParameters.value.raw) {
                return defaultParameters
            }
            return {
                ...defaultParameters,
                value: {
                    ...defaultParameters.value,
                    raw: JSON.parse(defaultParameters.value.raw).phoneNumber
                }
            }
        })
    })
}

const registerTalxisGridDemo2Events = (dataset) => {
    dataset.filtering.setFilter({
        filterOperator: 0,
        conditions: [
            {
                attributeName: 'talxis_name',
                conditionOperator: 56,
                value: '%11'
            }
        ]
    })

}

const registerTalxisGridDemo3Events = (dataset, fullyCustom) => {
    dataset.setInterceptor('columns', (columns) => {
        const columnsMap = new Map(columns.map(col => [col.name, col]));
        columnsMap.set('_talxis_gridRibbonButtons', {
            ...columnsMap.get('_talxis_gridRibbonButtons'),
            name: '_talxis_gridRibbonButtons',
            displayName: 'Inline Ribbon',
            visualSizeFactor: 400,
            isVirtual: true
        })
        //always keep the columns at the end
        return [...columnsMap.values()].sort((a, b) => {
            const aScore = a.name === '_talxis_gridRibbonButtons' ? 2 : a.name === 'talxis_sum__virtual' ? 1 : 0;
            const bScore = b.name === '_talxis_gridRibbonButtons' ? 2 : b.name === 'talxis_sum__virtual' ? 1 : 0;
            return aScore - bScore;
        });
    })
    dataset.addEventListener('onRecordLoaded', (record) => {
        record.expressions.ui.setCustomControlsExpression('_talxis_gridRibbonButtons', (controls) => {
            return [{
                appliesTo: "renderer",
                name: "talxis_TALXIS.PCF.CustomRibbonDemo",
                bindings: {
                    Type: {
                        isStatic: true,
                        value: fullyCustom ? 'custom' : null
                    }
                }
            }]
        })
    })

}

const getDemoColumnsMap = (columns) => {
    const columnsToIncludeSet = new Set(['text', 'number', 'decimal']);
    const newColumns = columns.map(x => {
        return {
            ...x,
            isHidden: columnsToIncludeSet.has(x.name) ? false : true
        }
    });
    return new Map(newColumns.map(col => [col.name, col]));
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

const getColorBasedOnValue = (value, theme) => {

    // Excel-like thresholds: 0 (red), 10M (yellow), 20M (green)
    if (value <= 10000000) {
        // Red for 0 to 10M (#FF0000)
        return theme.semanticColors.errorBackground;
    } else if (value <= 20000000) {
        // Yellow for 10M to 20M (#FFFF00)
        return theme.semanticColors.warningBackground;
    } else {
        // Green for 20M (#00FF00) - though capped, included for clarity
        return theme.semanticColors.successBackground;
    }
};
const sanitizeGuid = (guid) => {
    return guid?.replace?.("{", "")?.replace?.("}", "")?.toLowerCase?.() ?? "";
}