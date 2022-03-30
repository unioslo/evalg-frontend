import { createUseStyles, useTheme } from 'react-jss';

interface DnDIconProps {
  large: boolean;
  title: string;
}

const useStyles = createUseStyles((theme: any) => ({
  addCircle: {
    height: (props: DnDIconProps) => (props.large ? '20px' : '10px'),
    width: (props: DnDIconProps) => (props.large ? '20px' : '10px'),
    '& circle': {
      stroke: theme.colors.lightTurquoise,
    },
    '& rect': {
      fill: '#d8d8d8',
    },
    '&:hover': {
      cursor: 'pointer',
    },
  },

  remove: {
    height: (props: DnDIconProps) => (props.large ? '22px' : '14px'),
  },
  removeStroke: {
    fill: 'inherit',
    stroke: theme.colors.darkTurquoise,
  },
}));

export default function DnDIcon(props: DnDIconProps) {
  const { title } = props;
  const theme = useTheme();
  const classes = useStyles({ theme, ...props });

  return (
    <svg className={classes.addCircle} viewBox="0 0 5 21">
      <title>{title}</title>
      <g stroke="none" strokeWidth="1" fill="none">
        <rect x="0" y="0" width="5" height="5" />
        <rect x="0" y="8" height="5" width="5" />
        <rect x="0" y="16" height="5" width="5" />
      </g>
    </svg>
  );
}
