import React, { useEffect, useState } from 'react';
import { Button, Chip, Input } from "@mui/material";
import axios from "axios";

function FibCalculator(props) {
  const [input, setInput] = useState("");
  const [seenIndices, setSeenIndices] = useState([]);
  const [calculatedValues, setCalculatedValues] = useState({});

  function fetchSeenIndices() {
    axios.get('/api/values/all').then((res) => {
      setSeenIndices(res.data);
    });
  }

  function fetchCalculatedValues() {
    axios.get('/api/values/current').then((res) => {
      setCalculatedValues(res.data);
    });
  }

  function handleSubmit(e) {
    axios.post('/api/values', {
      index: input
    }).then(() => {
      setInput('');
      fetchCalculatedValues();
    });
  }

  useEffect(() => {
    fetchSeenIndices();
    fetchCalculatedValues();
  }, []);

  return (
    <div>
      <h1>Fibonacci calculator</h1>
      <div>
        <Input placeholder={"Input number"} value={input}
               onChange={(e) => setInput(e.target.value)} />
        <Button onClick={() => handleSubmit(input)}>Submit</Button>
      </div>
      <div>
        {seenIndices.map((val) => {
          console.log(val);
          return (<Chip label={val.number} key={val.number} />);
        })}
      </div>
      <div>
        {Object.entries(calculatedValues).map(([key, val], index) => {
          console.log(val);
          const label = `Fib value for ${key} is ${val}`
          return (<Chip label={label} key={val.key} />);
        })}
      </div>
    </div>
  );
}

export default FibCalculator;