const exampleModel = require('../models/exampleModel');

const exampleController = {
    getExample: async (req, res) => {
        try {
            const data = await exampleModel.getExampleData();
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener los datos' });
        }
    },
};

module.exports = exampleController;