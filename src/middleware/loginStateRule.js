//此处为公共方法
// const { getToken } = utils;

// const fs = require("fs");
// router.use(async (req, res, next) => {
//   const token = req.headers.token;

//   if (!token) {
//     res.status(500).send(responseError("请登陆！"));
//     return;
//   }

//   const user = await getToken(token);

//   if (user == "error") {
//     res.status(401).send({
//       success: false,
//       message: "登陆过期!",
//     });
//   } else {
//     const inUser = await db.findOne("select * from user where mobile = ?", [
//       user.userItem.mobile,
//     ]);
//     req.user = inUser;
//     next();
//   }
// });
