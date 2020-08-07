const sumArray = require('../gradeupjs/heatmap.js')

test("default test true", () => {
    expect(true).toBeTruthy();
})

test('sums values in an array', () => {
    const arraySum1 = sumArray([1,2,3,4]);
    console.log(typeof arraySum1);
    expect(arraySum1).toBe(10);
})
