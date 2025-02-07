import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = () => {
   const { isAuthenticated, checkAuthStatus } = useAuth();
   const [loading, setLoading] = useState(true);  

   useEffect(() => {
      const checkAuthentication = async () => {
         await checkAuthStatus();
         setLoading(false);
      };
      checkAuthentication();
   }, [checkAuthStatus]);  

   if (loading) {
      return <div>Loading...</div>;
   }

   return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
