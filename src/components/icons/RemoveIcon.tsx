import { createUseStyles, useTheme } from 'react-jss';

interface RemoveIconProps {
  color: 'teal' | 'white';
  large: boolean;
  title: string;
}

const useStyles = createUseStyles((theme: any) => ({
  remove: {
    height: (props: RemoveIconProps) => (props.large ? '22px' : '14px'),
  },
  removeStroke: {
    fill: 'inherit',
    stroke: (props: RemoveIconProps) =>
      props.color === 'teal'
        ? theme.colors.darkTurquoise
        : theme.colors.whiteGray,
  },
}));

export default function RemoveIcon(props: RemoveIconProps) {
  const { title } = props;
  const theme = useTheme();
  const classes = useStyles({ theme, ...props });

  return (
    <svg className={classes.remove} viewBox="0 0 12 12">
      {title !== undefined && <title>{title}</title>}
      <g className={classes.removeStroke} strokeWidth="1" fill="none">
        <path d="M8.56910219,6 L11.1742662,8.60516397 C11.6206374,9.05153521 11.6253777,9.77104099 11.1784699,10.2179488 L10.2179488,11.1784699 C9.7716987,11.62472 9.05549904,11.6246012 8.60516397,11.1742662 L6,8.56910219 L3.39483603,11.1742662 C2.94846479,11.6206374 2.22895901,11.6253777 1.78205121,11.1784699 L0.821530097,10.2179488 C0.375280002,9.7716987 0.375398769,9.05549904 0.825733841,8.60516397 L3.43089781,6 L0.825733841,3.39483603 C0.379362596,2.94846479 0.374622298,2.22895901 0.821530098,1.78205121 L1.78205121,0.821530098 C2.2283013,0.375280002 2.94450096,0.375398769 3.39483603,0.825733841 L6,3.43089781 L8.60516397,0.825733841 C9.05153521,0.379362596 9.77104099,0.374622298 10.2179488,0.821530098 L11.1784699,1.78205121 C11.62472,2.2283013 11.6246012,2.94450096 11.1742662,3.39483603 L8.56910219,6 Z" />
      </g>
    </svg>
  );
}
