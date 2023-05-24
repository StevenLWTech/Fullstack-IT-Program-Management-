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
    try {
      const response = await axios.get(
        "https://www.coeforict.org/wp-json/college_programs/v1/college-programs"
      );
      const responseData = response.data;
  
      // Convert the response data to the new data structure
      const newData = responseData.flatMap((item, index) => {
        if (Array.isArray(item.programs) && item.programs.length > 0) {
          return item.programs.map((program, programIndex) => ({
            id: `${index + 1}-${programIndex + 1}`,
            College: item.college,
            "Program Type": program.program_type || "",
            "Program Name": program.program_name || "",
            Category: program.category || "",
            Region: program.region || "",
            Hyperlink: program.hyperlink || ""
          }));
        } else {
          // Create an object with empty values if programs array is empty
          return [
            {
              id: `${index + 1}-1`,
              College: item.college,
              "Program Type": "",
              Category: "",
              "Program Name": "",
              Region: "",
              Hyperlink: ""
            }
          ];
        }
      });
  
      setData(newData);
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
        {/* <Route path = "/admin" {Admin}/> */}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
