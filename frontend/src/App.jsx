import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import FirstCard from './components/firstcard';
import Login from './components/Login'; // New component for login

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="app-container">
              {/* Header with Login Button on Right */}
              <header className="app-header">
                <h1 className="app-title">Job Role Matcher</h1>
                <Link to="/login" className="login-btn">
                  Sign In / Login
                </Link>
              </header>
              <div className="card-grid">
                <Link to="/card/Data Scientist" className={`dashboard-card`}>
                  <h3 className="card-title">Card 1</h3>
                  <p className="card-text" style={{ justifyContent: "center", display: "flex", alignItems: "center", fontSize: "2rem" }}>
                    Data Scientist
                  </p>
                </Link>
                <Link to="/card/Frontend Developer" className={`dashboard-card`}>
                  <h3 className="card-title">Card 2</h3>
                  <p className="card-text" style={{ justifyContent: "center", display: "flex", alignItems: "center", fontSize: "2rem" }}>
                    Frontend Developer
                  </p>
                </Link>
                <Link to="/card/QA Automation" className={`dashboard-card`}>
                  <h3 className="card-title">Card 3</h3>
                  <p className="card-text" style={{ justifyContent: "center", display: "flex", alignItems: "center", fontSize: "2rem" }}>
                    QA Automation
                  </p>
                </Link>
                <Link to="/card/Backend Developer" className={`dashboard-card`}>
                  <h3 className="card-title">Card 4</h3>
                  <p className="card-text" style={{ justifyContent: "center", display: "flex", alignItems: "center", fontSize: "2rem" }}>
                    Backend Developer
                  </p>
                </Link>
              </div>
            </div>
          }
        />
        <Route path="/card/:id" element={<FirstCard />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;