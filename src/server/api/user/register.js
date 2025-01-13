const { v4: uuid } = require("uuid");
const dayjs = require("dayjs");
const { db } = utils;
module.exports = async (req, res) => {
  const { canvasId } = req.query;
  if (!canvasId) {
    res.error("canvasId不能为空");
    return;
  }
  const userInfo = await db.findOne("select * from user where userIdCard = ?", [
    canvasId,
  ]);
  if (!!userInfo) {
    res.success({
      userInfo,
    });

    return;
  }

  const { id = 0 } = await db.findOne("select max(id) as maxId from user");

  await db.query(
    "insert into user (userIdCard,userName,userNickName,registerTime) values (?,?,?,?)",
    [
      canvasId,
      uuid(),
      "用户" + String(id + 1).padStart(5, "0"),
      dayjs().format("YYYY-MM-DD HH:mm:ss"),
    ],
  );
  res.success({
    userInfo: {
      userIdCard: canvasId,
      userName: uuid(),
      userNickName: "用户" + (id + 1),
    },
  });
};
