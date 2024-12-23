import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AuthService from '@/Services/auth.service';
import { logout } from '@/Store/auth.store';

function LogoutBtn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accessToken = useSelector((state) => state.auth.accessToken);

  const handleLogout = async () => {
    try {
      if (!accessToken) {
        throw new Error("Access token is not available.");
      }
      // Call the logout API service
      await AuthService.logout(accessToken);

      // Clear the local storage tokens
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      // Dispatch the logout action
      dispatch(logout());

      // Redirect to the homepage or login page
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div>
      <button 
        onClick={handleLogout} 
        className="text-xl bg-red-600 w-11/12 h-10 rounded-xl font-medium text-white">
        Logout
      </button>
    </div>
  );
}

export default LogoutBtn;
