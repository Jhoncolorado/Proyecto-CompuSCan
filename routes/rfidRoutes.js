const express = require('express');
const router = express.Router();
const rfidController = require('../controllers/rfidController');

// Rutas para rfid
router.get('/', rfidController.getAllRfids);
router.get('/:id', rfidController.getRfidById);
router.post('/', rfidController.createRfid);
router.put('/:id', rfidController.updateRfid);
router.delete('/:id', rfidController.deleteRfid);

module.exports = router;