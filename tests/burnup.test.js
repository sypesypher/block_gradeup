//How to run the tests: npx jest test --watchAll
//from the top level directory

//var burnup = require('../gradeupjs/burnup');
//var grades = require('../gradeupjs/grades2');

import * as burnup from "../gradeupjs/burnup";
import * as grades from "../gradeupjs/grades2";

jest.mock("../gradeupjs/burnup.js");


test("default test true", () => {
    expect(true).toBeTruthy();
})


let data = grades;
let x = 0;
let y = 100 
let scale = 500;
var draw = "notdefined";
let index = 0;
let showAll = false;

test("drawAverage test", () => {
    //expect(true).toBeTruthy();
    drawAverageGrades(x, y, data, scale, draw,index,showAll);
})

test("drawPrediction test", () => {
    //expect(true).toBeTruthy();
    burnup.drawPrediction(x, y, data, scale, draw, percentage);
})

test("drawAssignment Calculations", () => {
    //expect(true).toBeTruthy();
    burnup.drawAssignment(x, y, data, scale, draw,index);
})