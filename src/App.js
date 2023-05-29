import React, { useEffect, useState } from "react";
import Home from "./components/Home";
import axios from "axios";

function App() {
  const [data, setData] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://www.coeforict.org/wp-json/college_programs/v1/college-programs"
      );
      const responseData = response.data;

      setData(responseData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return <Home data={data} />;
}

export default App;
