import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import AuthService from "../../Services/auth.service";
import { login } from "../../Store/auth.store";
import { useNavigate } from "react-router-dom";

const GoogleAuth = () => {
  const dispatch = useDispatch();
    const navigate = useNavigate();
    
  const handleSuccess = async (credentialResponse) => {
    try {
      const { credential } = credentialResponse;

      const response = await AuthService.googleLogin({ token: credential });
        console.log("Response from Google Login API:", response);
        
      if (response) {
        const { user, accessToken, refreshToken } = response.data;
        dispatch(login({ user, accessToken, refreshToken }));
      }
      navigate('/dashboard')
    } catch (error) {
      console.error("Google Login Error:", error.message);
    }
  };

  const handleError = () => {
    console.error("Google Login Failed");
  };

  return (
    <div className="rounded-full">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={handleError}
        useOneTap 
      />
    </div>
  );
};

export default GoogleAuth;
