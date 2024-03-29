const jwt = require("jsonwebtoken");
const { User, Admin } = require("../model/UserSchema");

const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.jwtoken;

        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
        const rootUser = await User.findOne({ _id: verifyToken._id, "tokens.token": token });
        if (!rootUser) { 
            throw new Error("User not Found") 
        }
        req.token = token;
        req.rootUser = rootUser;
        req.userID = rootUser._id;
        next();
    } catch (err) {
        res.status(401).send("Unauthorized:No token provided");
        console.log(err);
    }
}

const adminAuthenticate = async (req, res, next) => {
    try {
        const token = req.cookies.jwtoken;

        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
        const rootAdmin = await Admin.findOne({ _id: verifyToken._id, "tokens.token": token });
        if (!rootAdmin) { throw new Error("Admin not Found") }
        req.token = token;
        req.rootAdmin = rootAdmin;
        req.adminID = rootAdmin._id;
        next();
    } catch (err) {
        res.status(401).send("Unauthorized:No token provided");
        console.log(err);
    }
}

module.exports = { authenticate, adminAuthenticate };