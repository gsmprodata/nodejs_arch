const jwtActual = require("jsonwebtoken");
const hackathonService = require("../services/hackathon");

const getAll = (req, res, next) => {
    hackathonService
        .getAll()
        .then(h => {
            res.json({ h });
        })
        .catch(err => res.status(400).json(err));
};

const create = (req, res, next) => {
    let { imgUrl, title, shortDesc, coverImageUrl } = req.body;
    hackathonService.create({ imgUrl, title, shortDesc, coverImageUrl })
        .then(() => {
            getAll();
        })
        .catch(err => res.status(400).json(err));
};

module.exports = {
    create,
    getAll,
    // getById,
    // update,
    // remove,
    // register
};