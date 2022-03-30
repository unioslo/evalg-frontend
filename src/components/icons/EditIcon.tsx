import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  edit: {
    height: ({ large }: { large: boolean }) => (large ? '36px' : '26px'),
    width: ({ large }: { large: boolean }) => (large ? '36px' : '26px'),
    '& path': {
      stroke: '#196f7e',
      fill: '#196f7e',
      strokeWidth: '8',
    },
    '&:hover': {
      cursor: 'pointer',
    },
  },
});

interface AddIconProps {
  large?: boolean;
  title: string;
}

export default function EditIcon(props: AddIconProps) {
  const { title, large = true } = props;
  const classes = useStyles({ large });

  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      viewBox="0 0 306.637 306.637"
      className={classes.edit}
      //style="enable-background:new 0 0 306.637 306.637;"
      //xml:space="preserve"
    >
      {title !== undefined && <title>{title}</title>}
      <g>
        <path
          d="M12.809,238.52L0,306.637l68.118-12.809l184.277-184.277l-55.309-55.309L12.809,238.52z M60.79,279.943l-41.992,7.896
                        l7.896-41.992L197.086,75.455l34.096,34.096L60.79,279.943z"
        />
        <path
          d="M251.329,0l-41.507,41.507l55.308,55.308l41.507-41.507L251.329,0z M231.035,41.507l20.294-20.294l34.095,34.095
                        L265.13,75.602L231.035,41.507z"
        />
      </g>
    </svg>
  );
}
