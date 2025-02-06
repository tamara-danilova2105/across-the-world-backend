
module.exports.buildFilterQuery = ({filters}) => {
    const query = {};

    if (!filters || typeof filters !== 'object') {
        return query;
    }

    if (filters.type_tour) {
        const types = Object.keys(filters.type_tour).filter(key => filters.type_tour[key])
        if (types.length > 0) {
            query["type_tour.value"] = { $in: types }
        }
    }

    if (filters.region) {
        const regions = Object.keys(filters.region).filter(key => filters.region[key])
        if (regions.length > 0) {
            query["region"] = { $in: regions } 
        }
    }

    if (filters.date) {
        const dates = Object.keys(filters.date).filter(key => filters.date[key])
        if (dates.length > 0) {
            query["date"] = { $in: dates }
        }
    }

    if (filters.price && Array.isArray(filters.price)) {
        const [minPrice, maxPrice] = filters.price;
        if (minPrice !== undefined && maxPrice !== undefined) {
            query.price = { $gte: minPrice, $lte: maxPrice }
        }
    }

    if (filters.duration && Array.isArray(filters.duration)) {
        const [minDuration, maxDuration] = filters.duration;
        if (minDuration !== undefined && maxDuration !== undefined) {
            query.duration = { $gte: minDuration, $lte: maxDuration }
        }
    }

    return query
}
