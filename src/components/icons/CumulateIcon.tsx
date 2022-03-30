import { createUseStyles, useTheme } from 'react-jss';

interface StyleProps {
  large: boolean;
  disabled: boolean;
}

const useStyles = createUseStyles((theme: any) => ({
  star: {
    height: (props: StyleProps) => (props.large ? '22px' : '16px !important'),
  },
  stroke: {
    stroke: (props: StyleProps) =>
      props.disabled ? theme.colors.darkGray : theme.colors.darkTurquoise,
    fill: 'inherit',
  },
}));

interface CumulateIconProps {
  large: boolean;
  title: string;
  disabled?: boolean;
}

export default function CumulateIcon(props: CumulateIconProps) {
  const { title, disabled = false, large } = props;
  const theme = useTheme();
  const classes = useStyles({ theme, disabled, large });
  return (
    <svg className={classes.star} viewBox="0 0 21 22">
      <title>{title}</title>
      <g
        className={classes.stroke}
        transform="translate(1.000000, 1.000000)"
        strokeWidth="2"
        fill="none"
      >
        <path d="M18.9416641,7.51645348 C18.8036172,7.08224572 18.4386094,6.76383681 17.99775,6.69250593 L12.9765547,5.88191396 L10.5732031,0.694337816 C10.3766719,0.270298503 9.95882031,0 9.5,0 C9.04103125,0 8.62317969,0.270298503 8.42664844,0.694337816 L6.02329688,5.88191396 L1.00225,6.69250593 C0.560945312,6.76383681 0.196234375,7.08224572 0.0581875,7.51645348 C0.019,7.63968895 0,7.76626332 0,7.89192708 C0,8.20897008 0.121421875,8.51903175 0.347789063,8.75047769 L4.05471875,12.5405757 L2.99160937,17.9740157 C2.9010625,18.43797 3.08215625,18.9137621 3.45607031,19.1928631 C3.66358594,19.3476663 3.90939844,19.4262821 4.15654687,19.4262821 C4.35426563,19.4262821 4.55272656,19.3757434 4.73278125,19.2734518 L9.5,16.565762 L14.2670703,19.2734518 C14.447125,19.3757434 14.6457344,19.4262821 14.84375,19.4262821 C15.0904531,19.4262821 15.3362656,19.3476663 15.5437812,19.1928631 C15.9175469,18.9137621 16.0989375,18.43797 16.0080938,17.9740157 L14.9451328,12.5405757 L18.6520625,8.75047769 C18.8784297,8.51903175 19,8.20897008 19,7.89192708 C19,7.76626332 18.9808516,7.63968895 18.9416641,7.51645348" />
      </g>
    </svg>
  );
}
