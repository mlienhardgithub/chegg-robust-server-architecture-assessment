//{ mergeParams: true } gets the noteId req param
const router = require("express").Router({ mergeParams: true });
const controller = require("./uses.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

//const pastesRouter = require("../pastes/pastes.router");
//router.use("/:userId/pastes", controller.userExists, pastesRouter);

router.route("/")
    .get(controller.list)
    //.post(controller.create)
    .all(methodNotAllowed);

router.route("/:useId")
    .get(controller.read)
    //.put(controller.update)
    .delete(controller.delete)
    .all(methodNotAllowed);

module.exports = router;
