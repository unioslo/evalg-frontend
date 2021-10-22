import React from 'react';
import { User, UserManager } from 'oidc-client';

export interface IUserContext {
  signOut: () => Promise<any>;
  user: User | null;
  userManager: UserManager | null;
}

const DEFAULT: IUserContext = {
  signOut: () => Promise.resolve(0),
  user: null,
  userManager: null,
};

const UserContext = React.createContext<IUserContext>(DEFAULT);

interface IProviderState {
  context: {
    signOut: () => Promise<any>;
    user: User | null;
    userManager: UserManager;
  };
}

interface IProps {
  userManager: UserManager;
}

class UserContextProvider extends React.Component<IProps, IProviderState> {
  constructor(props: IProps) {
    super(props);
    const { userManager } = props;
    this.state = {
      context: {
        signOut: this.signOut,
        user: null,
        userManager,
      },
    };
  }

  public componentDidMount() {
    this.getUser();
  }

  public getUser = () => {
    const { context } = this.state;
    context.userManager.getUser().then((user) => this.storeUser(user));
  };

  public storeUser = (user: User | null) => {
    if (user) {
      this.setState(({ context }) => ({
        context: { ...context, user },
      }));
    } else {
      this.setState(({ context }) => ({
        context: { ...context, user: null },
      }));
    }
  };

  public signOut = async () => {
    const { context } = this.state;
    const { userManager } = context;
    const idTokenHint = context.user?.id_token;
    await userManager.removeUser();
    await this.getUser();
    await userManager.signoutRedirect({ id_token_hint: idTokenHint });
  };

  public isValid = () => {
    const { context } = this.state;
    const { user } = context;
    return !!(user && !user.expired);
  };

  public render() {
    const { context } = this.state;
    const { children } = this.props;
    return (
      <UserContext.Provider value={context}>{children}</UserContext.Provider>
    );
  }
}

export { UserContext, UserContextProvider };
