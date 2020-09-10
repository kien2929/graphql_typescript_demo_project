import * as express from "express";
import { User } from "#root/db/models";
import { hashUtil } from "#root/helpers/hashUtil";
import { jwtUtil } from "#root/helpers/jwtUtil"
import accessEnv from "#root/helpers/accessEnv"

const accessSecret = accessEnv("ACCESS_SECRET");
const refreshSecret = accessEnv("REFRESH_SECRET");
const accessLife = +accessEnv("ACCESS_TOKEN_LIFE");
const refreshLife = +accessEnv("REFRESH_TOKEN_LIFE");
const userRouter = express();

userRouter.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username == "" || password == "") {
    return res.status(400).send("");
  }
  return User
    .findOne({ where: { username: username } })
    .then(async (user) => {      
      if (!user) {
        return res.status(404).send("Not found user");
      }
      if (user.password == undefined) {
        return 
      }
      if (!hashUtil.comparePassword(password, user.password)) {
        return res.status(401).send("Wrong password")
      }
      const accessToken = await jwtUtil.generate({ username: user.username }, accessSecret, accessLife);
      const refreshToken = await jwtUtil.generate({ username: user.username }, refreshSecret, refreshLife);
      
      return res.status(200).json({ accessToken , refreshToken });
    })
    .catch((err) => { return res.status(500).send("Database error") })
})

userRouter.post("/signup",(req,res)=>{
  const password =req.body.password;
  const username =req.body.username;
  let hashedPassword = hashUtil.hashPassword(password);
  return User.create({ username: username, password: hashedPassword})
  .then(user=>{
    return res.status(200).send("Successed");
  })
  .catch((err)=>{
    return res.status(201).send("User existed");
  })
})

module.exports = userRouter