import jwt from "jsonwebtoken";

export const verifyToken = (req,res,next) => {
    const token = req.cookies.access_token;
    !token && res.status(404).json("Token not found");

    jwt.verify(token, process.env.JWT, (err,user) => {
        if(err) next(err);
        req.user = user;
        next();
    });
};