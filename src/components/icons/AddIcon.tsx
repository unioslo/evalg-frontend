import { createUseStyles, useTheme } from 'react-jss';

interface AddIconProps {
  large: boolean;
  title: string;
}

const useStyles = createUseStyles((theme: any) => ({
  addCircle: {
    height: (props: AddIconProps) => (props.large ? '46px' : '36px'),
    width: (props: AddIconProps) => (props.large ? '46px' : '35px'),
    '& circle': {
      stroke: theme.colors.lightTurquoise,
    },
    '& rect': {
      fill: '#196f7e',
    },
    '&:hover': {
      cursor: 'pointer',
    },
  },

  remove: {
    height: (props: AddIconProps) => (props.large ? '22px' : '14px'),
  },
  removeStroke: {
    fill: 'inherit',
    stroke: theme.colors.darkTurquoise,
  },
}));

export default function AddIcon(props: AddIconProps) {
  const { title } = props;
  const theme = useTheme();
  const classes = useStyles({ theme, ...props });

  return (
    <svg className={classes.addCircle} viewBox="0 0 46 46">
      {title !== undefined && <title>{title}</title>}
      <g stroke="none" strokeWidth="1" fill="none">
        <circle strokeWidth="2" cx="23" cy="23" r="20" />
        <rect x="20.538743" y="9.5649828" width="5.25" height="26.0562731" />
        <rect x="10.14" y="19.9749828" height="5.25" width="26.0562731" />
      </g>
    </svg>
  );
}
