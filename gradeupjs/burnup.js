 // This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Gradeup Block.
 *
 * @package   block_gradeup
 * @author    Chris Strothman	<cstrothman@southern.edu>
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
 
/**
 * burnup.js
 * This file contains all of the code needed to draw the burnup chart.
 * 
 */

 function drawAssignment(x, y, data, scale, draw,index) {
            let x1 = x;
            let y1 = y;
            let x2 = x1 + (data[index].weight * scale/100);
            let y2 = y1 - (data[index].score * data[index].weight)*scale/100;
            let lineString = `${x1},${scale} ${x1},${y1} ${x2},${y2} ${x2},${scale}`;
            let p = draw.polygon(lineString);
            p.stroke({color: 'darkblue', width: 1});
            p.fill('blue');
            p.opacity(.5);
			p.addClass('gradeStuff');
			var text;
            p.click(function() {
				console.log("onclick drawassignment");
				
				var grade = prompt(promptString, "%");
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
					drawAssignments(scale,draw,data);
				}
            });
			p.mouseover(function() {
				var list = SVG.find('.projectionText')
				list.remove();
				
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

            draw.line(x1 + (x2-x1)/2 ,scale,x1 + (x2-x1)/2,scale+10).stroke({color: 'blue', width: 1, linecap: 'round'})
			var title = draw.text(data[index].itemname);
			title.addClass("gradeStuff");
			title.x(x1 + (x2-x1)/4);
            title.y(scale+20);
            title.rotate(40);
            
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
	if (startPointFound) {
		let MaxLine = draw.polyline([[x3,y3],[x4,y4],[x4,y3]]);
		MaxLine.stroke({color: 'yellow', width: 2, /**dasharray: '5,5'**/});
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
}

function drawAverageGrades(x, y, data, scale, draw,index) {
	let x1 = x;
	let y1 = y;
	let x2 = x1 + (data[index].weight * scale/100);
	let y2 = y1 - (data[index].averageScore * data[index].weight)*scale/100;
	let lineString = `${x1},${scale} ${x1},${y1} ${x2},${y2} ${x2},${scale}`;
	if (data[index].averageScore != null) {
		let p = draw.polygon(lineString);
		p.addClass("gradeStuff");
		p.stroke({color: 'darkblue', width: 1});
		p.fill('lightblue');
		p.opacity(.5);
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
				drawAssignments(scale, draw,data);
			}
			});
		p.mouseover(function() {
			var list = SVG.find('.projectionText')
			list.remove();
			
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
			p.fill('lightblue');
			var list = SVG.find('.temp')
			list.remove();
		});
	}
	
	return { xs: x2, ys: y2 };
}

function drawText(x,y,message,fontsize,draw){
	var text = draw.text(message);
	text.x(x);
	text.y(y);
	text.font({
		size: fontsize
	})
}

function drawLegend(scale,draw,fontsize) {
	let x = 10;
	let y = 0;
	legendwidth = scale*.55;
	//border around the legend
	var border = draw.polyline([[x-10,y], [x+legendwidth,y], [x+legendwidth,y + scale/3], [x-10,y+scale/3], [x-10,y]]);
	border.stroke({color: 'gold', width: 3});
	border.fill('none');
	
	//Label "Legend
	y = 5;
	drawText(x,y,legendString,fontsize*1.4,draw);
	let underLine = draw.line([[x-10,y+fontsize*2],[x+legendwidth,y+fontsize*2]]).stroke({color: 'gold', width: 2});
	
	//Your Grades/Minimum
	y = (fontsize*2.6);
	var YourGrade = draw.polyline([[x,y], [x+scale/12,y], [x+scale/12,y + scale*.04], [x,y + scale*.04], [x,y]]).fill('blue');
	drawText(x+scale/12+10,y-scale/120, legendMinString , fontsize, draw);
	
	//Class Average Grades
	y = y + scale/20;
	var averageGrade = draw.polyline([[x,y], [x+scale/12,y], [x+scale/12,y + scale*.04], [x,y + scale*.04], [x,y]]).fill('lightblue');
	averageGrade.stroke({color: 'darkblue', width: 1});
	drawText(x+scale/12+10,y-scale/120,legendAverageString, fontsize, draw);
	
	//Your Potential/Max Grade
	y = y + scale/20;
	var potentialGrade = draw.polyline([[x,y], [x+scale/12,y], [x+scale/12,y + scale*.04], [x,y+scale*.04], [x,y]]).fill('orange');
	potentialGrade.stroke({color: 'yellow', width: 1});
	drawText(x+scale/12+10,y-scale/120,potentialGradeString, fontsize, draw);
	
	//Your Predicted Grade
	y = y + scale/20;
	let predictionLine = draw.line([[x,y+10],[x+scale/12,y+10]]).stroke({color: 'blue', width: 3, dasharray: '5,5'});
	drawText(x+scale/12+10,y-scale/120,predictedGradeString, fontsize, draw);
	
}

function drawAssignments(scale, draw, data){
	//Draw Average Student Grades
	let averageX = 0;
	let averageY = scale;
	for (let i=0; i<data.length; i++) {
		let {xs, ys} = drawAverageGrades(averageX, averageY, data, scale, draw,i);
		averageX=xs;
		averageY=ys;
	}

	//Draw Student's Current Grade
	let x = 0;
	let y = scale;
	let yourGrades = []; //assume no grades yet -> average of zero
	
	for (let i=0; i<data.length; i++) {
		let {xs, ys} = drawAssignment(x, y, data, scale, draw,i);
		if (data[i].score != null) {
			yourGrades.push(data[i].score);
		}
		x=xs;
		y=ys;
	}

	let predictX = 0;
	let predictY = scale;
	let averageGrade = yourGrades.reduce(function(a,b) {
		return a + b;
	}, 0);
	averageGrade = averageGrade / (yourGrades.length); 
	drawPrediction(predictX,predictY,data,scale,draw,averageGrade);
	
}
function drawChart(scale, svg,data){
	var draw = svg;
	var scale = scale;
	
	//draw the legend for the chart
	drawLegend(scale,draw,scale/25); //fontsize == 20
	
	let buttonx = 0;
	let buttony = scale/3 + scale/25;
	
	
	let button = draw.polygon([[0,buttony] , [scale/5, buttony], [scale/5, buttony + scale /15], [ 0, buttony + scale /15]]);
	button.fill('lightblue');
	button.click(function() {
			console.log("onclick reset button");
			for (let i=0; i<data.length; i++) {
				data[i].score = data[i].originalScore;
			}
			var list = SVG.find('.gradeStuff')
			list.remove();
			drawAssignments(scale, draw,data);
			
		});
	button.mouseover(function() {
		button.fill('grey');
	});
	button.mouseout(function() {
		button.fill('lightblue');
	});
	drawText(buttonx+ scale*.01,buttony-scale*.05, resetButtonString, scale/25, draw);
	
	
	
	var border = draw.polyline(`0,${scale} ${scale},${scale} ${scale},0 0,${scale}`);
	border.stroke({color: 'grey', width: 2});
	border.fill('none');
	var lineAGrade = draw.line(scale*.9, scale/10, scale, scale/10).stroke({ color: '#3399ff', width: 1, linecap: 'round' });
	var lineBGrade = draw.line(scale*.8, scale*2/10, scale, scale*2/10).stroke({ color: '#3399ff', width: 1, linecap: 'round' });
	var lineCGrade = draw.line(scale*.7, scale*3/10, scale, scale*3/10).stroke({ color: '#3399ff', width: 1, linecap: 'round' });
	var lineDGrade = draw.line(scale*.6, scale*4/10, scale, scale*4/10).stroke({ color: '#3399ff', width: 1, linecap: 'round' });
	
	var fontsize = scale/25;
	var fontFamily = 'Arial';

	var aGrade = draw.text("A");
	aGrade.x(scale+scale*.01);
	aGrade.y(scale*.04);
	aGrade.font({
		family: fontFamily,
		size: fontsize
	})
	
	var bGrade = draw.text("B");
	bGrade.x(scale+scale*.01);
	bGrade.y(scale*.14);
	bGrade.font({
		family: fontFamily,
		size: fontsize
	})
	
	var cGrade = draw.text("C");
	cGrade.x(scale+scale*.01);
	cGrade.y(scale*.24);
	cGrade.font({
		family: fontFamily,
		size: fontsize
	})
	
	var dGrade = draw.text("D");
	dGrade.x(scale+scale*.01);
	dGrade.y(scale*.34);
	dGrade.font({
		family: fontFamily,
		size: fontsize
	})
	
	var fGrade = draw.text("F");
	fGrade.x(scale+scale*.01);
	fGrade.y(scale*.69);
	fGrade.font({
		family: fontFamily,
		size: fontsize
	})
}
