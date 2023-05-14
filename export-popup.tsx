import React, { useState } from 'react';
import { ComboBox, ComboBoxOption } from '@gvrt/controls';
import { ReportingType } from 'models/engagement';
import { ReturnType, ReturnTypeCategory } from 'models/return';
import { asyncLoader } from 'components/core/async-content';
import { CommonEventHandlers } from 'components/core/event-handlers';
import { useLoadReturnTypes } from './hooks';

export const ExportPopup = ({ reportingType, onUpdate }: ExportPopupProps) => {
    const [returnTypes, asyncState] = useLoadReturnTypes(reportingType);
    const [options, setOptions] = useState<ExportOption>();
    const updateOptions = (options: ExportOption) => {
        setOptions(options);
        onUpdate(options);
    };

    const sortReturnTypesWithVatOnTop = (a: ReturnType, b: ReturnType) => {
        if (a.category === ReturnTypeCategory.Vat && a.category !== b.category) {
            return -1;
        }
        if (b.category === ReturnTypeCategory.Vat && a.category !== b.category) {
            return 1;
        }
        return a.name.localeCompare(b.name);
    };

    return (
        <>
            {asyncLoader(asyncState, []) || (
                <ComboBox
                    label="Return type"
                    placeholder="Please select return type"
                    options={returnTypes?.sort(sortReturnTypesWithVatOnTop).map<ComboBoxOption>(x => ({ key: x.id, text: x.name }))}
                    selectedKey={options?.returnTypeId}
                    onChange={x => CommonEventHandlers.onComboBoxChanged(options, x, updateOptions, 'returnTypeId')}
                    useComboBoxAsMenuWidth
                />
            )}
        </>
    );
};

export interface ExportOption {
    returnTypeId: number;
}

interface ExportPopupProps {
    reportingType: ReportingType;
    onUpdate(model: ExportOption): void;
}
