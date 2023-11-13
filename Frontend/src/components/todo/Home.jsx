import {Link} from 'react-router-dom'
import { useAuth } from './security/AuthContext';

/* ========= HOME PAGE COMPONENT =============== */
export default function Home(){
  const authContext = useAuth()
  const username = authContext.username

  return(
    <div>
      <h1>Welcome {username}</h1>
      <div>
        Patient's List 
        <Link to='/patientList'> Patients's List</Link> 
      </div>
    </div>
  )
}
