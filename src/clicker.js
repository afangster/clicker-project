import { useState, useEffect } from "react";
import {usePosition} from "use-position";

async function getUserCountry(latitude, longitude) {
  try {
    // Reverse geocode the coordinates into a country name using a third-party API
    let response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=caca1b3c40914024a323234d01b870fb&pretty=1`,
      {mode: 'cors',}
    );
    if (response.status === 200){
      const data = await response.json();
      const country = data.results[0].components.country;
      return country;
    }
    else{
      console.log("OpenCageData fetch failed."); 
    }
  } 
  catch (error) {
    return error;
  }
}

function ClickCounter() {
  const [count, setCount] = useState(() => {
      const savedCount = localStorage.getItem("clickCount");
      const storedValue = JSON.parse(savedCount);
      return storedValue || 0;
  });

  const {
    latitude,
    longitude,
    // speed,
    // timestamp,
    // accuracy,
    // heading,
    // error,
  } = usePosition();

  const [clicksByCountry, setClicksByCountry] = useState(() => {
    const countrySaved = localStorage.getItem("clicksByCountry");
    const storedCountry = JSON.parse(countrySaved);
    return storedCountry || {};
  });

  useEffect(() => {
    const data = localStorage.getItem('clickCount');
    if (data != null) {
      setCount(JSON.parse(data));
    }
    const storedClicksByCountry = localStorage.getItem('clicksByCountry');
    if (storedClicksByCountry != null) {
      setClicksByCountry(JSON.parse(storedClicksByCountry));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('clickCount', JSON.stringify(count));
    localStorage.setItem('clicksByCountry', JSON.stringify(clicksByCountry));
  }, [count]);

  async function handleClick() {
    setCount(count => count + 1);
    const country = await getUserCountry(latitude, longitude); 
    setClicksByCountry(prevClicksByCountry => ({
      ...prevClicksByCountry,
      [country]: (prevClicksByCountry[country] || 0) + 1
    }));
  }

  function renderClicksByCountry (){
    const rows = Object.entries(clicksByCountry).map(([country, clicks]) => (
      <tr key={country}>
        <td className="px-6 py-4">{country}</td>
        <td className="px-6 py-4">{clicks}</td>
      </tr>
    ));
    return (
      <table className="w-full text-sm text-center text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Country
            </th>
            <th scope="col" className="px-6 py-3">
              Clicks
            </th>
          </tr>
        </thead>
        <tbody className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
          {rows}
        </tbody>
      </table>
    );
  }

  return (
    <div className="flex h-screen justify-center items-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Click Counter!</h1>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
          onClick={handleClick}>Click me!</button>
        <p>Clicked {count} times</p>
        {renderClicksByCountry()}
      </div>
    </div>
  );
}
  
export default ClickCounter;
