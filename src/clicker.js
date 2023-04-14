import { useState, useEffect } from "react";

function ClickCounter() {
    const [count, setCount] = useState(() => {
        const savedCount = localStorage.getItem("clickCount");
        const storedValue = JSON.parse(savedCount);
        return storedValue || 0;
    });
    
    useEffect(() => {
      const data = window.localStorage.getItem('clickCount');
      if (data != null) {
        setCount(JSON.parse(data));
      }
    }, []);

    useEffect(() => {
      window.localStorage.setItem('clickCount', JSON.stringify(count));
    }, [count]);

    function handleClick() {
      setCount(count => count + 1);
    }

    return (
      <div className="flex h-screen justify-center items-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Click Counter!</h1>
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
            onClick={handleClick}>Click me!</button>
          <p>Clicked {count} times</p>
        </div>
      </div>
    );
  }
  
export default ClickCounter;
