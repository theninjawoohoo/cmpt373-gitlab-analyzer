import React from 'react';
import { useRepositoryContext } from '../../contexts/RepositoryContext';

interface UserNameProps {
  username: string;
}

import { Switch, Route } from 'react-router-dom';
import Routes from './routes';
import NavigationBar from './drawer';

const NavBar: React.FC<UserNameProps> = (UserNameProps) => {
  const { repositoryId } = useRepositoryContext();
  return (
    <div>
      <NavigationBar username={UserNameProps.username} repoId={repositoryId} />
      <Switch>
        {Routes.map((route: any) => (
          <Route exact path={route.path} key={route.path} />
        ))}
      </Switch>
    </div>
  );
};

export default NavBar;
