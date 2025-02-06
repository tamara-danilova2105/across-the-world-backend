
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
        const regions = Object.keys(filters.region.regions).filter(key => filters.region.regions[key])
        const countries = Object.keys(filters.region.country).filter(key => filters.region.country[key])
        if (regions.length > 0 || countries.length > 0) {
            query.$or = [
                { "region.regions.value": { $in: regions } },
                { "region.country.value": { $in: countries } }
            ];
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
