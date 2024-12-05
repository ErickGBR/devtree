import server from "./server";
const port = process.env.PORT || 0;


server.listen(port, () => {
    console.log("working server in express");
})
