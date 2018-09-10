const black = '#000000';
const lightBlack = '#222222';
const darkGray = '#2D2D2E';
const darkGreyishBrown = '#444444';
const greyishBrown = '#555555';
const lightGreyishBrown = '#666666';
const lighterGray = '#707070';
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
  lightBlack,
  darkGray,
  darkGreyishBrown,
  greyishBrown,
  lightGreyishBrown,
  lighterGray,
  lightGray,
  darkEggWhite,
  veryLightGray,
  eggWhite,
  lightDarkWhite,
  darkWhite,
  darkerWhite,
  whiteGray,
  paleGrey,
  mediumWhite,
  white,
  darkBlueGreen,
  lightOliveGreen,
  fadedOrange,
  blueGreyish,
  blueish,
  darkBlueish,
  darkTurquoise,
  lightTurquoise,
  lightBlueGray,
  lightRed,
  darkRed,
}

const theme = {
  breakpoints: {
    sm: '480px',
    md: '768px',
    lg: '1140px'
  },
  colors,
  appMaxWidth: '110rem',
  borderColor: lighterGray,
  btnDefDisabledColor: blueGreyish,
  btnDefDisabledTextColor: white,
  btnBorderWidth: '0.3rem',
  primaryBtnColor: white,
  primaryBtnBgColor: darkTurquoise,
  primaryBtnBorderColor: 'transparent',
  secondaryBtnColor: darkBlueGreen,
  secondaryBtnBgColor: white,
  secondaryBtnBorderColor: lightTurquoise,
  nextBtnColor: white,
  nextBtnBgColor: darkTurquoise,
  nextBtnBorderColor: 'transparent',
  horizontalPadding: '2rem',
  horizontalMdPadding: '6.5rem',
  headerMenuMargin: '2rem',
  headerLogoBarColor: black,
  headerMainAreaColor: darkGray,
  navFontSize: '1.5rem',
  navMenuTextColor: white,
  adminNavBarColor: lightTurquoise,
  adminNavBarSectionCircleColorActive: darkTurquoise,
  adminNavBarSectionCircleColorInactive: white,
  adminNavBarSectionTextColorActive: white,
  adminNavBarSectionTextColorInactive: lightGray,
  adminNavBarSectionDescTextColor: lightBlack,
  contentContainerHorPadding: '2rem',
  contentContainerMdHorPadding: '4.5rem',
  contentHorPadding: '0rem',
  contentHorMdPadding: '1rem',
  contentPageHeaderColor: greyishBrown,
  editText: blueish,
  contentSectionBorderColor: lightBlueGray,
  forwardArrowColor: white,
  forwardArrowColorBg: darkTurquoise,
  backArrowColor: darkTurquoise,
  mainArrowColor: white,
  dropdownArrowColor: darkTurquoise,
  closeIconColor: veryLightGray,
  electionStatusActiveColor: lightOliveGreen,
  electionStatusDraftColor: fadedOrange,
  electionStatusClosedColor: lightDarkWhite,
  linkExternalColor: blueish,
  linkInternalColor: darkTurquoise,
  plusIconFillColor: white,
  plusIconBackgroundColor: darkTurquoise,
  tableHeaderBg: lightTurquoise,
  tableHeaderTextColor: darkGreyishBrown,
  tableHeaderFontSize: '1.8rem',
  tableInfoHeaderBg: mediumWhite,
  tableRowMainTextColor: greyishBrown,
  tableHorizontalPadding: '3rem',
  actionTextColor: blueish,
  tableCandidateBottomBorderColor: darkWhite,
  tableThickBorderColor: lightBlueGray,
  tableFilterBoxBorderColor: darkEggWhite,
  tableCellGreyBgColor: paleGrey,
  tableRowHoverColor: mediumWhite,
  tableRowDragColor: mediumWhite,
  tableInputBorderActive: darkTurquoise,
  tableInputBorderInactive: darkEggWhite,
  formErrorTextColor: darkRed,
  formFieldHeight: '4.5rem',
  formFieldLabelUnfocusedColor: greyishBrown,
  formFieldLabelFocusedColor: darkTurquoise,
  formFieldBorderColor: darkEggWhite,
  formFieldBorderErrorColor: lightRed,
  formFieldBorderActiveColor: darkTurquoise,
  formFieldBorder: '0.2rem solid',
  formFieldBorderRadius: '0.3rem',
  formFieldTextColor: greyishBrown,
  formFieldFontSize: '1.6rem',
  formFieldLineHeight: '2.7rem',
  formFieldHorizontalPadding: '1.3rem',
  formFieldFocusTransition: '350ms ease-out',
  formFieldLargeWidth: '32.5rem',
  dropDownWidth: '22.3rem',
  dropDownTextColor: greyishBrown,
  dropDownBorderColor: darkEggWhite,
  dropDownBorderColorActive: darkTurquoise,
  dropDownListItemBorderColor: darkWhite,
}

export default theme;