const express = require('express');
const router = express.Router();
const carnetController = require('../controllers/carnetController');

router.get('/', carnetController.getAllCarnets);
router.get('/:id', carnetController.getCarnetById);
router.post('/', carnetController.createCarnet);
router.put('/:id', carnetController.updateCarnet);
router.delete('/:id', carnetController.deleteCarnet);

module.exports = router;