import gql from 'graphql-tag';
import * as React from 'react';
import { Query } from 'react-apollo';
import Loading from 'components/loading';
import Link from 'components/link';
import { Page, PageSection } from 'components/page';
import { DropDown } from 'components/form';
import Button, { ButtonContainer } from 'components/button';
import { translate, Trans } from 'react-i18next';
import { withRouter } from 'react-router';
import injectSheet from 'react-jss';
import Icon from 'components/icon';

const styles = (theme: any) => ({
  ingress: {
    fontFamily: 'georgia, serif',
    fontSize: '2rem',
    lineHeight: '3rem',
  },
  subheading: {
    fontSize: '2.6rem',
    lineHeight: '2.7rem',
    marginBottom: '1.6rem',
  },
  electionGroupInfoSection: {
    marginBottom: '6rem',
  },
  votingRightsSection: {},
  notInCensusReasonTextArea: {
    width: '100%',
    padding: 10,
    fontFamily: 'inherit',
    fontSize: 'inherit',
    border: theme.formFieldBorder,
    borderColor: theme.formFieldBorderColor,
    borderRadius: theme.formFieldBorderRadius,
  },
  notInCensusParagraph: {
    marginTop: '1.6rem',
    marginBottom: '2rem',
  },
  aboutElectionLink: {
    fontSize: '1.8rem',
    marginTop: '1.8rem',
  },
});

const getElectionGroupCensusData = gql`
  query ElectionGroupCensusData($id: UUID!) {
    electionGroup(id: $id) {
      id
      name
      description
      elections {
        id
        name
        mandatePeriodStart
        mandatePeriodEnd
        informationUrl
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
  history: any;
  match: any;
  location: any;
  classes: any;
}

interface IState {
  selectedCensusIndex: number;
  notInCensusReason: string;
}

class CensusSelectPage extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      selectedCensusIndex: 0,
      notInCensusReason: '',
    };
    this.handleSelectCensus = this.handleSelectCensus.bind(this);
    this.handleNotInCensusReasonChange = this.handleNotInCensusReasonChange.bind(
      this
    );
  }

  public hasVotingRights(): boolean {
    // dummy implementation
    return this.state.selectedCensusIndex === 0;
  }

  public handleSelectCensus(selectedCensusIndex: number) {
    this.setState({ selectedCensusIndex });
    // tslint:disable-next-line:no-console
    console.log(selectedCensusIndex);
  }

  public handleNotInCensusReasonChange(
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) {
    this.setState({ notInCensusReason: event.target.value });
  }

  public render() {
    const lang = this.props.i18n.language;
    const history = this.props.history;
    const classes = this.props.classes;

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

          const dropdown = (
            <DropDown
              options={elections.map((e, index) => ({
                value: index,
                name: e.lists[0].name[lang],
                secondaryLine: index === 0 ? 'Stemmerett' : null,
              }))}
              value={this.state.selectedCensusIndex}
              onChange={this.handleSelectCensus}
              inline={true}
            />
          );

          return (
            <Page header={electionGroupName[lang]}>
              <PageSection>
                <div className={classes.electionGroupInfoSection}>
                  <p className={classes.ingress}>
                    Styreperiode:{' '}
                    {`${new Date(
                      elections[0].mandatePeriodStart
                    ).toLocaleDateString()} - ${new Date(
                      elections[0].mandatePeriodEnd
                    ).toLocaleDateString()}`}
                  </p>
                  <div className={classes.aboutElectionLink}>
                    {(elections[0].informationUrl ||
                      true) /* <- for testing */ && (
                      <Link
                        to={elections[0].informationUrl}
                        marginRight={true}
                        external={true}
                      >
                        Les mer om valget&nbsp;&nbsp;
                        <Icon type="externalLink" />
                      </Link>
                    )}
                  </div>
                </div>
                <div className="votingRightsSection">
                  {this.hasVotingRights() ? (
                    <>
                      <p className={classes.subheading}>Du har stemmerett</p>
                      <div className={classes.ingress}>
                        Du er registrert med stemmerett i gruppen&nbsp;&nbsp;
                        {dropdown}
                      </div>
                    </>
                  ) : (
                    <>
                      <p className={classes.subheading}>
                        Har du valgt riktig stemmegruppe?
                      </p>
                      <p className={classes.ingress}>
                        Du er ikke registrert i stemmegruppen for&nbsp;&nbsp;
                        {dropdown}
                      </p>
                      <p className={classes.notInCensusParagraph}>
                        Valgstyret avgjør basert på tilknytningen din til UiO om
                        stemmen vil telles med. Hvis du mener du skulle vært
                        registrert i denne stemmegruppen, oppgi stillingskode
                        eller annen relevant informasjon.
                      </p>
                      <textarea
                        onChange={this.handleNotInCensusReasonChange}
                        className={classes.notInCensusReasonTextArea}
                        placeholder="Skriv begrunnelse"
                        rows={6}
                      />
                    </>
                  )}
                </div>
                <ButtonContainer alignLeft={true}>
                  <Button
                    text={<Trans>general.back</Trans>}
                    action={history.goBack}
                    secondary={true}
                  />
                  <Link
                    to={`/voter/elections/${
                      elections[this.state.selectedCensusIndex].id
                    }/vote`}
                  >
                    <Button
                      text={<Trans>general.proceed</Trans>}
                      // tslint:disable:no-console
                      // tslint:disable-next-line:jsx-no-lambda
                      action={() => console.log(this.state.notInCensusReason)}
                      disabled={
                        !this.hasVotingRights() &&
                        this.state.notInCensusReason === ''
                      }
                    />
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

export default injectSheet(styles)(withRouter(translate()(CensusSelectPage)));
