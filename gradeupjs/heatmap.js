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

	//find the last due date (this will be the largest Unix timestamp value)
	var lastDueUnix = data[0].due;
	var firstDueUnix = data[0].due;
	for (let i=1; i<data.length; i++) {
		if (data[i].due > lastDueUnix) {
			lastDueUnix = data[i].due;
			//console.log("assignment:" + data[i].itemname + " due at:" + data[i].due)
		}
		if (data[i].due < firstDueUnix) {
			firstDueUnix = data[i].due;
		}
	}
	var lastDate = new Date(lastDueUnix * 1000); //https://www.epochconverter.com/ <- to understand what is happening
	var firstDate = new Date(firstDueUnix * 1000);
	console.log(lastDate.getDay() + '/' + (lastDate.getMonth()+1) + '/' + lastDate.getFullYear());
	console.log(firstDate.getDay() + '/' + (firstDate.getMonth()+1) + '/' + firstDate.getFullYear());

	//calculate the scale for drawing
	var differenceInDays = (lastDate.getTime() - firstDate.getTime()) / (1000 * 3600 * 24); //how many days between start and end point
	console.log("days between first and last assignment: " + differenceInDays);
	let xScalePerDay = ((scale * 1.5)-scale*.05)/differenceInDays;
	console.log("X Pixels per day: " + xScalePerDay);
	
	//combine/filter grades that have the same due date together
	var gradeLoads = [];
	for (let i=0; i<data.length; i++) {
		let duedate = new Date(data[i].due * 1000);
		let daysTill = (duedate.getTime() - firstDate.getTime()) / (1000 * 3600 * 24);
		let dateObject = (duedate.getMonth()+1) + '/' + duedate.getDay() + '/' + duedate.getFullYear()
		let assignment = {};
		assignment.duedate = dateObject;
		assignment.gradeweight = data[i].weight;
		assignment.name = data[i].itemname; 
		assignment.xCoordinate = Math.floor(daysTill * xScalePerDay);
		gradeLoads.push(assignment);
	}
	console.log(gradeLoads);

	//calculate the weight for each date
	let heatmapData = {}
	for (let i=0; i<gradeLoads.length;i++) {
		let dueDate = {};
		let assignmentDueDate = gradeLoads[i].duedate;

		if (assignmentDueDate in heatmapData) {
			let totalWeight = (heatmapData[assignmentDueDate] + gradeLoads[i].gradeweight);
			heatmapData[assignmentDueDate] = totalWeight;
		} else {
			heatmapData[assignmentDueDate] = gradeLoads[i].gradeweight;
		}
	}
	console.log(heatmapData);

	//find the highest weight of any date to set as the upper limit of the Y scale
	let heaviestWeight = null;
	for (key in heatmapData) {
		//console.log(key + " : " + heatmapData[key]);
		if (heaviestWeight == null || heaviestWeight < heatmapData[key]) {
			heaviestWeight = heatmapData[key];
		}
	}
	yScalePerWeight = (scale/3) / heaviestWeight;
	console.log("yScalePerWeight: " + yScalePerWeight);
	console.log(heaviestWeight);


	//get plot Points for each heatmap Point

	let ypoints = [];
	let xpoints = [];
	for (key in heatmapData) {
		let x = 0;
		for (let i=0; i<gradeLoads.length;i++) {
			if (gradeLoads[i].duedate == key){
				x = gradeLoads[i].xCoordinate + scale*.04;
				break;
			}
		}
		let y = (scale/3) - (heatmapData[key] * yScalePerWeight);
		console.log(key + " (x,y): (" + x + "," + y + ")");
		plotPoint(x,y,draw);
		drawTextHeatmap(x-scale*.03,scale/3 + scale*.05, key, scale/30, draw, 90);

		xpoints.push(x);
		ypoints.push(y);
	}
	console.log(xpoints);
	console.log(ypoints);

	let heatmapLineString = "0," + scale/3 + " ";
	for (let i =0; i<xpoints.length;i++) {
		heatmapLineString += xpoints[i]+2;
		heatmapLineString += ",";
		heatmapLineString += ypoints[i];
		heatmapLineString += " " + (xpoints[i]+2) + "," + scale/3 + " ";
	}
	heatmapLineString += scale*1.5 + "," + scale/3 + " 0," + scale/3 + " 0,0";

	console.log(heatmapLineString);
	var gradient = draw.gradient('linear', function(add) {
		add.stop(0, 'red')
		add.stop(1, 'green')
	  })
	gradient.from(0,0).to(0,1);
	var heatline = draw.polyline(heatmapLineString);
	heatline.stroke({color: 'red', width: 2});
	heatline.fill(gradient);
}

function plotPoint(x, y, draw) {
	var point = draw.circle(10);
	point.x(x);
	point.y(y);
	point.fill('blue');
	point.mouseover(function() {
		//use this to add functionality later - maybe show what assignments are due on each date
		point.fill('grey');
	});

	point.mouseout(function() {
		point.fill('blue');
	});
	
	return {};
}     
        

function drawTextHeatmap(x,y,message,fontsize,draw,rotation=0){
	console.log(rotation);
	var text = draw.text(message);
	text.x(x);
	text.y(y);
	text.rotate(rotation);
	text.font({
		size: fontsize
	})
}

