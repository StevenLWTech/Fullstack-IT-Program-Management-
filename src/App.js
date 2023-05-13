import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Crud from "./pages/Crud";
import axios from "axios";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";

function App() {
  const [data, setData] = useState(null);
  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://www.coeforict.org/wp-json/college_programs/v1/college-programs"
      );

      const modifiedData = response.data.map((item) => {
        const keys = Object.keys(item);
        const programNameIndex = keys.indexOf("Program Name");
        keys.splice(programNameIndex, 1);
        keys.splice(-1, 0, "Program Name");
        const entries = keys.map((key) => [key, item[key]]);
        return Object.fromEntries(entries);
      });

      setData(modifiedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home data={data} />} />
        <Route path="/crud" element={<Crud data={data} />} />
      </Routes>
      {isAuthenticated ? (
        <button onClick={() => logout()}>Logout</button>
      ) : (
        <button onClick={() => loginWithRedirect()}>Login</button>
      )}
      <Footer />
    </Router>
  );
}

export default App;