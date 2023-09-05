import { useContext } from "react";
import { Outlet, Link, NavLink } from "react-router-dom";
import { UserContext } from "../UserContext";

const Layout = () => {
	const { user, setUser } = useContext(UserContext)

	function logout() {
		sessionStorage.removeItem("token")
		setUser({})
	}

	return (
		<>
			<nav className="main-header">
				<div className="large-container">
					<div className="header-content">
						<Link className="header-link" to="/">
							<img alt="logo" width="208" height="50" src="https://www.dyflexis.com/nl/wp-content/uploads/2019/04/logo-dyflexis-2.svg"></img>
						</Link>
						<ul className="header-items">
							{sessionStorage.getItem("token") && sessionStorage.getItem("token") != "" && sessionStorage.getItem("token") != undefined
								?
								<>
									<li>
										<NavLink className={({ isActive, isPending }) => isPending ? "pending header-link" : isActive ? "header-link active" : "header-link"}
											to="/">Home</NavLink>
									</li>
									<li>
										{user.admin == true &&
											<NavLink className={({ isActive, isPending }) => isPending ? "pending header-link" : isActive ? "header-link active" : "header-link"}
												to="/vragenlijsten">Vragenlijsten</NavLink>
										}
									</li>
									<li>
										<NavLink className={({ isActive, isPending }) => isPending ? "pending header-link" : isActive ? "header-link active" : "header-link"}
											to="/profiel">{user.fullName}</NavLink>
									</li>
									<li>
										<button className="button-2" onClick={logout}>Uitloggen</button>
									</li>

								</>
								:

								<>
									{/* <li>
										<NavLink className="button-1" to="/inloggen">Inloggen</NavLink>
									</li> */}

								</>
							}
						</ul>
					</div>
				</div>

			</nav>
			<Outlet />
			<footer className="main-footer">
				Alien Software &#169; 2023
			</footer>
		</>
	)
};

export default Layout;