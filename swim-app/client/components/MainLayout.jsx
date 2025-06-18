import React, { useContext } from 'react';
import { Outlet, useParams, useLocation } from 'react-router-dom';
import { userContext } from './App';
import NavBar from './NavBar';
import NotFound from './NotFound';

export default function MainLayout() {
  const { username } = useParams();
  const { userData } = useContext(userContext);
  const location = useLocation();
  const isProtectedRoute = username && location.pathname.includes(username);
  
  if (isProtectedRoute && (!userData || username !== userData.username)) {
    return (
      <>
        <NavBar />
        <main>
          <NotFound />
        </main>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <main>
        <Outlet />
      </main>
    </>
  );
}
