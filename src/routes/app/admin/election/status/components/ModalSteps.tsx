import React from 'react';
import classNames from 'classnames';
import { createUseStyles, useTheme } from 'react-jss';

const useStyles = createUseStyles((theme: any) => ({
  steps: {
    margin: '6rem 2rem 4rem 2rem',
    width: (props: IProps) => (props.width ? props.width : 'auto'),
  },

  stepRow: {
    display: 'flex',
    alignItems: 'center',
    '&:not(:last-child)': {
      marginBottom: '3.5rem',
    },
  },

  stepNumber: {
    width: '5.5rem',
    height: '5.5rem',
    flexShrink: 0,
    marginRight: '6rem',
    fontSize: '4rem',
    fontWeight: 'bold',
    color: theme.colors.lightGray,
    textAlign: 'center',
    border: '2px solid',
    borderRadius: '50%',
    paddingTop: '3px',
    '&.active': {
      color: theme.colors.darkTurquoise,
    },
  },
}));

interface IProps {
  stepsContent: React.ReactNode[];
  stepsActiveStatus: boolean[];
  width?: string;
}

const ModalSteps: React.FunctionComponent<IProps> = ({
  stepsContent,
  stepsActiveStatus,
}) => {
  const theme = useTheme();
  const classes = useStyles({ theme });
  return (
    <div className={classes.steps}>
      {stepsContent.map((stepContent, index) => (
        <div className={classes.stepRow} key={index}>
          <div
            className={classNames({
              [classes.stepNumber]: true,
              active: stepsActiveStatus[index],
            })}
          >
            {index + 1}
          </div>
          <div>{stepContent}</div>
        </div>
      ))}
    </div>
  );
};

export default ModalSteps;
