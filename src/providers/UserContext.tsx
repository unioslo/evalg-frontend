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
  isFetchingUser: boolean;
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
    this.state = {
      context: {
        signOut: this.signOut,
        user: null,
        userManager: this.props.userManager,
      },
      isFetchingUser: true,
    };
  }

  public componentDidMount() {
    this.getUser();
  }

  public getUser = () => {
    this.state.context.userManager
      .getUser()
      .then(user => this.storeUser(user))
      .catch(() => this.setState({ isFetchingUser: false }));
  };

  public storeUser = (user: User | null) => {
    if (user) {
      this.setState(({ context }) => ({
        context: { ...context, user },
        isFetchingUser: false,
      }));
    } else {
      this.setState(({ context }) => ({
        context: { ...context, user: null },
        isFetchingUser: false,
      }));
    }
  };

  public signOut = async () => {
    await this.state.context.userManager.removeUser();
    this.getUser();
  };

  public isValid = () => {
    const { user } = this.state.context;
    return !!(user && !user.expired);
  };

  public render() {
    return (
      <UserContext.Provider value={this.state.context}>
        {this.props.children}
      </UserContext.Provider>
    );
  }
}

export { UserContext, UserContextProvider };
