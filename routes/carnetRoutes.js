const express = require('express');
const router = express.Router();
const carnetController = require('../controllers/carnetController');


router.get('/:id', carnetController.getCarnet);
router.put('/:id', carnetController.updateCarnet);

module.exports = router;