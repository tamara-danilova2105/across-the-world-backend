module.exports.buildSortQuery = ({ sortOption }) => {
    const sortMap = {
        new: { createdAt: -1 },
        soon: { 'dates.date_start': 1 }, 
        cheaper: { 'dates.price.amount': 1 },
        expensively: { 'dates.price.amount': -1 },
        discount: { 'discount.percentage': -1 }, 
    }

    return sortMap[sortOption] || {}
}
