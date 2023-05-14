import React, { useEffect } from 'react';
import { SearchBox } from '@gvrt/controls';
import { asyncLoader } from 'components/core/async-content';
import { ReportingType } from 'models/engagement';
import { TaxCodeList } from './list';
import { MappedProps } from './props';
import { SystemTaxCodesToggle } from './system-tax-codes';
import { TaxCodesActionBar } from './action-bar';

export const TaxCodes = (props: MappedProps) => {
    const { taxCodes, taxCodeAttributes, isSystemScope, filter, reportingType, view, create, onFilterChanged, loadTaxCodes, loadTaxCodeAttributes, resetFilter } = props;
    useEffect(() => {
        loadTaxCodes();
        loadTaxCodeAttributes();

        return resetFilter;
    }, []);

    return (
        <>
            <TaxCodesActionBar isSystemScope={isSystemScope} onCreate={create} reportingType={reportingType ?? ReportingType.VAT} />
            {!isSystemScope && <SystemTaxCodesToggle />}
            <SearchBox placeholder="Search tax code by code, country, ISO code, system or description" value={filter} onFilter={onFilterChanged} data-qa="Filter" />
            {asyncLoader(props, ['taxCodes']) || <TaxCodeList taxCodes={taxCodes} attributes={taxCodeAttributes} view={view} isSystemScope={isSystemScope} />}
        </>
    );
};
