import React from 'react';
import { Link } from "@mui/material";
import FibCalculator from "./FibCalculator";

function OtherPage(props) {
  return (
    <div>
      <h1>This is the other page</h1>
      <Link ref={FibCalculator}>Back</Link>
    </div>
  );
}

export default OtherPage;