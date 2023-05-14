import { useEffect } from 'react';
import { useSignalR, SignalRChannels, SignalRMessageHandler, FileExportPayload } from 'redux/signal-r';
import { ReturnTypeService } from 'models/return/type/service';
import { ReturnType, ReturnTypeCategory } from 'models/return/type';
import { TaxCodeService } from 'models/tax-code/service';
import { ReportingType } from 'models/engagement';
import { ProcessingStatus } from 'models/common/process-progress';
import { loadHookFactory } from 'services/hooks/hook-factory';

const returnTypeService = new ReturnTypeService();

export const useLoadReturnTypes = (reportingType: ReportingType) =>
    loadHookFactory(returnTypeService, returnTypeService.getAll, {
        interceptor: result => result.filter(filterFactory(reportingType))
    })();

const taxCodeService = new TaxCodeService();

export const useRequestFileExport = loadHookFactory(taxCodeService, taxCodeService.requestExport, { onDemand: true });

export function useFileExportDownload({ fileId, onSuccess, onFailure }: FileExportProps): void {
    const signalR = useSignalR();
    useEffect(() => {
        if (!fileId) {
            return () => void 0;
        }
        const callback: TaxCodesExportMessageHandler = payload => {
            if (payload.fileId === fileId) {
                if (payload.status === ProcessingStatus.Finished) {
                    onSuccess(payload.fileId);
                } else if (payload.status === ProcessingStatus.Failed) {
                    onFailure(getErrorMessage(payload));
                }
            }
        };
        return signalR.on(SignalRChannels.configuration.taxCodesExportStatus, callback);
    }, [signalR, fileId, onFailure]);
}

function getErrorMessage(payload: FileExportPayload): string {
    if (payload.errorMessage) {
        return payload.errorMessage;
    } else {
        return `File export failed. Please try again later.`;
    }
}

const filterFactory = (reportingType: ReportingType): GenericFunction<ReturnType, boolean> => {
    switch (reportingType) {
        case ReportingType.VAT:
            return (rt: ReturnType) => rt.category === ReturnTypeCategory.Vat || rt.category === ReturnTypeCategory.Aggregated;
        case ReportingType.PPT:
            return (rt: ReturnType) => rt.category === ReturnTypeCategory.PPT;
    }
};

type FileExportProps = {
    fileId: string;
    onSuccess(fileId: string): void;
    onFailure(error: string): void;
};

type TaxCodesExportMessageHandler = SignalRMessageHandler<'configuration', 'taxCodesExportStatus'>;
