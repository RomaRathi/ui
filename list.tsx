import React from 'react';
import flatten from 'lodash/flatten';
import uniqBy from 'lodash/uniqBy';
import { Column } from '@gvrt/controls';
import { DetailsList } from 'components/core/grid-wrapped';
import { useTileContext } from 'components/core/tile';
import { TaxCode, TaxCodeAttribute } from 'models/tax-code';
import { TaxCodeCell, AvailabilityCell } from './cells';

type TaxCodeListProps = {
    readonly isSystemScope: boolean;
    taxCodes: TaxCode[];
    attributes: TaxCodeAttribute[];
    view(item: TaxCode): void;
};

export const TaxCodeList: React.FunctionComponent<TaxCodeListProps> = props => {
    const { taxCodes, attributes, view, isSystemScope } = props;
    const { maximized } = useTileContext();
    const columns = React.useMemo(() => getColumns(taxCodes, attributes, maximized, isSystemScope), [taxCodes, attributes, maximized, isSystemScope]);
    return <DetailsList columns={columns} items={taxCodes} onActiveItemChanged={view} />;
};

function getColumns(taxCodes: TaxCode[], attributes: TaxCodeAttribute[], maximized: boolean, isSystemScope: boolean): Column[] {
    let attributeColumns: Column[] = [];
    if (maximized) {
        const attributesIds = uniqBy(flatten(taxCodes.map(x => x.values)), x => x.attributeId).map(x => x.attributeId);
        attributeColumns = attributesIds.map<Column>(id => {
            const attribute = attributes.find(x => x.id === id);
            return {
                key: `${attribute.name}-${attribute.id}`,
                name: attribute.name,
                minWidth: 100,
                maxWidth: 100,
                isResizable: true,
                onRender: (item: TaxCode) => <TaxCodeCell taxCode={item} attribute={attribute} />
            };
        });
    }

    let accountingSystemColumn: Column[] = [];
    if (!isSystemScope) {
        accountingSystemColumn = [{ key: 'accounting-system', name: 'System', fieldName: 'accountingSystemName', minWidth: 130, maxWidth: 130, isResizable: true }];
    }

    return [
        { key: 'country', name: 'Country', fieldName: 'countryName', minWidth: 100, maxWidth: 100, isResizable: true },
        ...accountingSystemColumn,
        { key: 'tax-code', name: 'Tax code', fieldName: 'name', minWidth: 70, maxWidth: 90, isResizable: true },
        { key: 'description', name: 'Description', fieldName: 'description', minWidth: 180, isResizable: true },
        ...attributeColumns,
        {
            key: 'availability',
            name: 'Available',
            minWidth: 80,
            maxWidth: 80,
            isResizable: true,
            onRender: (item: TaxCode) => <AvailabilityCell isAvailable={item.isAvailable} />
        }
    ];
}
