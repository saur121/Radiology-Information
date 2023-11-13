import { useAuth } from "./security/AuthContext"
import {Navigate, useNavigate, useParams} from 'react-router-dom'
import { createPatientApi, getPatientApi, updatePatientApi } from "./api/Api"
import { useEffect, useState } from "react"
import {ErrorMessage, Field, Form, Formik} from 'formik'  // === HANDLE FORM STATE AND SUBMISSION ===== 
import moment from 'moment'
import * as Yup from 'yup'; // VALIDATION PURPOSE


/* =====   DECLARING VALIDATION RULE =============== */
const validationSchema = Yup.object().shape({
    patientName: Yup.string().required('Patient Name is required'),
    gender: Yup.string().required('Gender is required'),
    dateOfBirth: Yup.string().required('Date of Birth is required'),
    contactNumber: Yup.string().required('Contact Number is required').matches(/^\d{10}$/, 'Contact Number must be exactly 10 digit number'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    symptoms: Yup.string().required('Symptoms is required'),
});

export function Action(){

    const {id} = useParams() // which id to edit, if -1 means to add
    
    const navigate = useNavigate();

    const[patientName,setPatientName] = useState('')
    const[gender,setGender] = useState('')

    const[dateOfBirth,setDateOfBirth] = useState('')
    const[contactNumber,setContactNumber] = useState('')
    const[email,setEmail] = useState('')

    const[symptoms,setSymptoms] = useState('')

    const authContext = useAuth()
    const username = authContext.username

    useEffect(// will come into effect when the page is loaded and retrieveTodo is called
        () => patientInfo, [id] 
    )
 
    /* ======== PATIENT DETAILS SAVING ==========*/
    function patientInfo(){
        if(id != -1){ 
            getPatientApi(username, id) 
            .then(response => {

            setPatientName(response.data.patientName) 
            setGender(response.data.gender)

            setDateOfBirth(response.data.dateOfBirth) 
            setContactNumber(response.data.contactNumber)
            setEmail(response.data.email) 

            setSymptoms(response.data.symptoms)

            })
            .catch(error => console.log(error))
        }
        
    }

    function onsubmit(values){

        console.log("Inside onsubmit "+values);
        console.log(values);
        console.log("Firstname: ");
        const patient = {
            id,
            username,
        /* ====== GETTING THE VALUES ==========*/
            patientName:values.patientName, 
            gender:values.gender,

            dateOfBirth:values.dateOfBirth, 
            contactNumber:values.contactNumber,
            email:values.email, 

            symptoms:values.symptoms,   
        }
        console.log("Hospital:")
        console.log(patient)

    /* ========== HANDLING THE CREATION AND UPDATION ============= */
        if(id === -1){ 
            createPatientApi(username,patient)
            .then(response => {
                console.log("Response from backend:" +response);
                navigate('/patientList')
            })
            .catch(error => console.log(error))
        }else{ 
            updatePatientApi(username, id,patient)
            .then(response => {
                console.log(response);
                navigate('/patientList')
            })
            .catch(error => console.log(error))
        }
       
    }

    return(
        <div className="container">
            <h1>Enter Patient Details</h1>
            <div>
               <Formik initialValues={{patientName, gender, dateOfBirth, contactNumber, email, symptoms}}
                enableReinitialize={true} 
                onSubmit={onsubmit}
                validationSchema={validationSchema}
               >  
                {
                    ({ isSubmitting  }) => (
                        <Form>

                            <ErrorMessage 
                                name="description"
                                component="div"
                                className="alert alert-warning"
                            /> 

                              {/* ======== WILL SHOW ANY ERROR =======*/}

                            <ErrorMessage 
                                name="targetDate"
                                component="div"
                                className="alert alert-warning"
                            /> 

                            
                            <fieldset className="form-group">
                                <label>Patient Name</label>
                                <Field type="text" className="form-control" name="patientName"/> 
                                <ErrorMessage name="patientName" component="div" className="error" />
                            </fieldset>

                            <fieldset className="form-group">
                                <label>Gender</label>
                                <Field type="text" className="form-control" name="gender"/> 
                                <ErrorMessage name="gender" component="div" className="error" />
                            </fieldset>

                            <fieldset className="form-group">
                                <label>Date of Birth</label>
                                <Field type="text" className="form-control" name="dateOfBirth"/> 
                                <ErrorMessage name="dateOfBirth" component="div" className="error" />
                            </fieldset>
                            <fieldset className="form-group">
                                <label>Contact Number</label>
                                <Field type="number" className="form-control" name="contactNumber"/> 
                                <ErrorMessage name="contactNumber" component="div" className="error" />
                            </fieldset>
                            <fieldset className="form-group">
                                <label>Email</label>
                                <Field type="email" className="form-control" name="email"/>
                                <ErrorMessage name="email" component="div" className="error" />
                            </fieldset>

                            <fieldset className="form-group">
                                <label>Symptoms</label>
                                <Field type="text" className="form-control" name="symptoms"/> 
                                <ErrorMessage name="symptoms" component="div" className="error" />
                            </fieldset>
                            <div>
                                <button className="btn btn-success m-5" type="submit" disabled={isSubmitting}>Save</button>
                            </div>
                        </Form>
                    )
                }
               </Formik>
            </div>
        </div>

    )
}



