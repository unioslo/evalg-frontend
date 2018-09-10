/* @flow */
import * as React from 'react';
import classNames from 'classnames';
import injectSheet from 'react-jss';

const getIcon = (type: string, classes: Object) => {
  switch (type) {
    case 'forwardArrow':
      return (
        <svg className={classes.forwardArrow}>
          <circle className={classes.forwardArrowCircle} cx="11" cy="11" r="11" />
          <polygon className={classes.forwardArrowArrow} transform="translate(-8)"
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
          <polygon transform="rotate(90.000000)"
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
          <polygon points="8.0 0.0 6.59 1.41 12.17 7.0 0.0 7.0 0.0 9.0 12.17
                           9.0 6.59 14.59 8.0 16.0 16.0 8.0"
          />
        </svg>
      );
    case 'downArrow':
      return (
        <svg className={classes.dropDownArrow}
             viewBox="0 0 14 9">
          <polygon className={classes.dropDownArrowPolygon}
                   points="11.584641 0.0 6.717411 4.79573
                             1.923157 0.0 0.0 1.92242 6.717411
                             8.63983 13.507061 1.92316"/>
        </svg>
      );
    case 'upArrow':
      return (
        <svg className={classes.dropDownArrow}
             viewBox="0 0 14 9">
          <polygon className={classes.dropDownArrowPolygon}
                   transform="rotate(180) translate(-14 -9)"
                   points="11.584641 0.0 6.717411 4.79573
                             1.923157 0.0 0.0 1.92242 6.717411
                             8.63983 13.507061 1.92316"/>
        </svg>
      );
    case 'plussign':
      return (
        <svg width="20px" height="20px" viewBox="0 0 20 20">
          <g transform="translate(-0, -18.000000)"
             className={classes.plusSignBg}>
            <rect id="Rectangle-2" x="3" y="21" width="14"
                  height="14" className={classes.plusSignIcon} />
            <path d="M11.3279728,29.1291562 L16.3279728,29.1291562
                   L16.3279728,26.6291562 L11.3279728,26.6291562
                   L11.3279728,21.6291562 L8.82797284,21.6291562
                   L8.82797284,26.6291562 L3.82797284,26.6291562
                   L3.82797284,29.1291562 L8.82797284,29.1291562
                   L8.82797284,34.1291562 L11.3279728,34.1291562
                   L11.3279728,29.1291562 Z M10,38 C4.4771525,38
                   0,33.5228475 0,28 C0,22.4771525 4.4771525,18
                   10,18 C15.5228475,18 20,22.4771525 20,28
                   C20,33.5228475 15.5228475,38 10,38 Z" />
          </g>
        </svg>
      );
    case 'clipboard':
      return (
        <svg viewBox="0 0 1000 1000" className={classes.clipBoard}>
          <g>
            <path d="M307.2,301.3c19.8,0,35.8,16,35.8,35.8c0,19.8-16,35.8-35.8,35.8c-19.8,0-35.8-16-35.8-35.8C271.4,317.4,287.4,301.3,307.2,301.3z"/>
            <rect x="387.2" y="306.8" width="348.2" height="60.6"/>
            <path d="M307.2,442.8c19.8,0,35.8,16,35.8,35.8c0,19.8-16,35.8-35.8,35.8c-19.8,0-35.8-16-35.8-35.8C271.4,458.8,287.4,442.8,307.2,442.8z"/>
            <rect x="387.2" y="448.2" width="348.2" height="60.6"/>
            <path d="M307.2,599.4c19.8,0,35.8,16,35.8,35.8s-16,35.8-35.8,35.8c-19.8,0-35.8-16-35.8-35.8C271.4,615.4,287.4,599.4,307.2,599.4z"/>
            <rect x="387.2" y="604.8" width="348.2" height="60.6"/>
            <path d="M307.2,740.8c19.8,0,35.8,16,35.8,35.8c0,19.7-16,35.8-35.8,35.8c-19.8,0-35.8-16-35.8-35.8C271.4,756.8,287.4,740.8,307.2,740.8z"/>
            <rect x="387.2" y="746.3" width="348.2" height="60.6"/>
            <path d="M842.3,88.3H689v-48c0,0-114.5-30.3-190.9-30.3c-76.4,0-190.9,30.3-190.9,30.3v48H157.7c-22.3,0-40.4,18.1-40.4,40.4v820.9c0,22.3,18.1,40.4,40.4,40.4h684.5c22.3,0,40.4-18.1,40.4-40.4V128.7C882.7,106.4,864.5,88.3,842.3,88.3z M500,45c20.6,0,37.2,16.7,37.2,37.2c0,20.5-16.7,37.2-37.2,37.2c-20.6,0-37.3-16.7-37.3-37.2C462.8,61.6,479.4,45,500,45z M801.8,909.2H198.2V169.1h109v27.8H689v-27.8h112.8L801.8,909.2L801.8,909.2z"/>
          </g>
        </svg>
      );
    case 'save':
      return (
        <svg viewBox="0 0 96 96" className={classes.save}>
          <g>
            <path d="M19.4,18v60h57.1V31.4L65.3,18h-6.9v22.9H28V18H19.4z
                     M42.3,20.9v14.3h11.4V20.9H42.3z M28,50.4
                     h40v21.9H28V50.4z M33.7,55.1V58h28.6v-2.9H33.7z
                     M33.7,63.7v2.9h28.6v-2.9H33.7z" />
          </g>
        </svg>
      );
    default:
      if (process.NODE_ENV !== 'production') {
        console.error(`Icon not found: ${ type }`);
      }
      return (
        <span>Icon not found: { type }</span>
      )
  }
};

const styles = theme => ({
  iconcontainer: {
    display: 'inline-block'
  },
  marginRight: {
    marginRight: '0.8rem'
  },
  forwardArrow: {
    width: '22px',
    height: '22px',
  },
  forwardArrowCircle: {
    fill: theme.forwardArrowColorBg
  },
  forwardArrowArrow: {
    fill: theme.forwardArrowColor
  },
  backArrow: {
    width: '17px',
    height: '12px',
    fill: theme.backArrowColor
  },
  mainArrow: {
    width: '16px',
    height: '16px',
    fill: theme.mainArrowColor
  },
  dropDownArrow: {
    width: '14px',
    height: '9px',
  },
  dropDownArrowPolygon: {
    fill: theme.dropdownArrowColor,
  },
  plusSignBg: {
    width: '20px',
    height: '20px',
    fill: theme.colors.white,
  },
  plusSignIcon: {
    fill: theme.colors.darkTurquoise
  },
  clipBoard: {
    height: '22px',
    width: '22px',
    fill: theme.colors.white,
    position: 'relative',
    top: '-3px'
  },
  save: {
    height: '31px',
    width: '31px',
    fill: theme.colors.white,
    position: 'relative',
    top: '-7px',
  }
})

type Props = {
  type: string,
  marginRight?: boolean,
  classes: Object
}

const Icon = (props: Props) => {
  const { type, classes } = props;
  const icon = getIcon(type, classes);
  const cls = classNames({
    [classes.iconContainer]: true,
    [classes.marginRight]: props.marginRight
  });
  return (
    <div className={ classNames }>
      {icon}
    </div>
  )
};

export default injectSheet(styles)(Icon);
