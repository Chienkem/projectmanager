
const pagination = (query, defaultSize=250)=>{
    const {page, size} = query;
    let limit = (size && size < defaultSize) ? Number(size): defaultSize;
    const offset = page > 0 ? (parseInt(page) - 1) * limit : 0;
    if(limit > 250) limit = 250;
    return {limit, offset};
}

module.exports = {
    pagination
};