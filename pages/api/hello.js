// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import fetch from 'node-fetch'

export default function handler(req, res) {
  let ndata;
  fetch("https://qonditive.com/tests/api/listings.json", { method: "Get" })
  .then((res) => {
    res.text();
  }).then(text=> { console.log(text);
    ndata = text;
  })
  .catch( err => {
      console.log("Fetch error-", err)
  })
  res.status(200).json(ndata);
  
}
