import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { useLocation, useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");

    const [showPass, setShowPass] = useState(false);

    const { user, setUser } = useContext(UserContext)

    const navigate = useNavigate();
    const state = useLocation();

    async function handleSubmit(e) {
        e.preventDefault()
        // send request to create jwt token for logging in
        let info = {
            method: "POST",
            mode: 'cors',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "email": email,
                "password": password
            })
        }

        try {
            const res = await fetch("http://127.0.0.1:5000/token", info)
            console.log(res)
            const data = await res.json()
            if (res.status !== 200) {
                console.log("Something went wrong")
                // setError(res)
                console.log("test", data)
                setError(data.msg)
                return false
            }
            
            // const data = await res.json()
            console.log("DATA: ", data)
            sessionStorage.setItem("token", data.access_token)
            setEmail('')
            setPassword('')
            setError('')
            // setUser(data.access_token)
            setUser({
                "token": data.access_token,
                "firstName": data.first_name,
                "lastName": data.last_name,
                "fullName": data.full_name,
                "email": data.email,
                "user_id": data.user_id,
                "admin": data.admin
            })
            // return redirect('/vragen')
            navigate("/"+state.state.next, { replace: true })
        }
        catch (error) {
            console.log("AWAIT", error)
        }
    }
    return (

        <div className="auto-container bg-light-grey">
            <div className="section">
                <h1 className="blue text-center">Inloggen</h1>
                {user?.token && user?.token != "" && user?.token != undefined
                    ?
                    "Logged in with " + user.fullName
                    :
                    <form className="form-container" onSubmit={handleSubmit}>
                        {error &&
                            <p className="form-error">{error}</p>
                        }
                        <label>E-mail</label>
                        <input className="custom-input" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email"></input>
                        <label>Wachtwoord</label>
                        <div className="password-container">
                            <input className="custom-input" type={showPass ? 'text' : 'password'}  required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="wachtwoord"></input>
                            <i onClick={() => setShowPass(!showPass)} className={"pass-icon fa-solid "+ (showPass ? "fa-eye" : "fa-eye-slash")}></i>
                        </div>
                        <input className="custom-submit" type="submit" value="Inloggen"></input>
                    </form>
                }
            </div>
        </div>


    )
};

export default Login;