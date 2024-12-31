import { CorsOptions } from "cors";

export const corsConfig: CorsOptions = {
    origin: (origin, callback) => {
        const whitelist = [process.env.FRONTEND_URL]

        /*
        * If the --api flag is passed, we will allow any origin from postman or any other API client
        * This is useful for testing the API with postman
        * only run with --api flag in development script
        */
        if(process.argv[2] === "--api") {
            whitelist.push(undefined)
        }

        if (whitelist.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    }
}