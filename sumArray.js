function sumArray(arrData) {
    var total = 0;
    for (var i = 0; i < arrData.length; i++){
        total += arrData[i];
    }
    return total;
}

module.exports = sumArray 