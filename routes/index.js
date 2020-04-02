const Router = require("koa-router");
const router = new Router();
const koaBody = require("koa-body");
const path = require("path");

const controllerAdmin = require("../controllers/admin");
const controllerLogin = require("../controllers/login");
const controllerHome = require("../controllers/home");

router.get("/", controllerHome.get);
router.post("/", koaBody(), controllerHome.post);
router.get("/login", controllerLogin.get);
router.post("/login", koaBody(), controllerLogin.post);
router.get("/admin", controllerAdmin.get);
router.post(
    "/admin/upload",
    koaBody({
        multipart: true,
        formidable: {
            uploadDir: path.join(process.cwd(), "public", "upload")
        }
    }),
    controllerAdmin.setItem
);
router.post("/admin/skills", koaBody(), controllerAdmin.setSkills);

module.exports = router;
