import { createUseStyles, useTheme } from 'react-jss';

interface CheckMarkIconProps {
  large: boolean;
  title: string;
}

const useStyles = createUseStyles((theme: any) => ({
  addCircle: {
    height: (props: CheckMarkIconProps) => (props.large ? '46px' : '36px'),
    width: (props: CheckMarkIconProps) => (props.large ? '46px' : '35px'),
    '& circle': {
      stroke: theme.colors.darkTurquoise,
      fill: theme.colors.darkTurquoise,
    },
    '&:hover': {
      cursor: 'pointer',
    },
    '& .checkMarkPath': {
      transform: 'translate(8px, 11px) scale(1.5)',
      fill: '#ffffff',
    },
  },
  checkMark: {
    fill: 'green',
  },

  remove: {
    height: (props: CheckMarkIconProps) => (props.large ? '22px' : '14px'),
  },
  removeStroke: {
    fill: 'inherit',
    stroke: theme.colors.darkTurquoise,
  },
}));

export default function CheckMarkIcon(props: CheckMarkIconProps) {
  const { title } = props;
  const theme = useTheme();
  const classes = useStyles({ theme, ...props });

  return (
    <svg className={classes.addCircle} viewBox="0 0 46 46">
      {title !== undefined && <title>{title}</title>}
      <g stroke="none" strokeWidth="1" fill="none">
        <circle strokeWidth="3" cx="23" cy="23" r="20" />
        <path
          className="checkMarkPath"
          fillRule="evenodd"
          d="M0 8.287l6.993 7.627L19.43 3.27 16.207 0l-9.23 9.36-3.486-3.882z"
        />
      </g>
    </svg>
  );
}
