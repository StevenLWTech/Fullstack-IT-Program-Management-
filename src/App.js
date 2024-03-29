import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Crud from "./pages/Crud";
import axios from "axios";

function App() {
  const [data, setData] = useState(null);



  // localhost endpoint
  const fetchData = async () => {
    try {
      // localhost endpoint
      const response = await axios.get("http://localhost:8000/api/data");
      
      // live server endpoint
      // const response = await axios.get("https://www.coeforict.org/wp-json/college_programs/v1/college-programs");

      const responseData = response.data;
   
      setData(responseData);
    } catch (error) {
      console.error("Error fetching data:", error);
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
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
