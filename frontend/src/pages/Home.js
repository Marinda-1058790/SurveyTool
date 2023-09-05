import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { UserContext } from "../UserContext";


const Home = () => {
	const { user, setUser } = useContext(UserContext)
	const state = useLocation();
	if(state?.state?.error){
		console.log(state.state.error)
	}
	return (
		<section>
			{state?.state?.error ?
			<div className="error-message light-shadow">
				<i className="fa-solid fa-exclamation error-message-icon"></i> {state.state.error}
			</div>
			:
			''
			}
			<div className="medium-container">
				<div className="section bg-light-grey">
					<h1>Hallo, <span className="blue">{user.fullName}</span></h1>
				</div>
				<div className="section bg-light-grey">
					<h3>Handige links</h3>
					<ul>
						<li><Link to="/vragenlijst/invullen/1">Invullen lijst 1 (voor testen)</Link></li>
						<li><Link to="/vragenlijsten">Vragenlijsten</Link></li>
						<li><Link to="/profiel">Profiel</Link></li>
					</ul>
				</div>
			</div>
			
		</section>
		
		
	);
};
  
export default Home;