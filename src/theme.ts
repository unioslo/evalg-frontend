import { sectionBottomBorderStyle } from './appConfig';

const black = '#000000';
const lightBlack = '#222222';
const darkGray = '#2D2D2E';
const darkGreyishBrown = '#444444';
const greyishBrown = '#555555';
const lightGreyishBrown = '#666666';
const lighterGray = '#707070';
const gray = '#777777';
const lightGray = '#9B9B9B';
const darkEggWhite = '#c3c3c3';
const veryLightGray = '#CBCBCB';
const eggWhite = '#CCCCCC';
const lightDarkWhite = '#D8D8D8';
const darkWhite = '#DDDDDD';
const darkerWhite = '#999999';
const whiteGray = '#F4F9FA';
const paleGrey = '#F5FAFB';
const mediumWhite = '#F6F6F6';
const white = '#FFFFFF';
const darkBlueGreen = '#00413D';
const lightOliveGreen = '#91BD60';
const fadedOrange = '#EAB255';
const blueGreyish = '#acb2b3';
const blueish = '#2771bb';
const darkBlueish = '#2294a8';
const darkTurquoise = '#2194A8';
const lightTurquoise = '#8ECED9';
const lightBlueGray = '#C4E2E7';
const lightRed = '#FF8F8F';
const darkRed = '#E83535';

const colors = {
  black,
  blueGreyish,
  blueish,
  darkBlueGreen,
  darkBlueish,
  darkEggWhite,
  darkGray,
  darkGreyishBrown,
  darkRed,
  darkTurquoise,
  darkWhite,
  darkerWhite,
  eggWhite,
  fadedOrange,
  greyishBrown,
  lightBlack,
  lightBlueGray,
  lightDarkWhite,
  lightGray,
  lightGreyishBrown,
  lightOliveGreen,
  lightRed,
  lightTurquoise,
  lighterGray,
  gray,
  mediumWhite,
  paleGrey,
  veryLightGray,
  white,
  whiteGray,
};

const theme = {
  actionTextColor: blueish,
  stepperColor: lightTurquoise,
  stepperSectionCircleColorActive: darkTurquoise,
  stepperSectionCircleColorInactive: white,
  stepperSectionDescTextColor: lightBlack,
  stepperSectionTextColorActive: white,
  stepperSectionTextColorInactive: lightGray,
  appMaxWidth: '110rem',
  backArrowColor: darkTurquoise,
  borderColor: lighterGray,
  breakpoints: {
    lg: '1140px',
    lgQuery: '@media (min-width:1140px)',
    md: '768px',
    mdQuery: '@media (min-width:768px)',
    sm: '480px',
    notMobileQuery: '@media (min-width:480px)',
  },
  btnBorderWidth: '0.3rem',
  btnDefDisabledColor: blueGreyish,
  btnDefDisabledTextColor: white,
  closeIconColor: veryLightGray,
  colors,
  contentContainerHorPadding: '1rem',
  contentContainerMdHorPadding: '4.5rem',
  contentHorMdPadding: '1rem',
  contentHorPadding: '0rem',
  contentPageHeaderColor: greyishBrown,
  contentVertMdPadding: '4rem',
  contentVertPadding: '2rem',
  dropDownArrowColor: darkTurquoise,
  dropDownBorderColor: darkEggWhite,
  dropDownBorderColorActive: darkTurquoise,
  dropDownListItemBorderColor: darkWhite,
  dropDownTextColor: greyishBrown,
  dropDownSecondaryLineColor: gray,
  dropDownBackgroundColorFocused: lightBlueGray,
  dropDownWidth: '22.3rem',
  editText: blueish,
  electionStatusActiveColor: lightOliveGreen,
  electionStatusClosedColor: lightDarkWhite,
  electionStatusDraftColor: fadedOrange,
  formErrorTextColor: darkRed,
  formFieldBorder: '0.2rem solid',
  formFieldBorderActiveColor: darkTurquoise,
  formFieldBorderColor: darkEggWhite,
  formFieldBorderErrorColor: lightRed,
  formFieldBorderRadius: '0.3rem',
  formFieldFocusTransition: '350ms ease-out',
  formFieldFontSize: '1.6rem',
  formFieldHeight: '4.5rem',
  formFieldHorizontalPadding: '1.3rem',
  formFieldLabelFocusedColor: darkTurquoise,
  formFieldLabelUnfocusedColor: greyishBrown,
  formFieldLargeWidth: '32.5rem',
  formFieldLineHeight: '2.7rem',
  formFieldTextColor: greyishBrown,
  forwardArrowColor: white,
  forwardArrowColorBg: darkTurquoise,
  headerLogoBarColor: black,
  headerMainAreaColor: darkGray,
  headerMenuMargin: '2rem',
  helpBoxBorderColor: lightTurquoise,
  horizontalMdPadding: '6.5rem',
  horizontalPadding: '2rem',
  inlineDropdownTextColor: darkTurquoise,
  inlineDropdownBottomBorderColor: darkTurquoise,
  ingress: {
    fontFamily: 'Georgia, Times, Times New Roman, serif',
    fontSize: '2.2rem',
    lineHeight: '3rem',
    marginBottom: '3.5rem',
  },
  linkExternalColor: blueish,
  linkInternalColor: darkTurquoise,
  mainArrowColor: white,
  navFontSize: '1.5rem',
  navMenuTextColor: white,
  nextBtnBgColor: darkTurquoise,
  nextBtnBorderColor: 'transparent',
  nextBtnColor: white,
  plusIconBackgroundColor: darkTurquoise,
  plusIconFillColor: white,
  primaryBtnBgColor: darkTurquoise,
  primaryBtnBorderColor: 'transparent',
  primaryBtnFocusedBorderColor: lightTurquoise,
  primaryBtnColor: white,
  secondaryBtnBgColor: white,
  secondaryBtnBorderColor: lightTurquoise,
  secondaryBtnColor: darkBlueGreen,
  sectionBorderColor:
    sectionBottomBorderStyle === 'original' ? lightBlueGray : darkTurquoise,
  sectionBorderWidth: sectionBottomBorderStyle === 'original' ? '1rem' : '3px',
  sectionBorderStyle: 'solid',
  subSectionHeader: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
  },
  tableCandidateBottomBorderColor: darkWhite,
  tableCellGreyBgColor: paleGrey,
  tableFilterBoxBorderColor: darkEggWhite,
  tableHeaderBg: lightTurquoise,
  tableHeaderFontSize: '1.8rem',
  tableHeaderTextColor: darkGreyishBrown,
  tableHorizontalPadding: '3rem',
  tableInfoHeaderBg: mediumWhite,
  tableInputBorderActive: darkTurquoise,
  tableInputBorderInactive: darkEggWhite,
  tableRowDragColor: mediumWhite,
  tableRowHoverColor: mediumWhite,
  tableRowMainTextColor: greyishBrown,
  tableThickBorderColor: lightBlueGray,
  tabs : {
    bottomBorderColorActive: darkBlueish,
    bottomBorderColorInactive: eggWhite,
    backGroundColorActive: lightBlueGray,
    backGroundColorInactive: whiteGray,   
    textColor: darkGreyishBrown,
  }
};

export default theme;
