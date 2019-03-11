export default {
  admin: {
    electionKey: {
      create: 'Opprett valgnøkkel',
      createNew: 'Opprett ny valgnøkkel',
      confirmNewModalHeader: 'Erstatt eksisterende valgnøkkel?',
      confirmNewModalText:
        'Er du sikker på at du ønsker å erstatte den eksisterende valgnøkkelen med en ny? Den eksisterende valgnøkkelen vil ikke kunne brukes til å telle opp valget.',
      modalGenerating: 'Genererer valgnøkkel',
      modalActivate: 'Aktiver valgnøkkelen',
      modalActivateNew: 'Aktiver den nye valgnøkkelen',
      modalActivating: 'Aktiverer valgnøkkel',
      modalActivatedSuccessfully: 'Valgnøkkelen er aktivert',
      publicKeyCaption: 'Offentlig nøkkel (ikke valgnøkkel)',
      modalDetailsSecretKey: 'Hemmelig dekrypteringsnøkkel (valgnøkkel)',
      modalDetailsPublicKey: 'Offentlig krypteringsnøkkel',
      modalDetailsCreatedBy: 'Opprettet av',
      modalDetailsTimeCreated: 'Tidspunkt opprettet',
      modalDownloadKey: 'Last ned valgnøkkel',
      modalDownloadNewKey: 'Last ned ny valgnøkkel',
      modalInfoListHeader: 'Viktig om valgnøkkelen:',
      modalInfoBullet1:
        'Uten valgnøkkelen er det ikke mulig å telle opp stemmene. Det anbefales å ta en sikkerhetskopi av valgnøkkel-filen.',
      modalInfoBullet2:
        'Valgnøkkelen du er i ferd med å aktivere kan ikke lastes ned på nytt senere. Inntil valget starter kan du imidlertid erstatte den aktive valgnøkkelen med en ny.',
      modalMoreInfoLink: 'Mer informasjon og tips',
      modalCheckboxLabel:
        'Jeg forstår at valget ikke kan telles opp uten valgnøkkelen.',
      missing:
        'Valgnøkkel er ikke opprettet. En valgnøkkel er nødvendig for å telle opp stemmene.',
      createdBy: 'Valgnøkkel ble opprettet av',
      readMore: 'Les mer om nøkkelhåndtering',
      save: 'Lagre nøkkel',
      infoListCanReplace:
        'Frem til det er avgitt stemmer har du mulighet til å opprette en ny valgnøkkel som erstatter den gamle. Merk: Hvis valget er publisert eller pågår må du avpublisere valget før du kan erstatte valgnøkkelen.',
      infoListKeepItSafe:
        'Sørg for at nøkkelen er lagret et sikkert sted. Uten nøkkelen kan ikke stemmene telles opp.',
      cannotReplaceBecauseUnsafeStatus:
        'For å opprette en ny valgnøkkel som erstatter den gamle valgnøkkelen må du først avpublisere valget. Det vil ikke være mulig å erstatte valgnøkkelen dersom det er avgitt stemmer i valget.',
    },
    errors: {
      generateKeyError: 'Noe gikk galt under generering av nøkkelpar.',
      activateKeyErrorGeneral:
        'Noe gikk galt under opplasting og aktivering av offentlig nøkkel. Sjekk internett-tilkoblingen, lukk dialogboksen og prøv på nytt.',
    },
    backendErrors: {
      unknown: 'En uventet feil har oppstått.',
      cannotChangeKeyIfPastStart:
        'Det er ikke tillatt å endre valgnøkkelen fordi valget pågår.',
      cannotChangeKeyIfPublished:
        'Det er ikke tillatt å endre valgnøkkelen fordi valget er publisert.',
      cannotChangeKeyIfVotesExist:
        'Det er ikke tillatt å endre valgnøkkelen fordi det er avgitt stemmer i valget.',
    },
  },
  candidate: {
    infoLinkText: 'Mer om kandidaten',
  },
  census: {
    aboutCensusFiles: 'For informasjon om manntallsfiler se',
    addPerson: 'Legg til person',
    addPersonHelpText:
      'Du kan også legge inn flere personer separert med komma',
    addPersonInputPlaceholder: 'Skriv inn brukernavn, navn eller fødselsnummer',
    addPersonModalHeader: 'Legg til personer i manntallet',
    addPersons: 'Legg til personer i {{pollbookName}}',
    addTo: 'Legg til',
    censusPageDesc: 'Her kan du opprette og administrere manntall.',
    censusType: 'Type manntall',
    chooseFile: 'Velg fil for opplasting',
    deleteCensus: 'Slett manntall',
    deletePersonConfirmationModalText:
      'Er du sikker på at du vil slette {{personName}} fra «{{pollbookName}}»?',
    deletePersonConfirmationModalTitle: 'Bekreft sletting',
    deletePollbookConfirmationModalText:
      'Er du sikker på at du vil slette velgergruppen «{{pollbookName}}» ({{num}} {{of}})?',
    deletePollbookConfirmationModalTitle: 'Bekreft sletting',
    group: 'Gruppe',
    person: 'Person',
    persons: 'Personer',
    uploadCensusFileButton: 'Last opp manntallsfil',
    uploadCensusFileHeader: 'Last opp manntal fra fil',
    uploadOkMsg: '{{nr}} personer ble lagt til i gruppen {{pollbookName}}',
    uploadServerError:
      'Feilmelding fra tjener. Greide ikke å laste inn manntall',
  },
  election: {
    activeElectionsHeader:
      'Hvilke grupper skal representeres og hvor mange kandidater skal velges fra hver av gruppene?',
    addCandidate: 'Legg til kandidat',
    addPrefTeamCandidate: 'Legg til kandidat og medkandidater',
    adminGroup: 'Grupper',
    adminRoles: 'Administrative roller',
    adminRolesDesc:
      'Rollene angir hvem som har rettigheter i forbindelse med valget.',
    adminUser: 'Enkeltbrukere',
    allVotingGroups: 'Alle velgergrupper',
    announceElectionConfirm: 'Synliggjør valget',
    announceElectionHeader: 'Synliggjør valget på forsiden',
    announceElectionInfoOne:
      'Valget og stemmeperioden for valget vil bli synlig på forsiden hos velgerne.',
    announceElectionInfoTwo:
      'Merk at valget ikke kan starte før det oppfyller minimumskravene og publisering er godkjent av valgansvarlig.',
    announceElectionReadMore: 'Les mer om synliggjøring av valget',
    ballot: 'Stemmeseddel',
    blockerMissingKey: 'Valgnøkkel',
    blankVote: 'Blank stemme',
    blockerStartBeforeEnd: 'Starttid må være før sluttid',
    blockerUnknown: 'Noe uventet er galt',
    candidate: 'Kandidat',
    candidateCounter: 'Har {{count}} av {{minCount}} kandidater',
    candidateNamePlaceHolder: 'Navn på kandidat',
    candidateUrl: 'https://example.org',
    candidates: 'Kandidater',
    candidatesShort: 'faste',
    census: 'Manntall',
    censuses: 'Manntall',
    changeVote: 'Endre stemme',
    closed: 'Stengt',
    closes: 'Avsluttes',
    coCandidate: 'Medkandidat',
    coCandidateNamePlaceHolder: 'Navn på medkandidat',
    coCandidates: 'Medkandidater',
    coCandidatesShort: 'vara',
    contactForElectors: 'Kontaktpunkt for velgerne',
    contactForElectorsPlaceholder: 'E-postadresse eller nettside',
    createNewElection: 'Opprett nytt valg',
    deleteCandidate: 'Slett kandidat',
    draft: 'Utkast',
    editBoardLeaderCandidate: 'Endre kandidat og medkandidater',
    editCandidate: 'Endre kandidat',
    election: 'Valg',
    electionAdmins: 'Valgansvarlige',
    electionAdminsDesc:
      'Kan endre innstillinger og informasjon for valget, telle stemmer og delegere tilganger.',
    electionCloses: 'Valget stenger',
    electionInfo: 'Valginformasjon',
    electionKey: 'Valgnøkkel',
    electionNotStarted: 'Valget har ikke startet.',
    electionOpens: 'Valget åpner',
    electionCancelled: 'Valget er avlyst',
    electionStatus: 'Valgstatus',
    electionType: 'Valgordning',
    elections: 'Valg',
    fromDate: 'Fra dato',
    goTo: 'Gå til',
    group: 'Gruppe',
    hasGenderQuota: 'Valget har kjønnskvotering',
    linkToElection: 'Lenke til mer informasjon om valget',
    linkToElectionPlaceholder: 'Nettside for valget',
    manageElections: 'Administrer valg',
    manageableElections: 'Valg du kan administrere',
    mandatePeriod: 'Mandatperiode',
    mandatePeriodMultiple: 'Individuell mandatperiode for velgergrupper',
    mandatePeriodShared: 'Felles mandatperiode for alle velgergrupper',
    multipleStatuses: 'Flere verdier',
    multipleTimes: 'Flere tider',
    multipleVotingPeriods: 'Invidiuelle stemmeperioder for velgergrupper',
    newCoCandidate: 'Ny medkandidat',
    noActiveElections:
      'Det er for øyeblikket ingen valg som er satt som aktive.',
    noActiveVoterGroups: 'Ingen aktive velgergrupper',
    noCandidatesDefined: 'Det er ingen kandidater i listen.',
    noCandidatesFound: 'Ingen kandidater tilfredstiller søkekriteriene.',
    noManageableElections:
      'Det er for øyeblikket ingen valg hvor du er registrert som administrator.',
    nrOfCandidates: 'Antall faste representanter',
    nrOfCoCandidates: 'Antall vararepresentanter',
    opens: 'Åpnes',
    prefTeamHeader:
      'Her kan du legge til og administrere kandidater og medkandidater som stiller til valg.',
    publish: 'Publiser',
    publishElection: 'Publiser valget',
    publishElectionModalInfo:
      'Valget vil være synlig for velgerne og åpner automatisk til angitt tidspunkt.',
    published: 'Publisert',
    quotas: 'Kvotering',
    remove: 'Fjern',
    rightToVote: 'Stemmerett',
    selectLevel: 'Valg av',
    selectParish: 'Valgkrets',
    selectType: 'Velg valgordning',
    settings: 'valginnstillinger',
    singleVotingPeriod: 'Felles stemmeperiode for alle velgergrupper',
    status: 'Status',
    statusCanAnnounce:
      'Du kan gjøre stemmeperioden for valget synlig for velgerne',
    statusDoAnnounce: 'Gjør synlig',
    statusDoUnannounce: 'Fjern fra forsiden',
    statusDraftNotReady: 'Valget oppfyller ikke minimumskravene',
    statusDraftReady:
      'Valget oppfyller nå minimumskravene for å kunne gjennomføres',
    statusIsAnnounced:
      'Stemmeperioden for valget er synlig på forsiden hos velgerne',
    statusOpensAutomatically:
      'Valget er publisert og vil starte automatisk til angitt tidspunkt.',
    statusThisIsMissing: 'Dette mangler',
    toDate: 'Til Dato',
    unannounceElectionConfirm: 'Fjern fra forsiden',
    unannounceElectionHeader: 'Fjern valget fra forsiden',
    unannounceElectionInfoOne:
      'Valget og stemmeperioden for valget blir usynlig på forsiden hos velgerne.',
    unannounceElectionInfoTwo:
      'Du vil kunne gjøre valget synlig igjen senere hvis du ønsker det.',
    unpublish: 'Avpubliser',
    unpublishElection: 'Avpubliser valget',
    unpublishElectionModalInfo: 'Valget vil ikke åpne automatisk.',
    valueNotSet: 'ikke satt',
    voteNow: 'Stem nå',
    voterContactInfo: 'Kontaktpunkt for velgerne',
    voterContactInfoMultiple:
      'Individuell kontaktinformasjon for velgergrupper',
    voterContactInfoShared: 'Felles kontaktinformasjon for alle velgergrupper',
    voterGroup: 'Velgergruppe',
    voterInfo: 'Informasjon til velgerne',
    voterInfoFormDesc:
      'Informasjonen som angis her vil være synlig på forsiden hos velgerne.',
    voterInfoUrl: 'Lenke til mer informasjon om valget',
    voterInfoUrlMultiple: 'Individuelle nettsider for velgergrupper',
    voterInfoUrlShared: 'Felles nettside for alle velgergrupper',
    voterSettings: 'Velgergrupper og kandidatinnstillinger',
    votes: 'Stemmer',
    votesOutsideCensus: 'Stemmer utenfor manntallet',
    votingPeriod: 'Stemmeperiode',
    votingPeriodSubHeader:
      'I hvilken tidsperiode skal valget være åpent for velgerne?',
  },
  electionStatus: {
    announced: 'Utkast (annonsert)',
    closed: 'Stengt',
    closedElections: 'Avsluttede valg',
    draft: 'Utkast',
    multipleStatuses: 'Flere verdier',
    ongoing: 'Pågår',
    ongoingElections: 'Pågående valg',
    published: 'Klart',
    upcomingElections: 'Kommende valg',
  },
  footer: {
    termsHeader: 'Vilkår',
    termsAndPrivacyLink: 'Personvern og vilkår for bruk',
    evalgUses: 'eValg bruker',
    cookiesInformationLink: 'informasjonskapsler',
    contactSectionHeader: 'Kontaktpunkter',
    responsibleOrganizationHeader: 'Ansvarlig for tjenesten',
    technicalSupport: 'Teknisk støtte',
    serviceOwnerLink:
      'Seksjon for integrasjon og elektroniske identiteter (INT)',
  },
  formErrors: {
    invalidDates: 'Starttid må være tidligere enn sluttid.',
    invalidEmail: 'Ugyldig epostadresse.',
    invalidUrl: 'Ugyldig url.',
  },
  general: {
    add: 'Legg til',
    administerElections: 'Administrer valg',
    all: 'Alle',
    and: 'og',
    at: 'ved',
    back: 'Tilbake',
    cancel: 'Avbryt',
    choose: 'Velg',
    chooseFile: 'Velg fil',
    close: 'Lukk',
    contactInfo: 'Kontaktinfo',
    copy: 'Kopiér',
    datePlaceHolder: 'dd.mm.åååå',
    delete: 'Slett',
    edit: 'endre',
    email: 'Epost',
    errorMessage: 'Feilmelding',
    female: 'Kvinne',
    finishedElections: 'Avsluttede valg',
    frontPageDesc: 'Her kan du stemme i elektroniske valg.',
    gender: 'Kjønn',
    group: 'Gruppe',
    headerSubtitleVoter: 'Elektronisk valg',
    headerSubtitleAdmin: 'Elektronisk valg - Administrasjon',
    help: 'Hjelp',
    hide: 'Skjul',
    hideDetails: 'Skjul detaljer',
    login: 'Logg inn',
    logout: 'Logg ut',
    logoutInProgress: 'Vi arbeider med å logge deg ut av systemet',
    male: 'Mann',
    menu: 'Meny',
    name: 'Navn',
    no: 'Nei',
    noClosedElections: 'Det er ingen avsluttede valg.',
    noOngoingElections: 'Det er ingen pågående valg.',
    noUpcomingElections: 'Det er ingen kommende valg.',
    of: 'av',
    ok: 'OK',
    ongoingElections: 'Pågående valg',
    proceed: 'Gå videre',
    remove: 'Fjern',
    required: 'Påkrevd',
    save: 'Lagre',
    saving: 'Lagrer',
    select: 'Velg',
    frontPage: 'Forsiden',
    show: 'Vis',
    showDetails: 'Vis detaljer',
    timePlaceHolder: 'tt:mm',
    title: 'eValg',
    to: 'til',
    upcomingElections: 'Kommende valg',
    upload: 'Last opp',
    webpage: 'Nettadresse',
    welcome: 'Velkommen til eValg',
    yes: 'Ja',
  },
  prefElec: {
    candPageDesc:
      'Her legger du til kandidater som stiller for de ulike velgergruppene.<0></0>' +
      'Valget må ha minimum like mange kandidater per gruppe som angitt under <1>valginnstillinger</1>.',
  },
  voter: {
    canVoteBlank: 'Du kan også stemme blankt.',
    castVote: 'Avgi stemme',
    chooseCandidates: 'Velg kandidater',
    chosenCandidate: 'Valgt kandidat',
    crossedCandidates: 'Kandidater strøket fra listen',
    cumulate: 'Ekstra stemme',
    editVote: 'Rediger stemme',
    majorityVoteHelpHeader: 'Velg en kandidat',
    majorityVoteHelpDesc: 'Velg kandidaten du vil stemme på.',
    majorityVoteHelpYouMaySelectOnlyOne:
      'Dette er et flertallsvalg, og du kan kun velge en kandidat.',
    prefElecDesc:
      'Marker kandidatene du vil stemme på, i prioritert rekkefølge.',
    prefElecNrOfCandidates: 'Du kan stemme på så mange kandidater du vil.',
    prefElecOnlySelectedGetVote:
      'Det er bare kandidatene du markererer som får en stemme.',
    prefElecRankCandidates:
      'Ranger kandidaten du foretrekker mest som nummer 1 (ditt førstevalg). Hvis denne kandidaten ikke får nok stemmer totalt sett, vil stemmen du ga vedkommende overføres til den du eventuelt har rangert som nummer 2, og så videre.',
    prefElecRankCandidatesShort:
      'Du rangerer kandidatene ved å trykke på dem i prioritert rekkefølge. Rekkefølgen kan gjøres om på underveis.',
    receiptThankYou: 'Takk for din stemme.',
    receiptVotingAgainInfo:
      'Dersom du ønsker å endre stemmen din kan du gjøre dette fra forsiden så lenge valget pågår.',
    receiptGoToFrontpage: 'Gå til forsiden',
    receiptLogout: 'logg ut',
    receiptOr: 'eller',
    receiptErrorHeader: 'En feil har oppstått.',
    receiptErrorBody:
      'En feil inntraff ved levering av din stemme. Vennligst prøv igjen senere.',
    resetPrefElecBallot: 'Tilbakestill',
    reviewBallot: 'Se over stemmeseddel',
    reviewBallotMobile: 'Se stemmeseddel',
    reviewBallotIngressText:
      'Se over stemmeseddelen din nedenfor. Lever deretter stemmen, eller gå tilbake for å gjøre endringer.',
    stepperStep1: 'Stemmerett',
    stepperStep2: 'Fyll ut stemmeseddel',
    stepperStep3: 'Se over stemmeseddel',
    stepperStep4: 'Kvittering',
    submitVote: 'Lever stemme',
  },
  voterGroupSelect: {
    andCloses: 'og stenger',
    electionClosed: 'Dette valget er avsluttet',
    electionNotOpen: 'Dette valget er ikke åpent',
    electionNotYetOpen: 'Dette valget har ikke åpnet ennå',
    isNotOpen: 'er ikke åpent',
    moreAboutTheElection: 'Mer om valget',
    notRegisteredInSelectedGroupHeading: 'Har du valgt riktig manntall?',
    notRegisteredInSelectedGroupBeforeDropdownText:
      'Du er ikke i manntallet for',
    notRegisteredInSelectedGroupInfoText:
      'Du er ikke registert i dette manntallet. Du kan allikevel gå videre og stemme som om du var i manntallet. ' +
      'Valgstyret for valget vil avgjøre om din stemme skal telles med basert på dine tilknytninger ved UiO. ' +
      'Du kan oppgi din stillingskode eller annen relevant informasjon under.',
    opens: 'åpner',
    registeredInSelectedGroupHeading: 'Du har stemmerett',
    registeredInSelectedGroupBeforeDropdownText: 'Du er i manntallet for',
    theElectionFor: 'Valget for',
    wasClosed: 'stengte',
    writeJustification:
      'Hvorfor du skulle vært med i dette mantallet (valgfritt)',
    youAreOnTheElectoralRoll: 'Du er i manntallet',
  },
};
