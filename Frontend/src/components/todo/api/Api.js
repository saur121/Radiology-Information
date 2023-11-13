
/* ========== API DECLARATION ==============*/
import { apiClient } from './ApiClient';


/*============== TO GET LIST OF ALL PATIENTS ===========*/
export const getAllPatientApi = 
    (username) => apiClient.get(`/users/${username}/patients`);

/*============= TO GET WITH PATIENT WITH ID =================*/
export const getPatientApi = 
    (username,id) => apiClient.get(`/users/${username}/patients/${id}`);

/* ============ TO DELETE PATIENT =============== */
export const deletePatientApi = 
    (username,id) => apiClient.delete(`/users/${username}/patients/${id}`);

/* ============ TO UPDATE PATIENT ============ */
export const updatePatientApi = 
    (username,id,todo) => apiClient.put(`/users/${username}/patients/${id}`,todo); 

/* ========== TO CREATE A NEW PATIENT =============== */
export const createPatientApi = 
    (username,todo) => apiClient.post(`/users/${username}/patients`,todo);

/* ============= TO UPLOAD A NEW FILE ============= */
export const uploadFile =  
(formData) => apiClient.post('/uploadFile', formData);
