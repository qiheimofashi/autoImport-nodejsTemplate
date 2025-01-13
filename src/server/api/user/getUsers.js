module.exports = async (req, res) => {
  const users = await utils.db.query("SELECT * FROM user", [], true);

  res.success(users);
};
