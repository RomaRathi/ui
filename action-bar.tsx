import React, { useEffect, useState } from 'react';
import { ActionBar, ActionBarCommand } from 'components/core/action-bar';
import { asyncIconRenderer } from 'components/core/async-icon-renderer';
import { useCustomConfirmation } from 'components/core/hooks/confirmation';
import { AppRole } from 'models/user';
import { IconName } from '@gvrt/controls';
import { useFileDownload } from 'services/hooks/file';
import { getErrorMessage } from 'utils/error';
import { ReportingType } from 'models/engagement';
import { ExportOption, ExportPopup } from './export-popup';
import { useFileExportDownload, useRequestFileExport } from './hooks';

export const TaxCodesActionBar = ({ isSystemScope, reportingType, onCreate, onExport, onError }: ReportExportActionBarProps) => {
    const [exportOption, setExportOption] = useState<ExportOption>();
    const [exportInProgress, setExportInProgress] = useState<boolean>(false);
    const [fileGuid, setFileGuid] = useState<string>(null);
    const [requestExportFileGuid, requestExportState, requestExport] = useRequestFileExport(exportOption?.returnTypeId, reportingType, isSystemScope);
    const [download] = useFileDownload(Configuration.engagement.apiUrl);
    const onExportSuccess = (fileGuid: string) => {
        download(`taxCodes/export/download/${fileGuid}`);
        setExportInProgress(false);
        setFileGuid(null);
        onExport?.(false);
    };

    const onExportFailure = (error: string) => {
        setExportInProgress(false);
        setFileGuid(null);
        onError?.(error);
        onExport?.(false);
    };

    const onExportOptionsConfirmed = () => {
        setExportInProgress(true);
        setFileGuid(null);
        onExport?.(true);
    };

    const onExportRequestAccepted = () => {
        setFileGuid(requestExportFileGuid);
    };

    useEffect(() => {
        if (exportInProgress && requestExportState?.error) {
            onExportFailure(getErrorMessage(requestExportState.error));
        } else if (requestExportState?.isLoaded) {
            onExportRequestAccepted();
        }
    }, [exportInProgress, requestExportState]);

    useEffect(() => {
        if (exportInProgress && !fileGuid) {
            requestExport();
        }
    }, [exportInProgress, fileGuid]);

    const [showExportDialog, exportDialogProps] = useCustomConfirmation(
        <ExportPopup reportingType={reportingType} onUpdate={setExportOption} />,
        onExportOptionsConfirmed,
        null,
        'Export',
        'Export'
    );
    useFileExportDownload({ fileId: fileGuid, onSuccess: onExportSuccess, onFailure: onExportFailure });

    const commands: ActionBarCommand[] = [
        {
            key: 'add',
            text: 'Add',
            iconName: IconName.Add,
            onClick: onCreate,
            access: isSystemScope ? [AppRole.CountryAdmin, AppRole.SystemAdmin, AppRole.PptAdmin] : [AppRole.EngagementAdmin, AppRole.SystemAdmin]
        },
        {
            key: 'export',
            text: 'Export',
            iconName: IconName.ExcelDocument,
            disabled: exportInProgress,
            onRenderIcon: asyncIconRenderer(exportInProgress),
            onClick: showExportDialog
        }
    ];

    return <ActionBar commands={commands} action={exportDialogProps} />;
};

type ReportExportActionBarProps = {
    isSystemScope: boolean;
    reportingType: ReportingType;
    onCreate(): void;
    onExport?(inProgress: boolean): void;
    onError?(error: string): void;
};
