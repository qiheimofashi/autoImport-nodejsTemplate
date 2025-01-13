// 使用 multer 处理文件上传
const multer = require("multer");
const fs = require("fs");
const { v4: uuid } = require("uuid");
const path = require("path");
const { request } = require("http");
// 配置上传文件的存储位置和文件名
function storage(pathname) {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, pathname);
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, uuid() + ext);
    },
  });
}
const avatar = multer({ storage: storage("../public/avatars") });
const picture = multer({ storage: storage("../public/pictures") });

const uploadPath = (key = "uploadImage") => {
  //自定义中间件
  function uploadFile(req, res, next) {
    //dest 值为文件存储的路径;single方法,表示上传单个文件,参数为表单数据对应的key
    let upload = multer({ dest: `../public/${key}/` }).single("file");
    upload(req, res, (err) => {
      //打印结果看下面的截图

      if (err) {
        res.send("err:" + err);
      } else {
        const {
          file,
          body: { ...fromData },
        } = req;
        req.fromData = fromData;

        const fileInfo = {};
        if (!file) {
          req.body = fileInfo;

          next();
          return;
        }

        const 后缀 =
          uuid() +
          req.file.originalname.substring(
            req.file.originalname.lastIndexOf("."),
            req.file.originalname.length,
          );
        fs.renameSync(
          `./public/${key}/` + req.file.filename,
          `./public/${key}/` + 后缀,
        ); //这里修改文件名字，比较随意。
        // 获取文件信息
        fileInfo.mimetype = req.file.mimetype;
        fileInfo.originalname = 后缀;
        fileInfo.size = req.file.size;
        fileInfo.path = req.file.path;
        fileInfo.fileName = file.originalname;
        //将文件信息赋值到req.body中，继续执行下一步
        req.body = fileInfo;

        next();
      }
    });
  }

  return uploadFile;
};

module.exports = { avatar, picture, uploadPath };
