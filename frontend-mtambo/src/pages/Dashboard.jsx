import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthenticationContext';

const Dashboard = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <div>You are not logged in!</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.username}</h1>
      <p>Email: {user.email}</p>
      <button onClick={logout}>Log out</button>
    </div>
  );
};

export default Dashboard;
