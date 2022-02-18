import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  animatedCheckmarkSvg: {
    position: 'relative',
    marginLeft: '13px',

    '& .checkmarkPath': {
      strokeWidth: 5,
      stroke: 'white',
      strokeMiterlimit: 10,
      strokeDasharray: 48,
      strokeDashoffset: 48,
      animation: 'stroke .4s cubic-bezier(0.650, 0.000, 0.450, 1.000) forwards',
    },
  },
  '@keyframes stroke': {
    '100%': {
      strokeDashoffset: 0,
    },
  },
});

export default function AnimatedCheckmark() {
  const classes = useStyles();
  return (
    <svg
      className={classes.animatedCheckmarkSvg}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="12 12 30 30"
      width="26"
      height="26"
    >
      <path
        className="checkmarkPath"
        fill="none"
        d="M14.1 27.2l7.1 7.2 16.7-16.8"
      />
    </svg>
  );
}
