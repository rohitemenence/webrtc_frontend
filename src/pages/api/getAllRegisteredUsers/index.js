import { getAllRegisterUser } from "../../../../controller/user/index";
import connectDatabase from "../../../../config/database";


export default async function handler(req, res, next) {

    await connectDatabase();

    switch (req.method) {
        case "GET":
    return getAllRegisterUser(req, res, next);
}
}