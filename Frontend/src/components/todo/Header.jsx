
import { Link } from 'react-router-dom';
import { useAuth } from './security/AuthContext';


/* ============ AUTHENTICATION CHECK ==================== */
export default function Header() {
  const authContext = useAuth();
  const isAuthenticated = authContext.isAuthenticated;

  function logout() {
    authContext.logout();
  }


  /* =============   NAVBAR COMPONENTS =================  */
  return (
    <header className="bg-primary py-3">
      <div className="container d-flex justify-content-between align-items-center">
        <div className="navbar-logo">
          <Link to="/" className="navbar-brand text-white fs-3">
            RIS
          </Link>
        </div>
        <nav className="navbar-expand-lg">
          <ul className="navbar-nav d-flex align-items-center">
            {/* <li className="nav-item fs-5 me-3">
              {isAuthenticated && (
                <Link className="nav-link text-white" to="/welcome/saurabh">
                  Home
                </Link>
              )}
            </li> */}
            <li className="nav-item fs-5 me-3">
              {isAuthenticated && (
                <Link className="nav-link text-white" to="/patientList">
                  Patients
                </Link>
              )}
            </li>
            <li className="nav-item fs-5 me-3">
              {!isAuthenticated && (
                <Link className="nav-link text-white" to="/login">
                  Login
                </Link>
              )}
            </li>
            <li className="nav-item fs-5">
              {isAuthenticated && (
                <Link
                  className="nav-link text-white"
                  to="/logout"
                  onClick={logout}
                >
                  Logout
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
