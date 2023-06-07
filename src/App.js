import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Crud from "./components/Crud";
import axios from "axios";

function App() {
  const [data, setData] = useState(null);

  // Using Aleksander's endpoint
  // const fetchData = async () => {
  //   try {
  //     const response = await axios.get(
  //       "https://www.coeforict.org/wp-json/college_programs/v1/college-programs"
  //     );
  //     // const responseData = response.data;
  //     const responseData = response.data.map((item) => {
  //       return {
  //         id: item.uuid|| "",
  //         College: item.college,
  //         Category: item.category|| "",
  //         "Program Type": item.program_type || "",
  //         "Program Name": item.program_name|| "",
  //         Region: item.region|| "",
  //         HyperLink: item.hyperlink,
  //       };
  //     });
  //     setData(responseData);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  // localhost endpoint
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/data");

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
