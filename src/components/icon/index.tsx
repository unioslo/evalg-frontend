import React from 'react';
import classNames from 'classnames';
import withStyles, { WithStylesProps } from 'react-jss';
import { Classes } from 'jss';

const getIcon = (
  type: string,
  classes: Classes,
  custom: any,
  title?: string
) => {
  switch (type) {
    case 'forwardArrow':
      return (
        <svg className={classes.forwardArrow}>
          <circle
            className={classes.forwardArrowCircle}
            cx="11"
            cy="11"
            r="11"
          />
          <polygon
            className={classes.forwardArrowArrow}
            transform="translate(-8)"
            points="17.6760676 5.09854426 20.9421535 9.93681365
                           12.0693359 9.93681365 12.0693359 12.2741419
                           20.9421535 12.2741419 17.6760676 17.1124113
                           18.7495364 18.2109555 25.6928239 11.1054778
                           18.7495364 4"
          />
        </svg>
      );
    case 'backArrow':
      return (
        <svg className={classes.backArrow}>
          <polygon
            transform="rotate(90.000000)"
            points="5.0578756 -16.502214 5.0578756 -3.409636 1.1841487
                           -6.081821 0.3022144 -5.199887 5.9986055 0.497258
                           6.0001131 0.497258 11.697258 -5.199887 10.8145699
                           -6.081821 6.9415968 -3.409636 6.9415968 -16.502214"
          />
        </svg>
      );
    case 'mainArrow':
      return (
        <svg className={classes.mainArrow}>
          <polygon
            points="8.0 0.0 6.59 1.41 12.17 7.0 0.0 7.0 0.0 9.0 12.17
                           9.0 6.59 14.59 8.0 16.0 16.0 8.0"
          />
        </svg>
      );
    case 'downArrow':
      return (
        <svg height="25px" viewBox="0 0 11 17">
          {title !== undefined && <title>{title}</title>}
          <g stroke="none" strokeWidth="1" fill="none">
            <g className={classes[custom]}>
              <polygon
                transform="translate(5.499927, 8.204959) rotate(180.000000) translate(-5.499927, -8.204959)"
                points="0 5.49956341 0.851348133 6.35091154 4.59000344 3.77139947 4.59000344 16.4099172 6.40912338 16.4099172 6.40912338 3.77139947 10.1477787 6.35091154 10.9998545 5.49956341 5.49956341 6.82121026e-13"
              />
            </g>
          </g>
        </svg>
      );

    case 'upArrow':
      return (
        <svg height="25px" viewBox="0 0 11 17">
          {title !== undefined && <title>{title}</title>}
          <g stroke="none" strokeWidth="1" fill="none">
            <g className={classes[custom]}>
              <polygon points="0 5.49956341 0.851348133 6.35091154 4.59000344 3.77139947 4.59000344 16.4099172 6.40912338 16.4099172 6.40912338 3.77139947 10.1477787 6.35091154 10.9998545 5.49956341 5.49956341 -2.27373675e-13" />
            </g>
          </g>
        </svg>
      );
    case 'downArrowSmall':
      return (
        <svg className={classes.arrowSmall} viewBox="0 0 14 9">
          {title !== undefined && <title>{title}</title>}
          <polygon
            className={classes.arrowSmallPolygon}
            points="11.584641 0.0 6.717411 4.79573
                             1.923157 0.0 0.0 1.92242 6.717411
                             8.63983 13.507061 1.92316"
          />
        </svg>
      );
    case 'upArrowSmall':
      return (
        <svg className={classes.arrowSmall} viewBox="0 0 14 9">
          {title !== undefined && <title>{title}</title>}
          <polygon
            className={classes.arrowSmallPolygon}
            transform="rotate(180) translate(-14 -9)"
            points="11.584641 0.0 6.717411 4.79573
                             1.923157 0.0 0.0 1.92242 6.717411
                             8.63983 13.507061 1.92316"
          />
        </svg>
      );
    case 'plussign':
      return (
        <svg width="20px" height="20px" viewBox="0 0 20 20">
          <g
            transform="translate(-0, -18.000000)"
            className={classes.plusSignBg}
          >
            <rect
              id="Rectangle-2"
              x="3"
              y="21"
              width="14"
              height="14"
              className={classes.plusSignIcon}
            />
            <path
              d="M11.3279728,29.1291562 L16.3279728,29.1291562
                   L16.3279728,26.6291562 L11.3279728,26.6291562
                   L11.3279728,21.6291562 L8.82797284,21.6291562
                   L8.82797284,26.6291562 L3.82797284,26.6291562
                   L3.82797284,29.1291562 L8.82797284,29.1291562
                   L8.82797284,34.1291562 L11.3279728,34.1291562
                   L11.3279728,29.1291562 Z M10,38 C4.4771525,38
                   0,33.5228475 0,28 C0,22.4771525 4.4771525,18
                   10,18 C15.5228475,18 20,22.4771525 20,28
                   C20,33.5228475 15.5228475,38 10,38 Z"
            />
          </g>
        </svg>
      );
    case 'addCircle':
      const addCircleCls = classNames({
        [classes.addCircle]: true,
        [classes.smallCircle]: custom,
      });
      return (
        <svg className={addCircleCls} viewBox="0 0 46 46">
          {title !== undefined && <title>{title}</title>}
          <g stroke="none" strokeWidth="1" fill="none">
            <circle strokeWidth="2" cx="23" cy="23" r="20" />
            <rect
              x="20.538743"
              y="9.5649828"
              width="5.25"
              height="26.0562731"
            />
            <rect x="10.14" y="19.9749828" height="5.25" width="26.0562731" />
          </g>
        </svg>
      );
    case 'radioButtonCircle':
      const radioButtonCircleCls = classNames({
        [classes.radioButtonCircle]: true,
        [classes.radioButtonCircleSmall]: custom.small,
      });
      return (
        <svg className={radioButtonCircleCls} viewBox="0 0 46 46">
          {title !== undefined && <title>{title}</title>}
          <g stroke="none" strokeWidth="1" fill="none">
            <circle strokeWidth="3" cx="23" cy="23" r="20" />
          </g>
        </svg>
      );
    case 'radioButtonCircleSelected':
      const radioButtonCircleSelectedCls = classNames({
        [classes.radioButtonCircle]: true,
        [classes.radioButtonCircleSelected]: true,
        [classes.radioButtonCircleSmall]: custom.small,
      });
      return (
        <svg className={radioButtonCircleSelectedCls} viewBox="0 0 46 46">
          {title !== undefined && <title>{title}</title>}
          <g stroke="none" strokeWidth="1" fill="none">
            <circle strokeWidth="3" cx="23" cy="23" r="20" />
          </g>
          <path
            className="checkMarkPath"
            fill="#FFF"
            fillRule="evenodd"
            d="M0 8.287l6.993 7.627L19.43 3.27 16.207 0l-9.23 9.36-3.486-3.882z"
          />
        </svg>
      );
    case 'clipboard':
      return (
        <svg viewBox="0 0 1000 1000" className={classes.clipBoard}>
          <g>
            <path d="M307.2,301.3c19.8,0,35.8,16,35.8,35.8c0,19.8-16,35.8-35.8,35.8c-19.8,0-35.8-16-35.8-35.8C271.4,317.4,287.4,301.3,307.2,301.3z" />
            <rect x="387.2" y="306.8" width="348.2" height="60.6" />
            <path d="M307.2,442.8c19.8,0,35.8,16,35.8,35.8c0,19.8-16,35.8-35.8,35.8c-19.8,0-35.8-16-35.8-35.8C271.4,458.8,287.4,442.8,307.2,442.8z" />
            <rect x="387.2" y="448.2" width="348.2" height="60.6" />
            <path d="M307.2,599.4c19.8,0,35.8,16,35.8,35.8s-16,35.8-35.8,35.8c-19.8,0-35.8-16-35.8-35.8C271.4,615.4,287.4,599.4,307.2,599.4z" />
            <rect x="387.2" y="604.8" width="348.2" height="60.6" />
            <path d="M307.2,740.8c19.8,0,35.8,16,35.8,35.8c0,19.7-16,35.8-35.8,35.8c-19.8,0-35.8-16-35.8-35.8C271.4,756.8,287.4,740.8,307.2,740.8z" />
            <rect x="387.2" y="746.3" width="348.2" height="60.6" />
            <path d="M842.3,88.3H689v-48c0,0-114.5-30.3-190.9-30.3c-76.4,0-190.9,30.3-190.9,30.3v48H157.7c-22.3,0-40.4,18.1-40.4,40.4v820.9c0,22.3,18.1,40.4,40.4,40.4h684.5c22.3,0,40.4-18.1,40.4-40.4V128.7C882.7,106.4,864.5,88.3,842.3,88.3z M500,45c20.6,0,37.2,16.7,37.2,37.2c0,20.5-16.7,37.2-37.2,37.2c-20.6,0-37.3-16.7-37.3-37.2C462.8,61.6,479.4,45,500,45z M801.8,909.2H198.2V169.1h109v27.8H689v-27.8h112.8L801.8,909.2L801.8,909.2z" />
          </g>
        </svg>
      );
    case 'rankCircle':
      const rankCircle = classNames({
        [classes.rankCircle]: true,
        [classes.smallCircle]: custom.small,
      });
      return (
        <svg className={rankCircle} viewBox="0 0 50 50">
          <g stroke="none" strokeWidth="1" fill="none">
            <circle className={classes.rankCircleFill} cx="25" cy="25" r="25" />
            <text
              x="50%"
              y="33px"
              fontSize="24"
              fontWeight="bold"
              fill="#FFF"
              textAnchor="middle"
            >
              {custom.nr}
            </text>
          </g>
        </svg>
      );
    case 'remove':
      const removeCls = classNames({
        [classes.remove]: !custom.small,
        [classes.removeSmall]: custom.small,
      });
      const removeStrokeCls = classNames({
        [classes.tealStroke]: custom.color === 'teal',
        [classes.whiteStroke]: custom.color === 'white',
      });
      return (
        <svg className={removeCls} viewBox="0 0 12 12">
          {title !== undefined && <title>{title}</title>}
          <g className={removeStrokeCls} strokeWidth="1" fill="none">
            <path d="M8.56910219,6 L11.1742662,8.60516397 C11.6206374,9.05153521 11.6253777,9.77104099 11.1784699,10.2179488 L10.2179488,11.1784699 C9.7716987,11.62472 9.05549904,11.6246012 8.60516397,11.1742662 L6,8.56910219 L3.39483603,11.1742662 C2.94846479,11.6206374 2.22895901,11.6253777 1.78205121,11.1784699 L0.821530097,10.2179488 C0.375280002,9.7716987 0.375398769,9.05549904 0.825733841,8.60516397 L3.43089781,6 L0.825733841,3.39483603 C0.379362596,2.94846479 0.374622298,2.22895901 0.821530098,1.78205121 L1.78205121,0.821530098 C2.2283013,0.375280002 2.94450096,0.375398769 3.39483603,0.825733841 L6,3.43089781 L8.60516397,0.825733841 C9.05153521,0.379362596 9.77104099,0.374622298 10.2179488,0.821530098 L11.1784699,1.78205121 C11.62472,2.2283013 11.6246012,2.94450096 11.1742662,3.39483603 L8.56910219,6 Z" />
          </g>
        </svg>
      );
    case 'save':
      return (
        <svg viewBox="0 0 96 96" className={classes.save}>
          <g>
            <path
              d="M19.4,18v60h57.1V31.4L65.3,18h-6.9v22.9H28V18H19.4z
                     M42.3,20.9v14.3h11.4V20.9H42.3z M28,50.4
                     h40v21.9H28V50.4z M33.7,55.1V58h28.6v-2.9H33.7z
                     M33.7,63.7v2.9h28.6v-2.9H33.7z"
            />
          </g>
        </svg>
      );

    case 'star': {
      const starCls = classNames({
        [classes.star]: !custom.small,
        [classes.starSmall]: custom.small,
      });
      const starStrokeCls = classNames({
        [classes.tealStroke]: custom.color === 'teal',
        [classes.whiteStroke]: custom.color === 'white',
      });
      return (
        <svg className={starCls} viewBox="0 0 21 22">
          <g
            className={starStrokeCls}
            transform="translate(1.000000, 1.000000)"
            strokeWidth="2"
            fill="none"
          >
            <path d="M18.9416641,7.51645348 C18.8036172,7.08224572 18.4386094,6.76383681 17.99775,6.69250593 L12.9765547,5.88191396 L10.5732031,0.694337816 C10.3766719,0.270298503 9.95882031,0 9.5,0 C9.04103125,0 8.62317969,0.270298503 8.42664844,0.694337816 L6.02329688,5.88191396 L1.00225,6.69250593 C0.560945312,6.76383681 0.196234375,7.08224572 0.0581875,7.51645348 C0.019,7.63968895 0,7.76626332 0,7.89192708 C0,8.20897008 0.121421875,8.51903175 0.347789063,8.75047769 L4.05471875,12.5405757 L2.99160937,17.9740157 C2.9010625,18.43797 3.08215625,18.9137621 3.45607031,19.1928631 C3.66358594,19.3476663 3.90939844,19.4262821 4.15654687,19.4262821 C4.35426563,19.4262821 4.55272656,19.3757434 4.73278125,19.2734518 L9.5,16.565762 L14.2670703,19.2734518 C14.447125,19.3757434 14.6457344,19.4262821 14.84375,19.4262821 C15.0904531,19.4262821 15.3362656,19.3476663 15.5437812,19.1928631 C15.9175469,18.9137621 16.0989375,18.43797 16.0080938,17.9740157 L14.9451328,12.5405757 L18.6520625,8.75047769 C18.8784297,8.51903175 19,8.20897008 19,7.89192708 C19,7.76626332 18.9808516,7.63968895 18.9416641,7.51645348" />
          </g>
        </svg>
      );
    }
    case 'help':
      const helpCls = classNames({
        [classes.help]: !custom,
        [classes.helpSmall]: custom,
      });
      return (
        <svg className={helpCls} viewBox="0 0 28 28">
          <circle
            stroke="#2294A8"
            strokeWidth="3"
            fill="#FFFFFF"
            cx="14"
            cy="14"
            r="12.5"
          />
          <text fontSize="20" fontWeight="bold" fill="#2294A8">
            <tspan x="8" y="21">
              ?
            </tspan>
          </text>
        </svg>
      );
    case 'externalLink':
      return (
        <svg width="17" height="14" viewBox="0 0 17 14">
          <g fill="#0F748D" fillRule="evenodd">
            <path d="M13.044 8.157h-.607a.3.3 0 0 0-.218.082.276.276 0 0 0-.085.208v2.907c0 .4-.148.742-.445 1.027a1.493 1.493 0 0 1-1.072.427H2.73c-.417 0-.774-.143-1.071-.427a1.371 1.371 0 0 1-.446-1.027V3.796c0-.4.149-.742.446-1.026a1.493 1.493 0 0 1 1.071-.427h6.674a.302.302 0 0 0 .218-.082.277.277 0 0 0 .085-.209v-.581a.277.277 0 0 0-.085-.21.302.302 0 0 0-.218-.08H2.73c-.752 0-1.395.255-1.93.767-.533.511-.8 1.128-.8 1.848v7.558c0 .721.267 1.337.801 1.849a2.689 2.689 0 0 0 1.93.768h7.886c.752 0 1.395-.256 1.93-.768.534-.512.8-1.128.8-1.849V8.448a.276.276 0 0 0-.085-.21.302.302 0 0 0-.218-.081z" />
            <path d="M16.807.19a.596.596 0 0 0-.426-.173h-4.854a.596.596 0 0 0-.426.173.548.548 0 0 0-.18.409c0 .157.06.294.18.409l1.668 1.598-6.18 5.923a.281.281 0 0 0-.095.21c0 .078.031.148.094.208L7.67 9.983a.306.306 0 0 0 .436 0l6.18-5.923 1.67 1.599c.12.115.262.172.426.172a.596.596 0 0 0 .426-.172.547.547 0 0 0 .18-.409V.599a.548.548 0 0 0-.18-.409z" />
          </g>
        </svg>
      );
    case 'closeMsgBox':
      return (
        <svg
          className={classes.closeMsgBox}
          xmlns="http://www.w3.org/2000/svg"
          width="26"
          height="26"
          viewBox="0 0 26 26"
        >
          <path
            fill="#2294A8"
            fillRule="evenodd"
            d="M12.853 14.85l4.42 4.419 2.21-2.21-4.42-4.42
              4.42-4.419-2.21-2.21-4.42 4.42-4.419-4.42-2.21 2.21
              4.42 4.42-4.42 4.42 2.21 2.209 4.42-4.42zM3.84
              21.516c-4.882-4.882-4.882-12.797 0-17.678 4.881-4.882
              12.796-4.882 17.678 0 4.881 4.881 4.881 12.796 0 17.678-4.882
              4.881-12.797 4.881-17.678 0z"
          />
        </svg>
      );
    case 'infoMsgBox':
      return (
        <svg
          className={classes.infoMsgBox}
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="20"
          viewBox="0 0 22 20"
        >
          <path
            fill="#2194A8"
            fillRule="evenodd"
            d="M11.271 20c5.72 0 10.364-4.48 10.364-10S16.992 0 11.27 0C5.551
              0 .908 4.48.908 10s4.643 10 10.363 10zM10.235
              5h2.073v2h-2.073V5zm2.073 4v6h-2.073V9h2.073z"
          />
        </svg>
      );
    case 'checkMark':
      return (
        <svg
          className={classes.checkMark}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
        </svg>
      );
    case 'xMark':
      return (
        <svg
          className={classes.xMark}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z" />
        </svg>
      );
    case 'download':
      return (
        <svg
          className={classes.download}
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          viewBox="0 0 30 30"
        >
          <path d="M11 8h6v6h4l-7 7-7 -7h4zm-6 12v6h18v-6h-3v3h-12v-3z" />
        </svg>
      );

    case 'errorMsg':
      return (
        <svg
          role="img"
          focusable="false"
          height="1.5em"
          width="1.5em"
          viewBox="0 0 24 24"
        >
          <g fill="none" fillRule="evenodd">
            <path
              d="M11.999 0C5.395 0 .013 5.372 0 11.976a11.923 11.923 0 0 0 3.498 8.493A11.925 11.925 0 0 0 11.977 24H12c6.603 0 11.986-5.373 12-11.978C24.013 5.406 18.64.012 11.999 0z"
              fillRule="nonzero"
              fill="#A13A28"
            />
            <path
              d="M12 10.651l3.372-3.372a.954.954 0 1 1 1.349 1.35L13.349 12l3.372 3.372a.954.954 0 1 1-1.35 1.349L12 13.349 8.628 16.72a.954.954 0 1 1-1.349-1.35L10.651 12 7.28 8.628A.954.954 0 1 1 8.63 7.28L12 10.651z"
              fill="#FFF"
              fillRule="nonzero"
            />
          </g>
        </svg>
      );
    default:
      if (process.env.NODE_ENV !== 'production') {
        console.error(`Icon not found: ${type}`);
      }
      return <span>Icon not found: {type}</span>;
  }
};

const styles = (theme: any) => ({
  addCircle: {
    height: '46px',
    width: '46px',
    '& circle': {
      stroke: theme.colors.lightTurquoise,
    },
    '& rect': {
      fill: '#196f7e',
    },
    '&:hover': {
      cursor: 'pointer',
    },
    // TODO: media queries does not work.
    // [`@media (hover: hover) and ${theme.breakpoints.mdQuery}`]: {
    //   // to avoid "sticky" hover effects on mobile
    //   '&:hover': {
    //     '& circle': {
    //       strokeWidth: '3px',
    //       stroke: theme.colors.darkTurquoise,
    //     },
    //     '& rect': {
    //       fill: theme.colors.darkTurquoise,
    //     },
    //   },
    // },
  },
  arrowSmall: {
    width: '14px',
    height: '9px',
  },
  arrowSmallPolygon: {
    fill: theme.dropDownArrowColor,
  },
  backArrow: {
    width: '17px',
    height: '12px',
    fill: theme.backArrowColor,
  },
  checkMark: {
    fill: 'green',
  },
  clipBoard: {
    height: '22px',
    width: '22px',
    fill: theme.colors.white,
    position: 'relative',
    top: '-3px',
  },
  closeMsgBox: {
    width: '26px',
    height: '26px',
  },
  forwardArrow: {
    width: '22px',
    height: '22px',
  },
  download: {
    fill: 'white',
  },

  errorMsg: {},
  forwardArrowCircle: {
    fill: theme.forwardArrowColorBg,
  },
  forwardArrowArrow: {
    fill: theme.forwardArrowColor,
  },
  gray: {
    fill: '#6EAEBB',
  },
  grayStroke: {
    stroke: '#6EAEBB',
  },
  help: {
    height: '28px',
    width: '28px',
  },
  helpSmall: {
    height: '20px',
    width: '20px',
  },
  iconContainer: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
  },
  infoMsgBox: {
    width: '22px',
    height: '20px',
  },
  mainArrow: {
    width: '16px',
    height: '16px',
    fill: theme.mainArrowColor,
  },
  marginRight: {
    marginRight: '0.8rem',
  },
  plusCircle: {
    stroke: theme.colors.lightTurquoise,
  },
  plusCircleIcon: {
    fill: theme.colors.white,
  },
  plusSignBg: {
    width: '20px',
    height: '20px',
    fill: theme.colors.white,
  },
  plusSignIcon: {
    fill: theme.colors.darkTurquoise,
  },
  radioButtonCircle: {
    height: '46px',
    width: '46px',
    '& circle': {
      stroke: theme.colors.lightTurquoise,
    },
    '&:hover': {
      cursor: 'pointer',
    },
    // [`@media (hover: hover) and ${theme.breakpoints.mdQuery}`]: {
    //   // to avoid "sticky" hover effects on mobile
    //   '&:hover': {
    //     '& circle': {
    //       strokeWidth: '5px',
    //       stroke: theme.colors.darkTurquoise,
    //     },
    //   },
    // },
    '& .checkMarkPath': {
      transform: 'translate(8px, 11px) scale(1.5)',
    },
  },
  radioButtonCircleSelected: {
    '& circle': {
      stroke: theme.colors.darkTurquoise,
      fill: theme.colors.darkTurquoise,
    },
  },
  radioButtonCircleSmall: {
    height: '32px',
    width: '32px',
  },
  rankCircle: {
    height: '42px',
    width: '42px',
  },
  rankCircleFill: {
    fill: theme.colors.darkTurquoise,
  },
  remove: {
    height: '25px',
  },
  removeSmall: {
    height: '14px',
  },
  save: {
    height: '31px',
    width: '31px',
    fill: theme.colors.white,
    position: 'relative',
    top: '-7px',
  },
  smallCircle: {
    height: '36px !important',
    width: '36px !important',
  },
  smallIcon: {
    height: '14px !important',
    width: '16px !important',
  },
  star: {
    height: '22px',
  },
  starSmall: {
    height: '16px !important',
  },
  teal: {
    fill: theme.colors.darkTurquoise,
  },
  tealStroke: {
    stroke: theme.colors.darkTurquoise,
  },
  white: {
    fill: theme.colors.whiteGray,
  },
  whiteStroke: {
    stroke: theme.colors.whiteGray,
  },
  xMark: {
    fill: 'red',
  },
});

interface IProps extends WithStylesProps<typeof styles> {
  type: string;
  marginRight?: boolean;
  onClick?: (event: React.MouseEvent<any, MouseEvent>) => void;
  custom?: any;
  elementType?: string;
  title?: string;
}

const Icon = (props: IProps) => {
  const { type, classes, custom, title, onClick, marginRight, elementType } =
    props;
  const icon = getIcon(type, classes, custom, title);
  const cls = classNames({
    'button-no-style': onClick,
    [classes.iconContainer]: true,
    [classes.marginRight]: marginRight,
  });
  const handleClick = (event: React.MouseEvent<any, MouseEvent>) => {
    event.preventDefault();
    if (props.onClick) {
      props.onClick(event);
    }
  };
  if (elementType === 'button' || (onClick && !elementType)) {
    return (
      <button type="button" className={cls} onClick={handleClick}>
        {icon}
      </button>
    );
  }
  return (
    <div className={cls} onClick={handleClick}>
      {icon}
    </div>
  );
};

export default withStyles(styles)(Icon);
