const getPagintionDetails = (pageNumber, pageSize) => {

    let offset = ((pageNumber-1)*pageSize);
    let limit = pageSize;
    let subQuery = false;
    return {
        offset,
        limit,
        subQuery
    };
};

module.exports = {
    getPagintionDetails
};