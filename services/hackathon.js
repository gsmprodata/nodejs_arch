require("babel-polyfill");
const Hackathon = require("../models/hackathon");

const create = async (h) => {
    // TODO
    const hackathon = new Hackathon(h);
    h.save();
};

const update = () => {
    // TODO
};

const getAll = async () => {
    return await Hackathon.find().select("-createdAt -updatedAt -id -__v");
};

const getById = async (id) => {
    return await Hackathon.findById(id).select("-createdAt -updatedAt -id -__v");
};

const _delete = () => {
    // TODO
};

module.exports = {
    create,
    update,
    getAll,
    getById,
    _delete
};