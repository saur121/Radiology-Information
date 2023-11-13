import { useEffect, useState } from "react";
import { getAllPatientApi, deletePatientApi,uploadFile } from "./api/Api";
import { useAuth } from "./security/AuthContext";
import { useNavigate } from "react-router-dom";

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import {FilterMatchMode} from "primereact/api"
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

import 'primereact/resources/themes/saga-blue/theme.css'; 
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import Dexie from 'dexie';

import '../../App.css'

/* ============   CREATING A DEXIE DATABASE ============= */
const db = new Dexie('MyDatabase');
db.version(1).stores({
  files: 'id, data', 
});

/* =============  STATE VARIABLES AND CONTEXT VARIABLES =============== */
export default function List(){

    const authContext = useAuth();
    const username = authContext.username
    const navigate = useNavigate();
    const [patients, setPatients] = useState([])
    const [message, setMessage] = useState(null)
    const selectedFile = authContext.selectedFile;
    const setSelectedFile = authContext.setSelectedFile;
    var status = null;
   

    const [filters, setFilters] = useState({
        global: {value: null, matchMode: FilterMatchMode.CONTAINS},
    })

/* ============= FETCHING DATA FROM THE BACKEND AND RESPONSIBLE FOR LOADING THE DICOM FILE ================*/
    useEffect(
        () => refreshPatientList(), [] 
    ) 


    /* ============  TO FETCH THE SELECTED FILE FROM DATABASE =============== */
    async function loadSelectedFile() {
        const files = await db.files.toArray();
        const transformedFiles = files.map(file => ({
            ...file.data,
            id: file.data.hospitalId
          }));
        await setSelectedFile(transformedFiles);

    }

/* =========== TO FETCH DATA FROM BACKEND  ================= */
    function refreshPatientList(){ 
        loadSelectedFile()
        getAllPatientApi(username)
        .then(response => {
            setPatients(response.data) 
        })
        .catch(error => console.log("Error in Patient list: ",error))
    }

/* ============== TO DELETE A PARTICULAR ROW ================== */
    function deletePatient(rowData){

        deletePatientApi(username,rowData.id)
        .then(
            () => {
                setMessage(` ${rowData.id} Deleted successfully`) //Diaplay message
                refreshPatientList() //Update hospital list
            }
        )
        .catch(error => console.log("Error occurred:",error))
    }

    function updatePatient(id){ // to update the info about hospital using hospital id
        navigate(`/patient/${id}`) // using id as params so TodoComponent will know if the existing hospita is to be updated or added new one
    }

    function addEntry(){
        navigate(`/patient/-1`); // here id as -1 so Todo component will know its to add
    }

    //function to navigate to /test to display the particular dicom file
    function viewDicom(id){
        navigate(`/test/${id}`)
    }

    //function te delete dicom file
    async function deleteDicom(id){
        await db.files.delete(id); // deleteing from chrome database
        await loadSelectedFile(); // Refresh the selectedFile state
    }

    // To delte specific hospital row
    const deleteTemplate = (rowData) => {
        return (
          <Button icon="pi pi-delete-left" onClick={() => deletePatient(rowData)} size="medium" rounded text severity="danger" />
        );
    };

    const updateTemplate = (rowData) => {
        return (
            <Button icon="pi pi-pencil" onClick={() => updatePatient(rowData.id)} size="medium" rounded text  severity="help"/>
        );
    };

    /* ============ CHECKING THE STATUS OF THE DICOM FILE ============= */
    const statusTemplate = (rowData)=>{

        const indexToUpdate = selectedFile.findIndex(item => item.hospitalId === rowData.id);
        var fileName = null;
        var slicedFilename = null;
        if (indexToUpdate !== -1) { // if the file is present at that particular hospitalId
            status=true; //used to enable or disable the button
            fileName = selectedFile[indexToUpdate].file.name // extracting thr fileName from our present file
            slicedFilename = fileName.slice(0,10)
        } else {  
            status=false
        }
        return(
            <div>

                <div className="allButtons">
                    <Button icon="pi pi-image" severity="warning" outlined  rounded text size="medium" disabled={!status} onClick={() => viewDicom(rowData.id)}/>
                    <Button icon="pi pi-delete-left" severity="danger"  outlined  rounded  text size="medium" disabled={!status} onClick={()=>deleteDicom(rowData.id)}/>
                </div>

                {status 
                    ? <p className="fileName"><span className="text-muted">{slicedFilename}</span>...</p> 
                    : ''}

            </div>
        ) 
    }

    /* ============ GETTING THE META DATA OF THE FILE ============= */
    const fileUploadTemplate = (rowData) => {
        const handleFileChange = async (event) => {
            console.log("Event:",event);
            const formData = new FormData();
            formData.append('dicomFile', event.target.files[0]);
            formData.append('hospitalId', rowData.id);
            var incomingMetaData = null;
            await uploadFile(formData) 
            .then((response) => {
                incomingMetaData = response.data
            }).catch(err => console.log("Some error occurred",err))

            const temp = {hospitalId:rowData.id, file:event.target.files[0],incomingData:incomingMetaData};
            const indexToUpdate = selectedFile.findIndex(item => item.hospitalId === temp.hospitalId);
        /* ================ FOR UPDATING THE DICOM FILE =================== */
            if (indexToUpdate !== -1) { 
                const fileEntry = { data: temp};
                await db.files.update(temp.hospitalId, fileEntry); 
                await loadSelectedFile(); 
            } 
         /* ================= FOR UPLOADING A NEW DICOM FILE ================ */   
            else {
                const fileEntry = { data: temp,id: rowData.id};
                await db.files.add(fileEntry);
                await loadSelectedFile();
            }
        };
        
        return (
            <input type="file" onChange={handleFileChange} accept=".dcm" />
        );
    };

    return(
        <div className="container">
        <p>{message}</p>
        <div className="top-bar">
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <InputText
                    onInput={(e) =>
                        setFilters({
                            global: { value: e.target.value, matchMode: FilterMatchMode.CONTAINS },
                        })
                    }
                    style={{ flex: '1' }} 
                />

                <button className="btn btn-success" onClick={addEntry}>
                    Add Patient
                </button>
            </div>
        </div>


            <DataTable className="custom-datatable" value={patients} sortMode="multiple" filters={filters} paginator rows={5} rowsPerPageOptions={[1,2,3,4,5,6]} >
           
                <Column field="id" header="ID" sortable/>

                <Column field="patientName" header="Patient Name" sortable/>
                <Column field="gender" header="Gender" sortable/>

                <Column field="dateOfBirth" header="Date of Birth" sortable />
                <Column field="email" header="Email" sortable/>

                <Column body={deleteTemplate} header="Delete" style={{ width: '6rem', textAlign: 'center' }} />
                <Column body={updateTemplate} header="Update" style={{ width: '6rem', textAlign: 'center' }} />
                
                <Column body={fileUploadTemplate} header="Upload File" style={{ textAlign: 'center' }} ><Button /></Column>
                <Column body={statusTemplate} header="Status" style={{ width: '10rem', textAlign: 'center' }} className="status"/>
    
            </DataTable>
             
        </div>
     )
}





