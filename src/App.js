import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
// import Admin from './pages/Admin';
import Crud from "./pages/Crud";
import axios from "axios";
// import { useAuth0 } from "@auth0/auth0-react";

function App() {
  const [data, setData] = useState(null);
  const fetchData = async () => {
    //console.log("Fetching data...");
    try {
      //   const response = await axios.get(
      //     "https://www.coeforict.org/wp-json/college_programs/v1/college-programs",
      //     {

      //     }
      //   );
      const response = await axios.get("http://localhost:8000/api/data");

      const modifiedData = response.data.map((item) => {
        const keys = Object.keys(item);
        const programNameIndex = keys.indexOf("Program Name");
        keys.splice(programNameIndex, 1);
        keys.splice(-1, 0, "Program Name");
        const entries = keys.map((key) => [key, item[key]]);
        return Object.fromEntries(entries);
      });
      // console.log("Data fetched:", modifiedData);
      setData(modifiedData);
    } catch (error) {
      // console.log("error" + error)
      // console.error("Error fetching data:", error);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Router>
      <Header />
      <Routes>
      
        <Route path="/admin" element={<Crud data={data} />} />
        <Route path="/" element={<Home data={data} />} />
        {/* <Route path = "/admin" {Admin}/> */}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
