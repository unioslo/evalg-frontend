import gql from 'graphql-tag';
import * as React from 'react';
import { Query } from 'react-apollo';
import Loading from 'components/loading';
import Link from 'components/link';
import { Page, PageSection } from 'components/page';
import { DropDown } from 'components/form';
import Button, { ButtonContainer } from 'components/button';
import { translate } from 'react-i18next';

const getElectionGroupCensusData = gql`
  query ElectionGroupCensusData($id: UUID!) {
    electionGroup(id: $id) {
      id
      name
      description
      elections {
        id
        name
        lists {
          id
          name
        }
      }
    }
  }
`;

interface IProps {
  electionGroupId: string;
  i18n: any;
  // history: any;
}

interface IState {
  selectedCensusIndex: number;
}

class CensusSelectPage extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      selectedCensusIndex: 0,
    };
    this.handleSelectCensus = this.handleSelectCensus.bind(this);
  }

  public handleSelectCensus(selectedCensusIndex: number) {
    this.setState({ selectedCensusIndex });
    // tslint:disable-next-line:no-console
    console.log(selectedCensusIndex);
  }

  public render() {
    const lang = this.props.i18n.language;
    // const history = this.props.history;
    return (
      <Query
        query={getElectionGroupCensusData}
        variables={{ id: this.props.electionGroupId }}
      >
        {({ data, loading, error }) => {
          if (loading) {
            return <Loading />;
          }
          if (error) {
            return 'Error';
          }
          const electionGroup: ElectionGroup = data.electionGroup;
          const electionGroupName = electionGroup.name;
          const elections: Election[] = electionGroup.elections;
          return (
            <Page header={electionGroupName[lang]}>
              <PageSection>
                Velg manntall:
                <DropDown
                  options={elections.map((e, index) => ({
                    value: index,
                    name: e.lists[0].name[lang],
                  }))}
                  value={this.state.selectedCensusIndex}
                  onChange={this.handleSelectCensus}
                />
                <ButtonContainer alignLeft={true}>
                  <Button text={'Tilbake'} secondary={true} />
                  <Link
                    to={`/voter/elections/${
                      elections[this.state.selectedCensusIndex].id
                    }/vote`}
                  >
                    <Button text={'Gå videre'} />
                  </Link>
                </ButtonContainer>
              </PageSection>
            </Page>
          );
        }}
      </Query>
    );
  }
}

export default translate()(CensusSelectPage);
