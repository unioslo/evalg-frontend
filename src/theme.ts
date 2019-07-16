import { sectionBottomBorderStyle } from './appConfig';


const black = '#000000';
const white = '#FFFFFF';
const lightBlack = '#222222';
const darkGray = '#2D2D2E';
const darkGreyishBrown = '#444444';
const greyishBrown = '#555555';
const gray = '#707070';
const lightGray = '#9B9B9B';
const darkEggWhite = '#c3c3c3';
const eggWhite = '#CCCCCC';
const darkWhite = '#DDDDDD';
const backgroundGray = '#E1E3E4';
const whiteGray = '#F4F9FA';
const paleGrey = '#F5FAFB';
const mediumWhite = '#F6F6F6';
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
  backgroundGray,
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
  eggWhite,
  fadedOrange,
  greyishBrown,
  lightBlack,
  lightBlueGray,
  lightGray,
  lightOliveGreen,
  lightRed,
  lightTurquoise,
  gray,
  mediumWhite,
  paleGrey,
  white,
  whiteGray,
};

const theme = {
  actionTextColor: blueish,
  stepperColor: lightTurquoise,
  stepperItemCircleColorActive: darkTurquoise,
  stepperItemCircleColorInactive: white,
  stepperItemTextColor: lightBlack,
  stepperItemNumberColorActive: white,
  stepperItemNumberColorInactive: lightGray,
  appMaxWidth: '110rem',
  backArrowColor: darkTurquoise,
  borderColor: gray,
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
  closeIconColor: darkEggWhite,
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
  electionStatusClosedColor: eggWhite,
  electionStatusDraftColor: fadedOrange,
  errorTextColor: darkRed,
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
  loginPageBgColor: backgroundGray,
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
  linkInternalColor: blueish,
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
  tabs: {
    bottomBorderColorActive: darkBlueish,
    bottomBorderColorInactive: eggWhite,
    backGroundColorActive: lightBlueGray,
    backGroundColorInactive: whiteGray,
    textColor: darkGreyishBrown,
  },
};

export default theme;
