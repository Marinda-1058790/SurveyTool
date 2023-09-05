import { Link } from "react-router-dom";

const NoPage = () => {
  return (<div className="auto-container">
    <div className="section bg-light-grey">
      <h1>We hebben niet gevonden wat je zocht</h1>
      <Link to="/">
        Home
      </Link>
    </div>
  </div>);
};

export default NoPage;