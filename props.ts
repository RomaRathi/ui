import { ReportingTypeProps } from 'components/configuration/common/utils/reporting-type-tabs';
import { BaseComponentStateProps } from 'components/core/base.state';
import { TaxCode } from 'models/tax-code';
import { TaxCodeAttribute } from 'models/tax-code/attribute';

export interface DispatchFromProps {
    loadTaxCodes(): void;
    loadTaxCodeAttributes(): void;
    onFilterChanged(filter: string): void;
    resetFilter(): void;
    create(): void;
    view(taxCode: TaxCode): void;
}

export interface TaxCodesProps extends BaseComponentStateProps {
    readonly isSystemScope: boolean;
    taxCodes: TaxCode[];
    taxCodeAttributes: TaxCodeAttribute[];
    filter: string;
}

export type MappedProps = TaxCodesProps & DispatchFromProps & ReportingTypeProps;
