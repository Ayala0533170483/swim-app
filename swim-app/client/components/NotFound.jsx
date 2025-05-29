import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import "../styles/NotFound.css"; // Assuming you have a CSS file for styles

function Error() {
  const navigate = useNavigate();

  return (
    <div className="errorContainer">
      <div className="errorContent">
        <div className="errorAnimation">
          <div className="error404">404</div>
          <div className="errorGhost">
            <div className="errorGhostBody">
              <div className="errorGhostEyes"></div>
              <div className="errorGhostWaves"></div>
            </div>
          </div>
        </div>

        <h1>Page Not Found</h1>
        <p>Oops! The page youre looking for doesnt exist.</p>

        <button className="btn btnPrimary" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    </div>
  );
}

Error.propTypes = {
  message: PropTypes.string,
};

export default Error;
