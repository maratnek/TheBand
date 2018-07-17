"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const express = require("express");
const app = express();
app.get('./admin', (req, res) => {
    res.send(`${Date.now()}`);
});
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
exports.appf = functions.https.onRequest(app);
//# sourceMappingURL=index.js.map