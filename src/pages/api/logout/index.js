import { logoutUser } from "../../../../controller/user";
import connectDatabase from "../../../../config/database";



export default async function handler(req, res, next) {

  await connectDatabase();
  switch (req.method) {
    case "POST":
    return logoutUser(req,res,next);
  }
}

