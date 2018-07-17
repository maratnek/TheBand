import * as functions from 'firebase-functions';
import * as express from 'express';

const app = express();

app.get('./admin', (req, res)=>{
  res.send(`${Date.now()}`);
});

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const appf = functions.https.onRequest(app);
