module.exports.buildSortQuery = (sortOption) => {
    if (!sortOption || Object.keys(sortOption).length === 0) {
        return { createdAt: -1 };
    }

    switch (sortOption.option) {
        case 'new':
            return { createdAt: -1 };

        case 'soon':
            return { 'dates.0.date_start': 1 };

        case 'cheaper':
            return { 'dates.0.price.amount': 1 };

        case 'expensively':
            return { 'dates.0.price.amount': -1 };

        case 'discount':
            return { 'discount.percentage': -1 };

        default:
            return { createdAt: -1 }; 
    }
}