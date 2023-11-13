
import { createContext, useState } from "react";
import { useContext } from "react";
import { excuteJwtAuthentiationService } from "../api/Authentication";
import { apiClient } from "../api/ApiClient";

/* ==== CREATING AUTHCONTEXT ===============*/
export const AuthContext = createContext()

/* ====== SIMPLIFY THE USAGE OF AUTHENTICATION CONTEXT =========*/
export const useAuth = () => useContext(AuthContext); 

/* =========== RESPONSIBLE FOR MANAGING THE AUTHENTICATION STATE ======*/
export default function AuthProvider({children}){


//Putting some state in the context
    const [isAuthenticated, setAuthenticated] = useState(false) // making this sate to check if user is looged in or not
    const [username, setUserName] = useState(null) // for username
    const [token, setToken] = useState(null) // for token

    //for dicom files
    const [selectedFile, setSelectedFile] = useState([]);

    //login using Jwt token
    async function login(username,password){ // to verify the credintials, making this method as asyn because execution should be stopped till the excuteJwtAuthentiationService is excuted and returns the promis
       
        try{
            const response = await excuteJwtAuthentiationService(username,password) // callling backend to give us a jwt token back
            if(response.status===200){ // if the response if success
                const jwtToken = 'Bearer ' + response.data.token // std format of jwt token
                setAuthenticated(true); //useing context to set value of authenticated as true
                setUserName(username)
                setToken(jwtToken)

                apiClient.interceptors.request.use((config) => {
                    console.log('Intercepting and adding token');
                    config.headers.Authorization = jwtToken // passsig jwt token as Authoriaztion header for every backend api request
                    return config 
                })

                return true;
                
            }else{
                logout() 
                return false;
            }
        }catch(error){
            logout();
            return false;
        }
        
    }

/* ============= HANDLING LOGOUT ============== */
    function logout(){
        setAuthenticated(false);
        setUserName(null);
        setToken(null)
    }

    return(

        <AuthContext.Provider value={{isAuthenticated,login,logout,username,token,selectedFile,setSelectedFile}}>
            {children}
        </AuthContext.Provider>

    )
}

