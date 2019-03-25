import * as React from 'react';

import { Trans } from 'react-i18next';

import Button, { ButtonContainer } from '../../../../../../components/button';
import Modal from '../../../../../../components/modal';
import { InfoList, InfoListItem } from '../../../../../../components/infolist';
import { PageSection } from '../../../../../../components/page';
import Text from '../../../../../../components/text';
import Link from '../../../../../../components/link';
import CreateElectionKeyModal from './CreateElectionKeyModal';
import { ElectionGroup } from '../../../../../../interfaces';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { Date, Time } from '../../../../../../components/i18n';

const setKeySafeStatuses = ['draft', 'announced'];

const electionGroupKeyMetaQuery = gql`
  query electionGroupKeyMeta($id: UUID!) {
    electionGroupKeyMeta(id: $id) {
      generatedAt
      generatedBy {
        id
        identifiers {
          idType
          idValue
        }
      }
    }
  }
`;

interface IProps {
  electionGroup: ElectionGroup;
  replaceKey: boolean;
  refetchElectionGroupFunction: () => Promise<any>;
  classes: any;
}

interface IState {
  showCreateKeyModal: boolean;
  showConfirmNewKeyModal: boolean;
  showPublicKey: boolean;
}

class ElectionKeySection extends React.Component<IProps, IState> {
  cryptoEngine: any;

  constructor(props: IProps) {
    super(props);
    this.state = {
      showCreateKeyModal: false,
      showConfirmNewKeyModal: false,
      showPublicKey: false,
    };
  }

  showCreateKeyModal = () => {
    this.setState({
      showCreateKeyModal: true,
    });
  };

  handleCloseCreateKeyModal = () => {
    this.setState({
      showCreateKeyModal: false,
    });
    this.props.refetchElectionGroupFunction();
  };

  showConfirmNewKeyModal = () => {
    this.setState({
      showConfirmNewKeyModal: true,
    });
  };

  cancelNewKey = () => {
    this.setState({
      showConfirmNewKeyModal: false,
    });
  };

  confirmNewKey = () => {
    this.setState({
      showConfirmNewKeyModal: false,
    });
    this.showCreateKeyModal();
  };

  render() {
    const { electionGroup } = this.props;
    const hasKey = electionGroup.publicKey !== null;
    const status = electionGroup.status;

    return (
      <>
        <PageSection header={<Trans>election.electionKey</Trans>}>
          {!hasKey ? (
            <>
              <ButtonContainer alignLeft smlTopMargin>
                <Button
                  text={<Trans>admin.electionKey.create</Trans>}
                  action={this.showCreateKeyModal}
                />
              </ButtonContainer>
              <Text marginTop>
                <Trans>admin.electionKey.missing</Trans>
              </Text>
            </>
          ) : (
            <>
              <Text marginBottom>
                <Query
                  query={electionGroupKeyMetaQuery}
                  variables={{ id: electionGroup.id }}
                >
                  {({ loading, error, data }) => {
                    if (error) return null;
                    if (loading || !data) return null;

                    const generatedAt = data.electionGroupKeyMeta.generatedAt;
                    const generatedBy = data.electionGroupKeyMeta.generatedBy;
                    let who = '';

                    if (generatedBy) {
                      const identifiers = generatedBy.identifiers;

                      for (let id of identifiers) {
                        if (id.idType === 'feide_id') {
                          who = id.idValue;
                          break;
                        }
                      }
                      if (!who) {
                        // Fallback to uid
                        for (let id of identifiers) {
                          if (id.idType === 'uid') {
                            who = id.idValue;
                            break;
                          }
                        }
                      }
                      if (!who) {
                        // fallback to person UUID
                        who = generatedBy.id;
                      }
                    }
                    return (
                      <>
                        <Trans>admin.electionKey.createdBy</Trans>{' '}
                        <span>{who}</span> (
                        <Date dateTime={generatedAt} longDate />{' '}
                        <Time dateTime={generatedAt} />)
                      </>
                    );
                  }}
                </Query>
                <br />
                <Trans>admin.electionKey.publicKeyCaption</Trans>:{' '}
                {this.state.showPublicKey ? (
                  <span>
                    {electionGroup.publicKey}{' '}
                    <a
                      href="javascript:void(0);"
                      onClick={() => this.setState({ showPublicKey: false })}
                    >
                      <Trans>general.hide</Trans>
                    </a>
                  </span>
                ) : (
                  <a
                    href="javascript:void(0);"
                    onClick={() => this.setState({ showPublicKey: true })}
                  >
                    <Trans>general.show</Trans>
                  </a>
                )}
              </Text>
              <InfoList>
                <InfoListItem bulleted key="keep-it-safe">
                  <Trans>admin.electionKey.infoListKeepItSafe</Trans>
                </InfoListItem>
                <InfoListItem bulleted key="can-replace">
                  <Trans>admin.electionKey.infoListCanReplace</Trans>
                </InfoListItem>
                <InfoListItem bulleted key="read-more">
                  <Link external to="#TODO">
                    <Trans>admin.electionKey.readMore</Trans>
                  </Link>
                </InfoListItem>
              </InfoList>
              {setKeySafeStatuses.indexOf(status) >= 0 ? (
                <ButtonContainer alignLeft smlTopMargin>
                  <Button
                    text={<Trans>admin.electionKey.createNew</Trans>}
                    action={this.showConfirmNewKeyModal}
                    secondary
                  />
                </ButtonContainer>
              ) : (
                <Text marginTop>
                  <Trans>
                    admin.electionKey.cannotReplaceBecauseUnsafeStatus
                  </Trans>
                </Text>
              )}
            </>
          )}
        </PageSection>
        {this.state.showConfirmNewKeyModal && (
          <Modal
            header={<Trans>admin.electionKey.confirmNewModalHeader</Trans>}
            hideTopCloseButton
            buttons={[
              <Button
                text={<Trans>general.yes</Trans>}
                action={this.confirmNewKey}
                key="confirm-button"
              />,
              <Button
                secondary
                text={<Trans>general.no</Trans>}
                action={this.cancelNewKey}
                key="cancel-button"
              />,
            ]}
          >
            <div style={{ maxWidth: '100rem' }}>
              <Text>
                <Trans>admin.electionKey.confirmNewModalText</Trans>
              </Text>
            </div>
          </Modal>
        )}
        {this.state.showCreateKeyModal && (
          <CreateElectionKeyModal
            electionGroupId={this.props.electionGroup.id}
            onCloseModal={this.handleCloseCreateKeyModal}
            isReplacingOldKey={hasKey}
          />
        )}
      </>
    );
  }
}

export default ElectionKeySection;
