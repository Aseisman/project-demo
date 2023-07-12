const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const Router = require("koa-router");
const multer = require("@koa/multer");
const cors = require("koa-cors");
const app = new Koa();
const router = new Router();

// 处理文件上传的中间件
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads"); // 指定上传文件的存储目录
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // 指定上传文件的文件名
  },
});
const upload = multer({ storage });

// 使用koa-body中间件来解析请求体
app.use(bodyParser());
app.use(
  cors({
    origin: function (ctx) {
      // if (ctx.url === '/api/user/login') {
      //     return "*"; // 允许来自所有域名请求
      // }
      return "*";
    },
    exposeHeaders: ["WWW-Authenticate", "Server-Authorization"],
    maxAge: 5,
    credentials: true,
    allowMethods: ["GET", "POST", "DELETE"],
    allowHeaders: ["Content-Type", "Authorization", "Accept"],
  })
);

// 处理文件上传的路由
router.post("/upload", upload.single("file"), async (ctx) => {
  const file = ctx.file; // 获取上传的文件对象
  // 进行相应的处理，比如保存文件信息到数据库等
  console.log(file);
  ctx.body = {
    data: file.path,
  };
});

// 注册路由
app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => {
  console.log("服务已启动,监听端口3000");
});
