const { selectTopics } = require('../Models/topics.model.js');


exports.getAllTopics = async (request, response, next) => {
    try {
        const topics = await selectTopics();
        response.status(200).json({ topics });
    } catch (error) {
        console.error("Error getting topics:", error);
        if(response) {response.status(500).json({ error: "Internal Server Error" });}
        next(error);
    }
};