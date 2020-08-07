const sumArray = require('./sumArray')

test("default test true", () => {
    expect(true).toBeTruthy();
})
test('sums values in an array', () => {
    const arraySum1 = sumArray([1,2,3,4]);
    console.log(typeof arraySum1);
    expect(arraySum1).toBe(10);
})
test('sums negative values properly', () => {
    const arraySum1 = sumArray([-1,-2,3,4]);
    console.log(typeof arraySum1);
    expect(arraySum1).toBe(4);
})
test('sums zero values properly', () => {
    const arraySum1 = sumArray([0,0,0,5,-5,4]);
    console.log(typeof arraySum1);
    expect(arraySum1).toBe(4);
})


