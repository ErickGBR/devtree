import colors from "colors";
import server from "./server";
const port = process.env.PORT || 0;


server.listen(port, () => {
    console.log(colors.bgBlue.italic("working server in express PORT :"), port);
})
