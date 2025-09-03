import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import FirstCard from './components/firstcard';

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="app-container">
              <div className="card-grid">
                <Link to="/card/1" className={`dashboard-card`}>
                  <h3 className="card-title">Card 1</h3>
                  <p className="card-text" style={{  justifyContent: "center", display: "flex", alignItems: "center", fontSize: "2rem" }}>
                    Data Scientist
                  </p>
                </Link>
                <Link to="/card/2" className={`dashboard-card`}>
                  <h3 className="card-title">Card 2</h3>
                  <p className="card-text" style={{  justifyContent: "center", display: "flex", alignItems: "center", fontSize: "2rem" }}>
                    Data Scientist
                  </p>
                </Link>
                <Link to="/card/3" className={`dashboard-card`}>
                  <h3 className="card-title">Card 3</h3>
                  <p className="card-text" style={{  justifyContent: "center", display: "flex", alignItems: "center", fontSize: "2rem" }}>
                    Data Scientist
                  </p>
                </Link>
                <Link to="/card/4" className={`dashboard-card`}>
                  <h3 className="card-title">Card 4</h3>
                  <p className="card-text" style={{  justifyContent: "center", display: "flex", alignItems: "center", fontSize: "2rem" }}>
                    Data Scientist
                  </p>
                </Link>
              </div>
            </div>
          }
        />
        <Route path="/card/:id" element={<FirstCard />} />
      </Routes>
    </Router>
  );
}

export default App;