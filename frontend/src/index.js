import 'bootstrap/dist/css/bootstrap.min.css';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import NoPage from "./pages/NoPage";
import Answers from "./pages/Answers";
import EnqueteOverview from "./pages/EnqueteOverview";
import NewSurveyMaker from "./pages/NewSurveyMaker"
import AdjustEnquete from "./pages/AdjustEnquete";
import Login from './pages/Login';
import { UserContext } from './UserContext';
import { useEffect, useState } from 'react';
import ProtectedRoute from './components/ProtectedRoute';
import SurveyForm from './pages/SurveyForm';
import "bootstrap-icons/font/bootstrap-icons.css";
import Loader from "./components/Loader";
import "./main.css";

export default function App() {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // console.log(user)
    // update user info by jwt token
    setLoading(true)
    async function fetchData() {
      
      let info = {
        method: "GET",
        mode: 'cors',
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + sessionStorage.getItem("token")
        }
      }

      try {
        const res = await fetch("http://127.0.0.1:5000/who_am_i", info)
        const data = await res.json()
        if (data?.msg == 'Token has expired') {
          sessionStorage.removeItem("token")
          setUser({})
        }
        setUser({
          "token": sessionStorage.getItem("token"),
          "firstName": data.firstName,
          "lastName": data.lastName,
          "fullName": data.fullName,
          "email": data.email,
          "user_id": data.user_id,
          "admin": data.admin
        })
        setLoading(false)
      }
      catch (error) {
        console.error("INDEX", error)
      }

    }
    if (sessionStorage.getItem("token") != '' && sessionStorage.getItem("token") != undefined && sessionStorage.getItem("token") != null) {
      fetchData()
    } else {
      console.log("No auth token")
      setLoading(false)
    }
  }, [])
  return (
    
    <BrowserRouter>
      <UserContext.Provider value={{ user, setUser }}>
        {loading ?
          <Loader></Loader>
          :
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<ProtectedRoute path=""><Home /></ProtectedRoute>} />
              <Route path="profiel" element={<ProtectedRoute path="profiel"><Profile /></ProtectedRoute>} />
              <Route path="antwoorden/:id" element={<ProtectedRoute path="antwoorden"><Answers /></ProtectedRoute>} />
              <Route path="*" element={<ProtectedRoute path="*"><NoPage /></ProtectedRoute>} />
              <Route path="vragenlijsten" element={<ProtectedRoute admin={true} path="vragenlijsten"><EnqueteOverview /></ProtectedRoute>} />
              <Route path="vragenlijst/nieuw" element={<ProtectedRoute admin={true} path="vragenlijst/nieuw"><NewSurveyMaker/></ProtectedRoute>} />
              <Route path="vragen/:id" element={<ProtectedRoute path="vragen"><AdjustEnquete /></ProtectedRoute>} />
              <Route path="inloggen" element={<Login />} />
              <Route path="vragenlijst/invullen/:id" element={<ProtectedRoute path="vragenlijst/invullen"><SurveyForm /></ProtectedRoute>} />
            </Route>
          </Routes>
        }
        
      </UserContext.Provider>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
