const express = require('express')
const multer = require('multer')
const fs = require("fs")
const path = require("path")
const app = express()
const port = 4000

// 定义文件保存位置
const upload = multer({
  // dest: './public/tmp',
  fileFilter(req, file, callback) {
    // latin1 编码解决中文乱码
    file.originalname = /^[a-zA-Z0-9]+$/.test(file.originalname)
      ? file.originalname
      : Buffer.from(file.originalname, "latin1").toString(
        "utf8"
      );
    callback(null, true);
  },
  storage: multer.diskStorage({
    //上传文件路径
    destination: path.join('./public/tmp/'),
    //上传文件名
    filename: function (req, file, cb) {
      cb(null, decodeURI(file.originalname))
    }
  })
})

// 图片后缀
const picAppendNameSet = new Set(["jpg", "jpeg", "png", "gif", "psd", "raw", "svg"])

// 跨域
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Content-Type', 'application/json;charset=utf-8');
  next();
});

// 文件上传接口
app.post('/upload/:path', upload.single('file'), (req, res) => {
  // 文件名
  const fileName = req.file.originalname
  // 后缀名
  const AppendName = fileName.split(".")[1]


  // 图片放到图片文件夹中，其他留在tmp文件夹中
  if (req.params.path === "images" && picAppendNameSet.has(AppendName)) {
    fs.rename(req.file.path, `./public/${req.params.path}/${fileName}`, err => {
      if (err) throw err
    })
  }

  res.json({
    msg: 'success'
  })

})

// 静态资源
app.use(express.static('public'))

// 开启服务
app.listen(port, () => {
  console.log(`主页服务已启动`)
})
