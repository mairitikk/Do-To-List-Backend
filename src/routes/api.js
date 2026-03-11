const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const { generateId } = require("../helpers/utils");
const { checkToken, checkRole } = require("../middlewares/auth");

// Multer config for photo uploads
const storage = multer.diskStorage({
  destination: path.join(__dirname, "..", "..", "uploads"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${generateId()}${ext}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

// Controllers
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const galleryController = require("../controllers/galleryController");
const eventController = require("../controllers/eventController");
const photoController = require("../controllers/photoController");
const orderController = require("../controllers/orderController");
const settingsController = require("../controllers/settingsController");
const termsController = require("../controllers/termsController");
const visitController = require("../controllers/visitController");
const userEventController = require("../controllers/userEventController");

// Auth
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.post("/auth/confirm-email", authController.confirmEmail);

// Users
router.get("/users/me", checkToken, userController.getMe);
router.get(
  "/users",
  checkToken,
  checkRole("admin", "photographer"),
  userController.getAll,
);
router.get(
  "/users/role/:role",
  checkToken,
  checkRole("admin"),
  userController.getByRole,
);
router.post("/users/by-ids", checkToken, userController.getByIds);
router.put("/users/:id", checkToken, userController.update);
router.delete(
  "/users/:id",
  checkToken,
  checkRole("admin", "photographer"),
  userController.delete,
);

// Galleries
router.get("/galleries", checkToken, galleryController.getAll);
router.get("/galleries/:id", checkToken, galleryController.getById);
router.post(
  "/galleries",
  checkToken,
  checkRole("admin", "photographer"),
  galleryController.create,
);
router.put(
  "/galleries/:id",
  checkToken,
  checkRole("admin", "photographer"),
  galleryController.update,
);
router.delete(
  "/galleries/:id",
  checkToken,
  checkRole("admin", "photographer"),
  galleryController.delete,
);

// Events
router.get("/events", checkToken, eventController.getAll);
router.get("/events/token/:token", eventController.getByToken);
router.get("/events/:id", checkToken, eventController.getById);
router.post(
  "/events/by-gallery-ids",
  checkToken,
  eventController.getByGalleryIds,
);
router.post(
  "/events",
  checkToken,
  checkRole("admin", "photographer"),
  eventController.create,
);
router.put(
  "/events/:id",
  checkToken,
  checkRole("admin", "photographer"),
  eventController.update,
);
router.delete(
  "/events/:id",
  checkToken,
  checkRole("admin", "photographer"),
  eventController.delete,
);
router.post(
  "/events/cleanup",
  checkToken,
  checkRole("admin", "photographer"),
  eventController.cleanup,
);

// Photos
router.get("/photos/event/:eventId", photoController.getByEvent);
router.get("/photos", checkToken, photoController.getAll);
router.post("/photos/count", checkToken, photoController.countByEventIds);
router.post(
  "/photos/upload",
  checkToken,
  upload.array("photos", 100),
  photoController.upload,
);
router.post("/photos/bulk", checkToken, photoController.bulkCreate);
router.put("/photos/:id", checkToken, photoController.update);
router.delete("/photos/:id", checkToken, photoController.delete);
router.post("/photos/bulk-delete", checkToken, photoController.bulkDelete);

// Orders
router.get("/orders", checkToken, orderController.getAll);
router.get("/orders/:id", checkToken, orderController.getById);
router.get("/orders/email/:email", checkToken, orderController.getByEmail);
router.post("/orders", orderController.create);
router.put("/orders/:id", checkToken, orderController.update);

// Settings
router.get("/settings", settingsController.getAll);
router.get("/settings/:id", settingsController.getById);
router.get(
  "/settings/owner/:ownerId",
  checkToken,
  settingsController.getByOwner,
);
router.get("/settings/branch/:branchName", settingsController.getByBranch);
router.put("/settings/:id", checkToken, settingsController.update);
router.post("/settings", checkToken, settingsController.save);

// Terms
router.get("/terms", termsController.get);
router.get("/terms/:id", termsController.get);
router.put("/terms", checkToken, termsController.save);

// Visits
router.post("/visits", visitController.record);
router.post("/visits/by-event-ids", checkToken, visitController.getByEventIds);

// User Events
router.get(
  "/user-events/user/:userId",
  checkToken,
  userEventController.getByUser,
);
router.post(
  "/user-events/by-event-ids",
  checkToken,
  userEventController.getByEventIds,
);
router.get("/user-events/check", checkToken, userEventController.check);
router.post("/user-events", checkToken, userEventController.create);
router.post(
  "/user-events/bulk-delete",
  checkToken,
  userEventController.bulkDelete,
);

module.exports = router;
