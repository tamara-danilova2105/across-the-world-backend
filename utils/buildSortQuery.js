module.exports.buildSortQuery = ({sortOption}) => {
    const sortMap = {
        new: { createdAt: -1 }, 
        soon: { date_start: 1 },       
        cheaper: { amount: 1 },        
        expensively: { amount: -1 },    
        discount: { discount: -1 },  
    }

    return sortMap[sortOption] || {}
}