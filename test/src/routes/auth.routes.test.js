import { expect } from "chai";
import request from "supertest";
import app from "../../../src/app";
import bcrypt from "bcryptjs";
import User from "../../../src/models/user.model";
import mongoose from "mongoose";
import {Mockgoose} from 'mockgoose'
import  'mocha'
const MONGODB_URL = "mongodb://localhost/snapshare";
const conn = () => {
    const mockgoose = new Mockgoose(mongoose)
    mockgoose.prepareStorage()
    .then(
        mongoose.connect(MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
          }).then(
              (res,err)=>{
                  if (err) return reject(err)
                  resolve()
              }
          )
    )
  
};

describe("Express App", () => {
  const tUser = { email: "test@gmail.com", password: "test", name: "testUser" };
  describe("Post /login", () => {
    before(async done => {
        conn()
      const encrptedPass = await bcrypt.hash(tUser.password, 10);
      const user = new User({
        name: tUser.name,
        email: tUser.email,
        password: encrptedPass,
        profileImage: ""
      });
      //save the user
      await user.save();
      done();
    });
  });
  it("should sucessfully login user with correct credentials", done => {
    request(app)
      .post("/api/user/login")
      .send({ email: "test@gmail.com", password: "test" })
      .then((res) => {
        const body = res.body;
        console.log(body)
        expect(body).to.contain.property("_id");
        expect(body).to.contain.property("token");
        done();
      })
      .catch((err) => done(err));
  });
});
