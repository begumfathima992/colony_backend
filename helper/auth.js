import jwt from 'jsonwebtoken'
import userModel from '../models/user.model.js';

// export const authorize = async (req, res, next) => {
//     try {
//         let token = req.headers["token"];
//         // console.log("token ", token);
//         // return
//         if (!token) {
//             // console.log("No token provided");
//             return res.status(420).json({
//                 success: false,
//                 message: "Please login to continue",
//                 statusCode: 420,
//             });
//         }

//         let payload = jwt.verify(token, 'vape_db', {
//             algorithm: "HS512",
//         });
//         // console.log(payload, 'payloadpayloadpayload')

//         let findDataExist = await userModel.findOne({
//             where: { id: payload?.id, },
//             raw: true,
//         });
//         // console.log(findDataExist, 'findDataExistfindDataExist')
//         if (!findDataExist) {
//             return res.status(400).json({
//                 message: "User not found",
//                 success: false,
//                 statusCode: 400,
//             });
//         } else if (findDataExist && findDataExist?.access_token == null) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Please login to continue...",
//                 statusCode: 401,
//             });

//         }

//         req.userData = findDataExist;
//         req.id = findDataExist.id;

//         return next();
//     } catch (err) {
//         console.error("JWT verification error:", err);
//         return res.status(401).json({
//             success: false,
//             message: "Please login to continue...",
//             statusCode: 401,
//         });
//     }
// };

////


export const authorize = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Please login to continue.",
        statusCode: 401,
      });
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login to continue..",
        statusCode: 401,
      });
    }

    const payload = jwt.verify(token, "vape_db", { algorithm: "HS512" });
    // console.log(payload, "Asdada")
    const findUser = await userModel.findOne({
      where: { id: payload.id },
      raw: true,
    });

    // if (!findUser || !findUser.access_token) {
    //   return res.status(401).json({
    //     success: false,
    //     message: "Please login to continue...",
    //     statusCode: 401,
    //   });
    // }
    // console.log(findUser, 'efwfwef')
    req.userData = findUser;
    req.id = findUser.id;

    next();
  } catch (err) {
    console.error("JWT verification error:", err);
    return res.status(500).json({
      success: false,
      message: "Invalid token. Please login..",
      statusCode: 500,
    });
  }
};






export const authorize_optional = async (req, res, next) => {
  try {
    let token = req.headers["token"];
    // console.log("token ", token);
    // return
    if (!token) {
      return next()
    }

    let payload = jwt.verify(token, 'vape_db', {
      algorithm: "HS512",
    });
    // console.log(payload, 'payloadpayloadpayload')

    let findDataExist = await userModel.findOne({
      where: { id: payload?.id, },
      raw: true,
    });
    // console.log(findDataExist, 'findDataExistfindDataExist')
    if (!findDataExist) {
      return res.status(400).json({
        message: "User not found",
        success: false,
        statusCode: 400,
      });
    } else if (findDataExist && findDataExist?.access_token == null) {
      return res.status(401).json({
        success: false,
        message: "Please login to continue...",
        statusCode: 401,
      });

    }

    req.userData = findDataExist;
    req.id = findDataExist.id;

    return next();
  } catch (err) {
    console.error("JWT verification error:", err);
    return res.status(401).json({
      success: false,
      message: "Please login to continue...",
      statusCode: 401,
    });
  }
};
