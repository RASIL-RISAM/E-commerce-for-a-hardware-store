import mongoose from "mongoose";
import dotenv from "dotenv";

import app from "./app.js";

dotenv.config({ path: '.env' })

const DB = process.env.DATABASE_URL.replace('<password>', process.env.DATABASE_PASSWORD)

mongoose.connect(DB)
    .then(() => {
        console.log("DB Connected")
    })
    .catch((err) => {
        console.log(`DB NOT CONNECTED : ${err}`)
    })

app.listen(process.env.PORT, () => {
    console.log(`Server Listening at ${process.env.PORT}`)
})

