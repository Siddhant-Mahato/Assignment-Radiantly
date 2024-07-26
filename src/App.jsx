import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Pokemon from "./components/Pokemon";
import Search from "./pages/Search";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Pokemon />} />
        <Route path="/search" element={<Search />} />
      </Routes>
    </Router>
  );
}

export default App;
