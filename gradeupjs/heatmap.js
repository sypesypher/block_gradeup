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
 
function drawHeatMap(scale,svg,data) {
	var draw = svg;
	var scale = scale;
	var fontsize = scale/25;
	var fontFamily = 'Arial';
	
	//draw the heatmap border
	borderx = scale*1.5;
	bordery = scale/3;
	var border = draw.polyline(`0,0 ${borderx},0 ${borderx},${bordery} 0,${bordery} 0,0`);
	border.stroke({color: 'grey', width: 2});
	border.fill('none');
	
}
function drawAssignment(x, y, artifact, scale, draw) {
            let x1 = x;
            let y1 = y;
            let x2 = x1 + (artifact.weight * scale/100);
            let y2 = y1 - (artifact.score * artifact.weight)*scale/100;
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
				if (grade == null || grade == "") {
					console.log("User abandoned what-if");
				} else {
					let whatif = Number(grade);
					if (whatif > 1) {
						whatif = whatif/100; //convert to a decimal
					}
					
					artifact.score =  whatif;
					var list = SVG.find('.gradeStuff')
					list.remove();
					drawAssignments(scale, draw,data);
				}
            });
			p.mouseover(function() {
				var list = SVG.find('.projectionText')
				list.remove();
				
				p.fill('grey');
				let grade = artifact.score;
				let weight = artifact.weight;
				let average = artifact.averageScore;
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
            var title = draw.text(artifact.itemname);
			title.x(x1 + (x2-x1)/4);
            title.y(scale+20);
            title.rotate(40);
            
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


function drawAssignments(scale, draw,data){
	//Draw Average Student Grades
	let averageX = 0;
	let averageY = scale;
	for (let i=0; i<data.length; i++) {
		let {xs, ys} = drawAverageGrades(averageX, averageY, data[i], scale, draw);
		averageX=xs;
		averageY=ys;
	}

	//Draw Student's Current Grade
	let x = 0;
	let y = scale;
	let yourGrades = []; //assume no grades yet -> average of zero
	
	for (let i=0; i<data.length; i++) {
		let {xs, ys} = drawAssignment(x, y, data[i], scale, draw);
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

function drawChart(scale, svg){
	var draw = svg;
	var scale = scale;
	
	
	
	var fontsize = scale/25;
	var fontFamily = 'Arial';

	var aGrade = draw.text("A");
	aGrade.x(scale+scale*.01);
	aGrade.y(scale*.04);
	aGrade.font({
		family: fontFamily,
		size: fontsize
	})
}
