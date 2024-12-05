import express from "express";
const app = express();
const port = process.env.PORT || 0;

app.listen(port, () => {
    console.log("working server");
})