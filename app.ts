import express from "express";
//import fetch from "node-fetch";
import fetch from 'cross-fetch';

const app = express();
const port = 3000;
app.use(express.json());
app.listen(port, async () => {

const res = await fetch('https://api.ipify.org/?format=json');
    
if (res.status >= 400) {
  throw new Error("Bad response from server");
}
const ip = await res.json();
console.log(ip); 
  console.log(`Server is running on port ${port}.`);
});
