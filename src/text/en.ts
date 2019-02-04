export default {
  candidate: {
    infoLinkText: 'More about the candidate',
  },
  census: {
    aboutCensusFiles: 'For more information about the census files (norwegian only)',
    addPerson: 'Add person',
    addPersonHelpText:
      'You can also add multiple persons, separated by a comma',
    addPersonInputPlaceholder: 'Enter username, name or social security number',
    addPersonModalHeader: 'Add persons to the census',
    addPersons: 'Add persons in {{pollbookName}}',
    addTo: 'Add',
    censusPageDesc: 'Here you can create and administer censuses.',
    censusType: 'Pollbook type',                                                                
    chooseFile: 'Choose file to upload', 
    deleteCensus: 'Delete census',
    deletePersonConfirmationModalText:
      'Are you sure you want to delete {{personName}} from “{{pollbookName}}”?',
    deletePersonConfirmationModalTitle: 'Confirm deletion',
    deletePollbookConfirmationModalText:
      'Are you sure you want to delete the pollbook “{{pollbookName}}” ({{num}} {{of}})?',
    deletePollbookConfirmationModalTitle: 'Confirm deleteion',
    group: 'Group',
    person: 'Person',
    persons: 'Persons',
    uploadCensusFileButton: 'Upload census file',                                               
    uploadCensusFileHeader: 'Upload census from file',
    uploadOkMsg: 'Added {{nr}} persons to the group {{pollbookName}}',
    uploadServerError: 'Error from server. Census file parsing failed',
  },
  election: {
    activeElectionsHeader:
      'Which groups should be represented, and how many candidates shall be elected from each of the groups?',
    addCandidate: 'Add candidate',
    addPrefTeamCandidate: 'Add a candidate and cocandidates',
    adminGroup: 'Groups',
    adminRoles: 'Administrative roles',
    adminRolesDesc: 'The roles indicate who has permissions on this election.',
    adminUser: 'Single users',
    announceElectionConfirm: 'Make visible',
    announceElectionHeader: 'Make election visible',
    announceElectionInfoOne:
      'The election and voting period will be visible on the voters front page.',
    announceElectionInfoTwo:
      'Note that the election cannot start before it meets the minimum requirements and is approved by the election owner.',
    announceElectionReadMore: 'Read more about making an election visible',
    ballot: 'Ballot',
    blockerMissingKey: 'Election key',
    blockerStartBeforeEnd: 'Start time must be before end time',
    blockerUnknown: 'Something unexpected is wrong',
    candidate: 'Candidate',
    candidateCounter: 'Has {{count}} of {{minCount}} candidates',
    candidateNamePlaceHolder: 'Candidate name',
    candidateUrl: 'https://example.org',
    candidates: 'Candidates',
    candidatesShort: 'candidates',
    census: 'Census',
    censuses: 'Censuses',
    closed: 'Closed',
    closes: 'Closes',
    coCandidate: 'Co-candidate',
    coCandidateNamePlaceHolder: 'Candidate name',
    coCandidates: 'Co-candidates',
    coCandidatesShort: 'co-candidates',
    contactForElectors: 'Contact point for electors',
    contactForElectorsPlaceholder: 'E-mail address or webpage',
    createNewElection: 'Create new election',
    deleteCandidate: 'Delete candidate',
    draft: 'Draft',
    editBoardLeaderCandidate: 'Edit candidate and cocandidates',
    editCandidate: 'Edit candidate',
    election: 'Election',
    electionAdmins: 'Election admins',
    electionAdminsDesc:
      'Can change settings and information for the election, count votes and delegate permissions.',
    electionCloses: 'Election closes',
    electionInfo: 'Election information',
    electionInfoShort: 'Election info',
    electionKey: 'Election key',
    electionKeyCreate: 'Create election key',
    electionKeyCreateNew: 'Create new election key',
    electionKeyConfirmNewModalHeader: 'Replace existing election key?',
    electionKeyConfirmNewModalText:
      'Are you sure you want to replace the existing election key? If you proceed, the existing election key cannot be used to count the votes.',
    createElectionKeyModalGeneratingPair: 'Generating key pair',
    createElectionKeyModalUploadingAndActivating:
      'Uploading and activating public key',
    createElectionKeyModalDetailsSecretKey:
      'Secret decryption key (election key)',
    createElectionKeyModalDetailsPublicKey: 'Public encryption key',
    createElectionKeyModalDetailsCreatedBy: 'Created by',
    createElectionKeyModalDetailsTimeCreated: 'Time created',
    createElectionKeyModalSaveKeyFile: 'Save election key file',
    createElectionKeyModalInfoListHeader: 'Important about the election key:',
    createElectionKeyModalInfoBullet1:
      'Save the file with the election key by clicking the button above. Save the file on a secure location not accessible to others.',
    createElectionKeyModalInfoBullet2:
      '<strong>Without the election key it will not be possible to count the votes</strong>. Keeping a backup of the election key file is recommended.',
    createElectionKeyModalInfoBullet3:
      '<strong>After you have closed this dialog, it will not be possible to get hold of the election key again.</strong> However, until the election has stared, it is possible to generate a new election key.',
    createElectionKeyModalInfoBullet4:
      'You can change the filename of the election key file, but you must not change the file contents.',
    createElectionKeyModalCheckboxLabel1:
      "I've saved the file with the election key somewhere safe.",
    createElectionKeyModalCheckboxLabel2:
      'I understand that the election key can will not be available for download after I close this diaolog, and that the election votes can not be counted without the election key.',
    createElectionKeyModalCheckboxesValidationError:
      'You must check the boxes above before clicking «Close».',
    electionKeyMissing:
      'No elecition key is created. An election key is needed to count the votes.',
    electionKeyCreatedBy: 'Election key was created by',
    electionKeyReadMore: 'Read more about election keys',
    electionKeySave: 'Save key',
    electionKeyStatusCanReplace:
      'You can replace the old key with a new one as long as the election has not started.',
    electionKeyStatusKeepItSafe:
      'Make sure the key is stored somewhere safe. Without the key, votes cannot be counted.',
    electionKeyCannotCreateReasonPublished:
      'To create a new election key, you must first unpublish the election.',
    electionKeyCannotCreateReasonHasStarted:
      'It is not possible to create a new election key since the election has started.',
    electionNotStarted: 'The election has not started.',
    electionOpens: 'Election opens',
    electionCancelled: 'The election is cancelled',
    electionStatus: 'Election status',
    electionType: 'Election type',
    elections: 'Elections',
    fromDate: 'From date',
    goTo: 'Go to',
    group: 'Group',
    hasGenderQuota: 'Election uses gender quotas',
    linkToElection: 'Link to more information about the election',
    linkToElectionPlaceholder: 'Webpage for the election',
    manageElections: 'Manage elections',
    manageableElections: 'Elections you can manage',
    mandatePeriod: 'Mandate period',
    mandatePeriodMultiple: 'Specific mandate period for each voter group',
    mandatePeriodShared: 'Shared mandate period for all voter groups',
    multipleStatuses: 'Varying',
    multipleTimes: 'Varying',
    multipleVotingPeriods: 'Invidual voting periods for groups',
    newCoCandidate: 'New cocandidate',
    noActiveElections: 'There are currently no active elections.',
    noCandidatesDefined: 'There are no candidates in the list.',
    noCandidatesFound: 'No candidates matches the search criterias',
    noManageableElections:
      'There are currently no elections where you are registered as an administrator.',
    nrOfCandidates: 'Number of candidates',
    nrOfCoCandidates: 'Number of co-candidates',
    ongoing: 'Ongoing',
    opens: 'Opens',
    prefTeamHeader:
      'Here you can add and administer running candidates and co-candidates.',
    publish: 'Publish',
    publishElection: 'Publish election',
    publishElectionModalInfo:
      'The election will be visible to the voters and start at the specified time.',
    published: 'Published',
    quotas: 'Quotas',
    remove: 'Remove',
    reviewBallot:
      'Review your ballot below. Then either submit your vote, or go back to make changes.',
    selectLevel: 'Election of',
    selectParish: 'Parish',
    selectType: 'Choose election type',
    settings: 'election settings',
    showBallot: 'Show ballot',
    singleVotingPeriod: 'Same voting period for all groups',
    status: 'Status',
    statusCanAnnounce: 'You can make the voting period visible for the voters',
    statusDoAnnounce: 'Make visible',
    statusDoUnannounce: 'Remove from front page',
    statusDraftNotReady: 'Election does not meet the minimum requirements',
    statusDraftReady: 'Election meets the minimum requirements',
    statusIsAnnounced: 'The voting period is visible on the voters front page',
    statusOpensAutomatically:
      'The election is published and starts automatically at the specified time.',
    statusThisIsMissing: 'This is missing',
    toDate: 'To date',
    unannounceElectionConfirm: 'Make invisible',
    unannounceElectionHeader: 'Remove from front page',
    unannounceElectionInfoOne:
      'The election and voting period will be invisible on the voters front page.',
    unannounceElectionInfoTwo: 'You can later make the election visible again.',
    unpublish: 'Unpublish',
    unpublishElection: 'Unpublish election',
    unpublishElectionModalInfo:
      'The election will not start at the specified time.',
    valueNotSet: 'not set',
    voteNow: 'Vote now',
    voterContactInfo: 'Voter contact info',
    voterContactInfoMultiple: 'Specific contact info each voter group',
    voterContactInfoShared: 'Shared contact info for all voter groups',
    voterGroup: 'Voting group',
    voterInfo: 'Information for voters',
    voterInfoFormDesc:
      'Information given here will be visible on the front page.',
    voterInfoUrl: 'Link to election details',
    voterInfoUrlMultiple: 'Specific webpage for each voter group',
    voterInfoUrlShared: 'Shared webpage for all voter groups',
    voterSettings: 'Voter groups and candidate settings',
    votes: 'Votes',
    votesOutsideCensus: 'Votes outside census',
    votingPeriod: 'Voting period',
    votingPeriodSubHeader:
      'In which time period should the election be open for voters?',
  },
  electionStatus: {
    announced: 'Draft (announced)',
    closed: 'Closed',
    closedElections: 'Closed elections',
    draft: 'Draft',
    multipleStatuses: 'Multiple Values',
    ongoing: 'Ongoing',
    ongoingElections: 'Ongoing elections',
    published: 'Ready',
    upcomingElections: 'Upcoming elections',
  },
  formErrors: {
    invalidDates: 'Start time must be before closing time.',
    invalidEmail: 'Invalid email address.',
    invalidUrl: 'Invalid url.',
  },
  general: {
    add: 'Add',
    all: 'All',
    at: 'at',
    back: 'Back',
    cancel: 'Cancel',
    choose: 'Choose',
    chooseFile: 'Choose file',
    close: 'Close',
    contactInfo: 'Contact info',
    copy: 'Copy',
    datePlaceHolder: 'dd/mm/yyyy',
    delete: 'Delete',
    edit: 'edit',
    email: 'Email',
    female: 'Female',
    finishedElections: 'Finished elections',
    frontPageDesc: 'Here you can vote in electronic elections.',
    gender: 'Gender',
    group: 'Group',
    headerSubtitleVoter: 'Digital Elections',
    headerSubtitleAdmin: 'Digital Elections - Administration',
    hideDetails: 'Hide details',
    logout: 'Log out',
    male: 'Male',
    menu: 'Menu',
    name: 'Name',
    no: 'No',
    noClosedElections: 'There are no finished elections.',
    noOngoingElections: 'There are no ongoing elections.',
    noUpcomingElections: 'There are no upcoming elections.',
    of: 'of',
    ok: 'OK',
    ongoingElections: 'Ongoing elections',
    proceed: 'Proceed',
    remove: 'Remove',
    required: 'Required',
    save: 'Save',
    saving: 'Saving',
    select: 'Select',
    frontPage: 'Front page',
    showDetails: 'Show details',
    timePlaceHolder: 'hh:mm',
    title: 'eValg',
    to: 'to',
    upcomingElections: 'Upcoming elections',
    upload: 'Upload',
    webpage: 'Nettside',
    welcome: 'Welcome to eValg',
    yes: 'Yes',
  },
  prefElec: {
    candPageDesc:
      'Here you can add candidates that are electable for the various voter groups.{nl}' +
      'The election must have at least as many candidates per voter group as stated in {{infoLink}}.',
  },
  voter: {
    canVoteBlank: 'You may also submit a blank vote.',
    cumulate: 'Extra vote',
    prefElecDesc:
      'Select the candidates you would like to include in your vote, in prioritized order.',
    prefElecNrOfCandidates:
      'You can vote on as many of the listed candidates as you prefer.',
    prefElecOnlySelectedGetVote:
      'It is only the candidates you select that will receive a vote.',
    prefElecRankCandidates:
      "Rank the candidates in prioritized order. If a candidate you have selected doesn't receive enough total votes in the election, your vote for that candidate will be transferred to the next candidate on your ballot.",
    prefElecRankCandidatesShort:
      'Rank the candidates as preferred by selection them in the preferred order. You may change the order of already selected candidates as you go along.',
    reviewBallot:
      'Review your ballot below, then confirm your vote or go back to make changes.',
  },
  voterGroupSelect: {
    aboutElectionLink: 'Read more about the election',
    registeredInSelectedGroupHeading: 'You have voting rights',
    registeredInSelectedGroupBeforeDropdownText:
      'You are registered with voting rights in the group',
    notRegisteredInSelectedGroupHeading:
      'Have you chosen the right voting group?',
    notRegisteredInSelectedGroupBeforeDropdownText:
      'You are not registered in the voting group for',
    notRegisteredInSelectedGroupInfoText:
      'The election board will decide if your vote will count based on your affiliation with UiO. If you believe you should be registered in this voting group, please state your job code or other relevant information below.',
    writeJustification:
      'Please provide a reason why you have voting rights in this group',
  },
};
