import React from 'react';

import {
  Table,
  TableHeader,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
} from 'components/table';
import { useTranslation } from 'react-i18next';
import { IPollBook, ICensusFileImport } from 'interfaces';
import { PageExpandableSubSection } from 'components/page/PageSection';


interface UploadedCensusFileTableProps {
  pollbooks: Array<IPollBook>;
}

const UploadedCensusFileTable: React.FunctionComponent<UploadedCensusFileTableProps> = ({ pollbooks }) => {
  const { t, i18n } = useTranslation();
  const fileImports: Array<ICensusFileImport> = pollbooks.flatMap(e => e.censusFileImports)
  if (fileImports.length === 0) {
    return null
  }
  return (
    <PageExpandableSubSection startExpanded header={'Opplastede filer'}>
      <Table>
        <TableHeader>
          <TableHeaderRow>
            <TableHeaderCell>{t('census.uploadTable.fileName')}</TableHeaderCell>
            <TableHeaderCell>{t('census.uploadTable.pollbook')}</TableHeaderCell>
            <TableHeaderCell>{t('census.uploadTable.status')}</TableHeaderCell>
            <TableHeaderCell>{t('census.uploadTable.added')}</TableHeaderCell>
            <TableHeaderCell>{t('census.uploadTable.existing')}</TableHeaderCell>
            <TableHeaderCell>{t('census.uploadTable.error')}</TableHeaderCell>
          </TableHeaderRow>
        </TableHeader>
        <TableBody>
          {fileImports.map((fileImport, i) => {
            if (fileImport.importResults) {
              const result = JSON.parse(fileImport.importResults)
              return (
                <TableRow key={i}>
                  <TableCell>{fileImport.fileName}</TableCell>
                  <TableCell>{fileImport.pollbook.name[i18n.language]}</TableCell>
                  <TableCell>{t(`census.status.${fileImport.status}`)}</TableCell>
                  <TableCell>{result.added_nr}</TableCell>
                  <TableCell>{result.already_in_pollbook_nr}</TableCell>
                  <TableCell>{result.error_nr}</TableCell>
                </TableRow>
              );
            } else {
              return (
                <TableRow key={i}>
                  <TableCell>{fileImport.fileName}</TableCell>
                  <TableCell>{fileImport.pollbook.name[i18n.language]}</TableCell>
                  <TableCell>{t(`census.status.${fileImport.status}`)}</TableCell>
                  <TableCell>{''}</TableCell>
                  <TableCell>{''}</TableCell>
                  <TableCell>{''}</TableCell>
                </TableRow>
              );
            }
          })}
        </TableBody>
      </Table>
    </PageExpandableSubSection>
  );
};

export default UploadedCensusFileTable;
