import {BrowserRouter, Routes,Route, Navigate,Switch} from 'react-router-dom'
import Logout from './Logout'
import Header from './Header'
import Home from './Home'
import Error from './Error'
import List from './List'
import Login from './Login'
import AuthProvider, { useAuth } from './security/AuthContext'
import './Main.css'
import { Action } from './Action'

import Dicom from './Dicom'

//Link can only be used if you are part of BrowserRouter
export default function Hospital(){
   
    function AuthenticatedRoute({children}){
        console.log("Childern",children);
        const authContext = useAuth();
        if(authContext.isAuthenticated){
            return children
        }
       return <Navigate to="/" />
    }


    return (
        <div className="TodoApp">
                <AuthProvider > 
                    <BrowserRouter> 
                        <Header /> {/* Along with any one Browser Component(login,welcom..) The header and foter compoonent will also be displayed*/}
                            <Routes>
                                <Route path='/' element={<Login />} />
                                <Route path='/login' element={<Login />} />

                                <Route path='/welcome/:username' element={
                                    <AuthenticatedRoute>
                                        <Home />
                                    </AuthenticatedRoute>
                                } />
                                <Route path='/patientList' element={ // changing /todos to /hospitalList
                                    <AuthenticatedRoute>
                                        <List />
                                    </AuthenticatedRoute>
                                
                                } />
                                <Route path='/patient/:id' element={
                                    <AuthenticatedRoute>
                                        <Action />
                                    </AuthenticatedRoute>
                                
                                } />
                                <Route path='/logout' element={
                                    <AuthenticatedRoute>
                                        <Logout />
                                    </AuthenticatedRoute>
                                } />

                                <Route path='/test/:id' element={
                                    <AuthenticatedRoute>
                                        <Dicom />
                                    </AuthenticatedRoute>
                                
                                } />
                               

                                <Route path='*' element={<Error />} />{/*if none of the above routes is accesse it will come here*/}
                            </Routes>
                        
                    </BrowserRouter>
                </AuthProvider>
            
            
        </div>
    )
}










