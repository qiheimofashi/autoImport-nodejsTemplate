const fs = require("fs");
const formatDateTime = require("@/utils/date.js");
const path = require("path");
let Dir = path.join(
  __dirname,
  `./log/${formatDateTime(new Date(), "yyyyMMdd")}`,
);
function write_log(data, path) {
  //创建目录
  fs.mkdirSync(Dir, {
    //递归创建目录
    recursive: true,
  });
  let directory = Dir + "/" + path;
  //flag:'a'是追加的文件内容
  fs.writeFile(
    directory,
    data + formatDateTime(new Date(), "yyyy-MM-dd HH:mm:ss") + "\n",
    { flag: "a", encoding: "utf8" },
    function (err) {
      if (err) {
        write_log(
          err + formatDateTime(new Date(), "yyyy-MM-dd HH:mm:ss") + "\n",
          "err.log",
        );
      }
      // console.log("追加成功",data);
    },
  );
}

//用流写入
function write_stream(data, path) {
  //创建目录
  fs.mkdirSync(Dir, {
    //递归创建目录
    recursive: true,
  });
  // 创建一个可以追加的流，追加到文件中
  let writerStream = fs.createWriteStream(Dir + "/" + path, {
    flags: "a",
    encoding: "utf8",
  });
  // 使用 utf8 编码写入数据
  writerStream.write(
    data + formatDateTime(new Date(), "yyyy-MM-dd HH:mm:ss") + "\n",
    "UTF8",
  );

  // 标记文件末尾
  writerStream.end();

  // 处理流事件 --> data, end, and error
  // writerStream.on("finish", function () {
  //   console.log("追加完成。",data);
  // });

  writerStream.on("error", function (err) {
    write_stream(
      err + formatDateTime(new Date(), "yyyy-MM-dd HH:mm:ss") + "\n",
      "err.log",
    );
    console.log(err.stack);
  });
}
module.exports = {
  write_log,
  write_stream,
};
