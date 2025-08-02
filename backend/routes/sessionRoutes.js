const express = require("express");
const sessionController = require("../controllers/sessionController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post('/create', protect, sessionController.createSession);
router.get('/:id', protect, sessionController.getSessionById);
router.get('/my-sessions', protect, sessionController.getMySessions); 
router.delete('/:id', protect, sessionController.deleteSession);

module.exports = router;
