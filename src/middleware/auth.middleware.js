/**
 * @fileOverview contains middleware that authorise admin previlages only
 * @author brian omondi
 * @version 0.0.1
 */
import { findOne } from "../models/user.model";

export default async (req, res, next) => {
  try {
    const { _id } = req.user;
    const currentUser = await findOne({ _id });
    if (currentUser.role === "normal")
      return res.status(401).send("ACCESS DENIED");
    next();
  } catch (error) {
    next(error);
  }
};
