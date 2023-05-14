import { BaseCrudService } from 'services/base-crud.service';
import { TaxCode } from 'models/tax-code';
import { FlowType } from 'models/adjustments';
import { ReportingType } from 'models/engagement';

export class TaxCodeService extends BaseCrudService {
    private serviceUrl = '/taxCodes';

    constructor() {
        super(Configuration.engagement.apiUrl);
    }

    public remove(id: number): Promise<void> {
        return this.delete(`${this.serviceUrl}/${id}`);
    }

    public update(taxCode: TaxCode): Promise<void> {
        return this.put(this.serviceUrl, taxCode);
    }

    public create(taxCode: TaxCode): Promise<number> {
        return this.post(this.serviceUrl, taxCode);
    }

    public load(): Promise<TaxCode[]> {
        return this.get(this.serviceUrl);
    }

    public loadById(id: number): Promise<TaxCode> {
        return this.get(`${this.serviceUrl}/${id}`);
    }

    public loadSystemTaxCodes(reportingType: ReportingType): Promise<TaxCode[]> {
        return this.get(`${this.serviceUrl}/${reportingType}/system`);
    }

    public loadSystemById(id: number, reportingType: ReportingType): Promise<TaxCode> {
        return this.get(`${this.serviceUrl}/${reportingType}/system/${id}`);
    }

    public loadTaxCodesByCountry(countryId: number): Promise<TaxCode[]> {
        return this.get(`${this.serviceUrl}/listByCountry/${countryId}`);
    }

    public loadByFlow(flowCategory: FlowType): Promise<TaxCode[]> {
        return this.get(`${this.serviceUrl}/listByFlow/${flowCategory}`);
    }

    public loadByTransaction(transactionId: string): Promise<TaxCode[]> {
        return this.get(`${this.serviceUrl}/listByTransaction/${transactionId}`);
    }

    public requestExport(returnTypeId: number, reportingType: ReportingType, isSystem: boolean): Promise<string> {
        const id = returnTypeId ?? 0;
        return isSystem ? this.post(`${this.serviceUrl}/export/request/${reportingType}/system/${id}`) : this.post(`${this.serviceUrl}/export/request/engagement/${id}`);
    }
}
