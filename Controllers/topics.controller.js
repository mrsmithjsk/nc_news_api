const { selectTopics } = require('../Models/topics.model.js');
const fs = require('fs/promises');


exports.getAllTopics = async (request, response, next) => {
    try {
        const topics = await selectTopics();
        response.status(200).json({ topics });
    } catch (error) {
        console.error("Error getting topics:", error);
        next(error);
    }
};

exports.getAllEndPoints = async (request, response, next) => {
    try {
        const endPointsData = await fs.readFile('./endpoints.json', 'utf-8');
        const parsedEndPoints = JSON.parse(endPointsData);
        response.status(200).json(parsedEndPoints );
    } catch (error) {
        console.error("Error getting endpoints:", error);
        next(error);
    }
}