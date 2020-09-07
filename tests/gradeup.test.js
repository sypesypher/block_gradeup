//How to run the tests: npx jest test --watchAll
//from the top level directory
//npx test jest --watchAll --verbose false

let grades = [
    {
        itemname: "HW1",
        weight: 5,
        score: 0.7,
        originalScore: 0.7,
        averageScore: 0.8,
        due: 1592352000
        },
        {itemname: "Hw2",weight: 7.3333333,score: 0.7,originalScore: 0.7,averageScore: 0.8,due: 1592352000
        },
        {itemname: "Exam2",weight: 17.666666,score: 0.7,originalScore: 0.7,averageScore: 0.85465,due: 1595808000
        },
        {itemname: "Hw3",weight: 5,score: 0.7,originalScore: 0.7,averageScore: 0.8,due: 1597536000
        },
        {itemname: "Hw4",weight: 5,score: 0.7,originalScore: 0.7,averageScore: 0.8,due: 1597795200
        },
        {itemname: "Exam1",weight: 20,score: 0.7,originalScore: 0.7,averageScore: 0.8,due: 1599004800
        },
        {itemname: "Hw5",weight: 5,score: 0.7,originalScore: 0.7,averageScore: 0.8,due: 1600128000
        },
        {itemname: "Hw6",weight: 5,score: 0.7,originalScore: 0.7,averageScore: 0.8,due: 1602892800
        },
        {itemname: "Missing1",weight: 15,score: null,originalScore: null,averageScore: null,due: 1604966400
        },
        {itemname: "Missing2"
        ,weight: 15,
        score: null,
        originalScore: null,
        averageScore: null,
        due: 1606867200
        }
        ];

function drawAssignment(x, y, data, scale, draw,index,showAll=true) {
    let x1 = x;
    let y1 = y;
    let x2 = x1 + (data[index].weight * scale/100);
    let y2 = y1 - (data[index].score * data[index].weight)*scale/100;
    let lineString = `${x1},${scale} ${x1},${y1} ${x2},${y2} ${x2},${scale}`;
	/*
	let p = draw.polygon(lineString);
    p.stroke({color: 'darkblue', width: 1});
    p.fill('blue');
    p.opacity(.5);
    p.addClass('gradeStuff');
    var text;
    p.click(function() {
        console.log("onclick drawassignment");
        
        var grade = prompt(promptString, "");
        if (grade == null || grade == "" || isNaN(grade)) {
            console.log("User abandoned what-if");
        } else {
            let whatif = Number(grade);
            if (whatif > 1) {
                whatif = whatif/100; //convert to a decimal
            }
            
            data[index].score =  whatif;
            var list = SVG.find('.gradeStuff');
            list.remove();
            var list2 = SVG.find('.projectionStuff');
            list2.remove();
            var list3 = SVG.find('.temp')
            list3.remove();
            //var list2 = SVG.find('.finalGradeStuff')
            list2.remove();
            drawAssignments(scale,draw,data,showAll);
        }
    });
    p.mouseover(function() {
        var list = SVG.find('.projectionText')
        list.remove();
        var list2 = SVG.find('.finalGradeStuff')
        //list2.remove();
        
        p.fill('grey');
        let grade = (data[index].score);
        let weight = (data[index].weight).toPrecision(3);
        let average = (data[index].averageScore);
        text = draw.text(gradeString + ": " + grade*100 +"%, "+  weightString + ": " + weight + "%, "+ averageString + ": " + average*100 + "%");
        text.x(scale*1.1);
        text.y(0);
        text.addClass('temp');
        text.font({
            size: scale/25
        })
    });
    p.mouseout(function() {
        p.fill('blue');
        var list = SVG.find('.temp')
        list.remove();
    });
	*/
    return { xs: x2, ys: y2 };
}   
function drawPrediction(x, y, data, scale, draw, percentage) { //This could probably be done better, but works 
	var x1 = x;
	var y1 = y;
	var x3 = 0;//end of valid data start point
	var y3 = 0;
	var x4 = x; //your max score end ling point
	var y4 = y;
	var startPointFound = false;
	
	for (let i=0; i<data.length; i++) {
		if (data[i].score != null){
			var x2 = x1 + (data[i].weight * scale/100);
			var y2 = y1 - (data[i].score * data[i].weight)*scale/100;
			x4 = x2;
			y4 = y2;
		} else {
			//console.log("null value found")
			var x2 = x1
			var x4 = scale;
			var y4 = y1 - (scale-x2);
			
			if (!startPointFound){
				x3 = x1;
				y3 = y1;
				startPointFound = true;
			}
			
			var x5 = scale;
			var y5 = y1 - ((y3-y4)*percentage);
			//console.log("drawprediction percentage passed in: " + percentage);
		}
		x1 = x2;
		y1 = y2;
		if (startPointFound) {
			break;
		}
		
	} 
	/*
	if (startPointFound) {
		let MaxLine = draw.polyline([[x3,y3],[x4,y4],[x4,y3]]);
		MaxLine.stroke({color: 'yellow', width: 2});
		MaxLine.back();
		MaxLine.opacity(.5)
		MaxLine.fill("orange")
		MaxLine.addClass('gradeStuff');
		MaxLine.mouseover(function() {
			//remove the old one if there
			var list = SVG.find('.projectionText')
			list.remove();
		
			MaxLine.fill('grey');
			let maxGrade = 1 - y4/scale;
			text = draw.text(maxGradeString + ": " + (maxGrade*100).toPrecision(3) + "%");
			text.x(scale*1.1);
			text.y(0);
			text.addClass('projectionText');
			text.font({
				size: scale/25
			})
			
			let projection = 1- y5/scale;
			text = draw.text(projectionGradeString + ": " + (projection*100).toPrecision(3) + "%");
			text.x(scale*1.1);
			text.y(scale/25);
			text.addClass('projectionText');
			text.font({
				size: scale/25
			})
			
			let minimum = 1 - y3/scale;
			text = draw.text(legendMinString + ": " + (minimum*100).toPrecision(3) + "%");
			text.x(scale*1.1);
			text.y(scale*2/25);
			text.addClass('projectionText');
			text.font({
				size: scale/25
			})
		});
		MaxLine.mouseout(function() {
			MaxLine.fill('orange');
		});
		
		let predictionLine = draw.line(x3,y3,x5,y5).stroke({color: 'blue', width: 2, dasharray: '5,5'});
		predictionLine.addClass('gradeStuff');
	}
	*/

	return { xs: x1, ys: y1 };

}

function drawAverageGrades(x, y, data, scale, draw,index,showAll) {
	let x1 = x;
	let y1 = y;
	let x2 = x1 + (data[index].weight * scale/100);
	let y2 = y1 - (data[index].averageScore * data[index].weight)*scale/100;
	let lineString = `${x1},${scale} ${x1},${y1} ${x2},${y2} ${x2},${scale}`;
	/*
	if (data[index].averageScore != null) {
		let p = draw.polygon(lineString);
		p.addClass("gradeStuff");
		p.stroke({color: 'darkblue', width: 1});
		p.fill('lightblue');
		p.opacity(.5);
		if (showAll) {
			p.click(function() {
				console.log("onclick drawAverageGrades");
				var grade = prompt(promptString, '%');
				if (grade == null || grade == "" || isNaN(grade)) {
					console.log("User abandoned what-if/didn't enter a valid number");
				} else {
					console.log("user entered: " + grade);
					let whatif = Number(grade);
					if (whatif > 1) {
						whatif = whatif/100; //convert to a decimal
					}
					
					data[index].score =  whatif;
					var list = SVG.find('.gradeStuff');
					list.remove();
					var list2 = SVG.find('.projectionStuff');
					list2.remove();
					var list3 = SVG.find('.temp')
					list3.remove();
					drawAssignments(scale, draw,data,showAll);
				}
				});
		}
		p.mouseover(function() {
			var list = SVG.find('.projectionText')
			list.remove();
			
			p.fill('grey');
			let grade = (data[index].score);
			let weight = (data[index].weight).toPrecision(3);
			let average = (data[index].averageScore);
			if (showAll){
				text = draw.text(gradeString + ": " + grade*100 +"%, "+  weightString + ": " + weight + "%, "+ averageString + ": " + average*100 + "%");
			} else {
				text = draw.text(weightString + ": " + weight + "%, "+ averageString + ": " + average*100 + "%");
			}
			text.x(scale*1.1);
			text.y(0);
			text.addClass('temp');
			text.font({
				size: scale/25
			})
		});
		p.mouseout(function() {
			p.fill('lightblue');
			var list = SVG.find('.temp')
			list.remove();
		});
		
		
	}

	draw.line(x1 + (x2-x1)/2 ,scale,x1 + (x2-x1)/2,scale+10).stroke({color: 'blue', width: 1, linecap: 'round'})
			var title = draw.text(data[index].itemname);
			title.addClass("gradeStuff");
			title.x(x1 + (x2-x1)/4);
            title.y(scale+20);
			title.rotate(40);
	*/		
	return { xs: x2, ys: y2 };
}

//copy of all Lang Strings
    let promptString = 'Please enter a What-IF Grade';
    let gradeString = 'Grade';
    let weightString = 'Weight';
    let averageString = 'Average';
    let maxGradeString = 'Max Grade';
    let projectionGradeString = 'Projection Grade';
    let legendMinString =  'Your Current/Min Grade';
    let legendAverageString = 'Class Average';
    let potentialGradeString = 'Your Potential/Max Grade';
    let predictedGradeString = 'Your Predicted Grade';
    let legendString = 'Legend';
    let resetButtonString = 'Reset Data';
    let heatMapString = 'Course Load Heatmap';
    let percentOfGradeString = 'Percent of Grade';
    let dueDateString = 'Due Date';
    let yourFinalGradeString = 'Your Final Grade';
    let classAverageOfAvailableData = 'Class Final Average';

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
let percentage = .5;

test("DrawAverageGrades Test1", () => {
    //expect(true).toBeTruthy();
	let {xs, ys} =drawAverageGrades(x, y, data, scale, draw,index,showAll);
	let test1= (xs == 25);
	let test2= (ys == 80);
	expect(test1).toBeTruthy();
	expect(test2).toBeTruthy();
})

test("DrawAverageGrades Test2", () => {
    //expect(true).toBeTruthy();
	let {xs, ys} =drawAverageGrades(x, y, data, scale, draw,1,showAll);
	let test1= (Math.round(xs) == 37);
	let test2= (Math.round(ys) == 71);
	expect(test1).toBeTruthy();
	expect(test2).toBeTruthy();
})

test("DrawAverageGrades Test3", () => {
    //expect(true).toBeTruthy();
	let {xs, ys} =drawAverageGrades(x, y, data, scale, draw,5,showAll);
	let test1= (Math.round(xs) == 100);
	let test2= (Math.round(ys) == 20);
	expect(test1).toBeTruthy();
	expect(test2).toBeTruthy();
})

test("DrawAverageGrades Test4", () => {
    //expect(true).toBeTruthy();
	let {xs, ys} =drawAverageGrades(x, y, data, scale, draw,6,showAll);
	let test1= (Math.round(xs) == 25);
	let test2= (Math.round(ys) == 80);
	expect(test1).toBeTruthy();
	expect(test2).toBeTruthy();
})

test("DrawAssignment Test1", () => {
    //expect(true).toBeTruthy();
	let {xs, ys} =drawAssignment(0, 200, data, scale, draw,0,showAll);
	let test1= (Math.round(xs) == 25);
	let test2= (Math.round(ys) == 183);
	expect(test1).toBeTruthy();
	expect(test2).toBeTruthy();
})

test("DrawAssignment Test2", () => {
    //expect(true).toBeTruthy();
	let {xs, ys} =drawAssignment(50, 89, data, scale, draw,7,showAll);
	let test1= (Math.round(xs) == 75);
	let test2= (Math.round(ys) == 72);
	expect(test1).toBeTruthy();
	expect(test2).toBeTruthy();
})

test("DrawAssignment Test3", () => {
    //expect(true).toBeTruthy();
	let {xs, ys} =drawAssignment(0, 200, data, scale, draw,5,showAll);
	let test1= (Math.round(xs) == 100);
	let test2= (Math.round(ys) == 130);
	expect(test1).toBeTruthy();
	expect(test2).toBeTruthy();
})

test("DrawAssignment Test4", () => {
    //expect(true).toBeTruthy();
	let {xs, ys} =drawAssignment(0, 100, data, scale, draw,3,showAll);
	let test1= (Math.round(xs) == 25);
	let test2= (Math.round(ys) == 83);
	expect(test1).toBeTruthy();
	expect(test2).toBeTruthy();
})

test("DrawAssignment Test5", () => {
    //expect(true).toBeTruthy();
	let {xs, ys} =drawAssignment(0, 300, data, scale, draw,0,showAll);
	let test1= (Math.round(xs) == 25);
	let test2= (Math.round(ys) == 283);
	expect(test1).toBeTruthy();
	expect(test2).toBeTruthy();
})

test("DrawPrediction Test0", () => {
    //expect(true).toBeTruthy();
	let {xs, ys} =drawPrediction(x, y, data, scale, draw, percentage);
	let test1= (Math.round(xs) == 350);
	let test2= (Math.round(ys) == -145);
	expect(test1).toBeTruthy();
	expect(test2).toBeTruthy();
})

test("DrawPrediction Test1", () => {
    //expect(true).toBeTruthy();
	let {xs, ys} =drawPrediction(50, 80, data, scale, draw, percentage);
	let test1= (Math.round(xs) == 400);
	let test2= (Math.round(ys) == -165);
	expect(test1).toBeTruthy();
	expect(test2).toBeTruthy();
})

test("DrawPrediction Test2", () => {
    //expect(true).toBeTruthy();
	let {xs, ys} =drawPrediction(80, 200, data, scale, draw, percentage);
	let test1= (Math.round(xs) == 430);
	let test2= (Math.round(ys) == -45);
	expect(test1).toBeTruthy();
	expect(test2).toBeTruthy();
})

test("DrawPrediction Test3", () => {
    //expect(true).toBeTruthy();
	let {xs, ys} =drawPrediction(0, 0, data, scale, draw, percentage);
	let test1= (Math.round(xs) == 350);
	let test2= (Math.round(ys) == -245);
	expect(test1).toBeTruthy();
	expect(test2).toBeTruthy();
})

test("DrawPrediction Test4", () => {
    //expect(true).toBeTruthy();
	let {xs, ys} =drawPrediction(1000, 1000, data, 700, draw, percentage);
	let test1= (Math.round(xs) == 1490);
	let test2= (Math.round(ys) == 657);
	expect(test1).toBeTruthy();
	expect(test2).toBeTruthy();
})

test("DrawPrediction Test5", () => {
    //expect(true).toBeTruthy();
	let {xs, ys} =drawPrediction(x, y, data, 100, draw, percentage);
	let test1= (Math.round(xs) == 70);
	let test2= (Math.round(ys) == 51);
	expect(test1).toBeTruthy();
	expect(test2).toBeTruthy();
})