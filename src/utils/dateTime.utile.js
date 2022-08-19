const addHours = function(numOfHours, date = new Date()) {
   
    return date.getTime() + numOfHours * 60 * 60 * 1000;
}

module.exports = {
    addHours
}