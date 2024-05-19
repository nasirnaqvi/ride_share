import React, {useEffect, useState} from 'react';

function App() {

  const [testData, setTest] = useState([{}]);

  useEffect(() => {
    fetch('/api')
      .then((response) => response.json())
      .then((data) => setTest(data))
      .catch((error) => console.log(error))
  }, []);

  return (
    <div>
      {(typeof testData.users === 'undefined') ? (
        <p>Loading...</p>
      ): (
        testData.users.map((user, index) => (
          <p key={index}>{user}</p>
        ))
      )}
    </div>
  );
}
 
export default App;