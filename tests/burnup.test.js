//How to run the tests: npx jest test --watchAll
//from the top level directory

const burnup = require('../gradeupjs/burnup.js');
const grades = require('../gradeupjs/grades2.js');
const svgjs = require('./svgjs/svg.js');

test("default test true", () => {
    expect(true).toBeTruthy();
})


let data = grades;
let x = 0;
let y = 100
let scale = 500;
var draw = new svgjs.SVG();
let index = 0;
let showAll = false;

test("drawAverage test", () => {
    //expect(true).toBeTruthy();
    burnup.drawAverageGrades(x, y, data, scale, draw,index,showAll);
})

test("drawPrediction test", () => {
    //expect(true).toBeTruthy();
    burnup.drawPrediction(x, y, data, scale, draw, percentage);
})

test("drawAssignment Calculations", () => {
    //expect(true).toBeTruthy();
    burnup.drawAssignment(x, y, data, scale, draw,index);
})