/**
 * @description used to block unwanted users from sending text's to the user
 * @param {Request} req incoming user request
 * @param {Response} res server response
 * @param {NextFunction} next calls the next middleware
 */
import User from "../models/user.model";

const blocked = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const receipent = await User.findOne({ _id: req.body.receipentId });
    const { blockedContacts } = receipent;
    const user = blockedContacts.filter(contact => contact._id === _id);
    console.log(user);
    if (user.length > 0)
      return res
        .status(200)
        .send({ message: "your request is being processed" });
    next();
  } catch (error) {
    next(error);
  }
};
export default blocked;
