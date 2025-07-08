import { createContext, useState, useEffect, useContext } from "react";
import {jwtDecode} from "jwt-decode";
import axios from 'axios';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const[name, setName] = useState("");
  const[email, setEmail] = useState("");

  const fetchUsername = async ()=>{
    try{
      const decodedToken = jwtDecode(token);
      const useremail=decodedToken.email
      setEmail(useremail);
      const res= await axios .get(`http://localhost:8000/username/${useremail}`);
       setName( res.data.name );
    }catch(error){
      if(error.response && error.response.status === 404) {
        console.error("User not found");
      }
  }}

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      fetchUsername();

    } else {
      localStorage.removeItem("token");
      setName("");
      setEmail("");
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, setToken, name, email, fetchUsername }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

  
