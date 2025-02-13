module.exports.buildFilterQuery = (filters) => {
    const query = {};

    if (!filters || typeof filters !== 'object') {
        return query;
    }

    if (filters.type_tour) {
        const types = Object.keys(filters.type_tour).filter(key => filters.type_tour[key]);
        if (types.length) {
            query.types = { $in: types };
        }
    }

    if (filters.region) {
        const regions = Array.isArray(filters.region)
            ? filters.region
            : [filters.region];
        query.regions = { $in: regions };
    }

    if (filters.price && Array.isArray(filters.price)) {
        const [minPrice, maxPrice] = filters.price;
        query['dates.price.amount'] = { $gte: minPrice, $lte: maxPrice };
    }

    if (filters.dates && filters.dates.startDate) {
        const startDate = new Date(filters.dates.startDate)
        const endDate = filters.dates.endDate ? new Date(filters.dates.endDate) : null;

        if (endDate) {
            query['dates'] = {
                $elemMatch: {
                    date_start: { $lte: endDate },
                    date_finish: { $gte: startDate }
                }
            }
            // жесткий вариант фильтрации по датам

            // query['dates'] = {
            //     $elemMatch: {
            //         date_start: { $gte: startDate },
            //         date_finish: { $lte: endDate }
            //     }
            // } 
        } else {
            query['dates'] = {
                $elemMatch: {
                    date_start: { $gte: startDate }
                }
            }
        }
    }

    return query;
}

module.exports.filterToursByDuration = (tours, duration) => {
    if (!duration || !Array.isArray(duration)) {
        return tours
    }

    const [minDuration, maxDuration] = duration;

    return tours.filter(tour => {
        return tour.dates.some(date => {
            const startDate = new Date(date.date_start)
            const endDate = new Date(date.date_finish)
            const durationInDays = (endDate - startDate) / (1000 * 60 * 60 * 24)
            return durationInDays >= minDuration && durationInDays <= maxDuration
        })
    })
}

