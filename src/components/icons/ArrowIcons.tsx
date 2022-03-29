import { createUseStyles } from 'react-jss';

interface StyleProps {
  disabled: boolean;
}

const useStyles = createUseStyles({
  stroke: {
    stroke: (props: StyleProps) => (props.disabled ? 'white' : '#2194a8'),
    fill: (props: StyleProps) => (props.disabled ? 'white' : '#2194a8'),
  },
});

interface ArrowIconProps {
  title: string;
  disabled?: boolean;
}

export function DownArrowIcon(props: ArrowIconProps) {
  const { title, disabled = false } = props;
  const classes = useStyles({ disabled });
  return (
    <svg height="25px" viewBox="0 0 11 17">
      <title>{title}</title>
      <g stroke="none" strokeWidth="1" fill="none">
        <g className={classes.stroke}>
          <polygon
            transform="translate(5.499927, 8.204959) rotate(180.000000) translate(-5.499927, -8.204959)"
            points="0 5.49956341 0.851348133 6.35091154 4.59000344 3.77139947 4.59000344 16.4099172 6.40912338 16.4099172 6.40912338 3.77139947 10.1477787 6.35091154 10.9998545 5.49956341 5.49956341 6.82121026e-13"
          />
        </g>
      </g>
    </svg>
  );
}

export function UpArrowIcon(props: ArrowIconProps) {
  const { title, disabled = false } = props;
  const classes = useStyles({ disabled });
  return (
    <svg height="25px" viewBox="0 0 11 17">
      <title>{title}</title>
      <g stroke="none" strokeWidth="1" fill="none">
        <g className={classes.stroke}>
          <polygon points="0 5.49956341 0.851348133 6.35091154 4.59000344 3.77139947 4.59000344 16.4099172 6.40912338 16.4099172 6.40912338 3.77139947 10.1477787 6.35091154 10.9998545 5.49956341 5.49956341 -2.27373675e-13" />
        </g>
      </g>
    </svg>
  );
}
