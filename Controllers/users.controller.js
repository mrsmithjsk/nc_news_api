const { getUsers } = require('../Models/users.model.js');

exports.getAllUsers = async (request,response,next) => {
    try {
        const users = await getUsers();
        response.status(200).json(users);
    } catch (error) {
        //('Error getting users:', error);
        next(error);
    }
}