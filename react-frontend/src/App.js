import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Navigate,
  Routes
} from 'react-router-dom';

import Users from './user/pages/Users';
import NewPlace from './places/pages/NewPlace';
import UserPlaces from './places/pages/UserPlaces';
import UpdatePlace from './places/pages/UpdatePlace';
import Auth from './user/pages/Auth';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hook';

const App = () => {
  const { token, login, logout, userId } = useAuth();

  let routes;

  if (token) {
    routes = (
      <Routes>
        <Route path="/" exact={true.toString()} element={<Users />} />
        <Route path="/:userId/places" exact={true.toString()} element={<UserPlaces />} />
        <Route path="/places/new" exact={true.toString()} element={<NewPlace />}/>
        <Route path="/places/:placeId" element={<UpdatePlace />}/>
        {/* <Navigate to="/" /> */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    );
  } else {
    routes = ( 
      <Routes>
        <Route path="/" exact={true.toString()} element={<Users />}/>
        <Route path="/:userId/places" exact={true.toString()} element={<UserPlaces />}/>
        <Route path="/auth" element={<Auth />}/>
        {/* <Navigate to="/auth" /> */}
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout
      }}
    >
      <Router>
        <MainNavigation />
        <main>{routes}</main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
