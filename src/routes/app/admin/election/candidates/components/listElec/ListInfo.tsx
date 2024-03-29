/**
 * @file Component for displaying info about an election list
 */
import { useTranslation } from 'react-i18next';

import Link from 'components/link';
import { PageSubSection } from 'components/page';
import { PageExpandableSubSection } from 'components/page/PageSection';
import Text, { H4 } from 'components/text';
import { ElectionList } from 'interfaces';

import ListCandidateTable from './ListCandidateTable';

type ListTableProps = {
  electionList: ElectionList;
};

/**
 * Component for displaying info about an election list.
 *
 * @param {ElectionList} electionList - The election list to display.
 */
export default function ListInfo(props: ListTableProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { electionList } = props;

  return (
    <PageSubSection header={electionList.name[lang]}>
      <div>
        <Link to={`editlist/${electionList.id}`}>
          {t('admin.listElec.editListInfoHeader')}
        </Link>
      </div>
      <div>
        <PageExpandableSubSection header={t('admin.listElec.description')}>
          <div style={{ marginTop: '2rem' }}>
            <H4>{t('admin.listElec.fields.url')}</H4>
            <Text marginBottom>{electionList.informationUrl}</Text>
            <H4>{t('general.lang.nb')} </H4>
            <Text marginBottom>{electionList.description.nb}</Text>
            <H4>{t('general.lang.nn')}</H4>
            <Text marginBottom>{electionList.description.nn}</Text>
            <H4>{t('general.lang.en')}</H4>
            <Text marginBottom>{electionList.description.en}</Text>
          </div>
        </PageExpandableSubSection>
      </div>

      <ListCandidateTable electionList={electionList} />
    </PageSubSection>
  );
}
