import React from 'react';
import { useState } from 'react';

function CreateDailyTask() {
  const [myData, setMyData] = useState<Array<any>>([]);

  const postData = [
    {
      name: 'Create Daily Task',
      description: 'Create a daily task component',
      completed: false,
    },
  ];
  return (
    <div>
      <h3>Create Daily Task</h3>
      <button
        onClick={() => {
          console.log(JSON.stringify(postData));
          // post data to api/v1/post/createDailyTask
          const requestOptions = {
            method: 'POST',
            body: JSON.stringify(postData),
            headers: { 'Content-Type': 'application/json' },
          };
          fetch('/api/v1/post/createDailyTask', requestOptions)
            .then((response) => response.text())
            .then((data) => setMyData([data]));
        }}>
        Submit
      </button>
      {myData}
    </div>
  );
}

export default CreateDailyTask;
