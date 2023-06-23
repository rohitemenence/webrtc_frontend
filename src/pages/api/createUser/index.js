import { registerUser } from "../../../../controller/user";
import connectDatabase from "../../../../config/database";
const User = require("../../../../model/user/index");

export default async function handler(req, res) {
  console.log({ ...req.body });

  //connect to mongodb
  await connectDatabase();

  switch (req.method) {
    case "POST":
      return registerUser(req, res);
  }
}
