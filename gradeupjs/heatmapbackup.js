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
 
function drawHeatMap(scale,svg,data,classStartDate) {
	var draw = svg;
	var scale = scale;
	var fontsize = scale/25;
	
	//heatmap change variable constants
	let dayPerPercent = 1; //slope 
	let yScalePerWeight2 = 3.5;
	
	
	//draw the heatmap border
	borderx = scale*1.5;
	bordery = scale/3;
	var border = draw.polyline(`0,0 ${borderx},0 ${borderx},${bordery} 0,${bordery} 0,0`);
	border.stroke({color: 'grey', width: 2});
	border.fill('none');

	//find start and end dates of chart
	var courseStartDate = new Date(classStartDate * 1000);
	let courseStartDateObjectString = (courseStartDate.getMonth()+1) + '/' + courseStartDate.getDay() + '/' + courseStartDate.getFullYear();
	drawTextHeatmap(-(scale/50),scale/3 + scale*.05, courseStartDateObjectString, scale/30, draw, 90);
	var lastDueUnix = data[0].due;
	for (let i=1; i<data.length; i++) {
		if (data[i].due > lastDueUnix) {
			lastDueUnix = data[i].due;
			//console.log("assignment:" + data[i].itemname + " due at:" + data[i].due)
		}
	}
	var lastDate = new Date(lastDueUnix * 1000); //https://www.epochconverter.com/ <- to understand what is happening

	//calculate the scale for drawing using days between start of course and last assignment due
	var differenceInDays = (lastDate.getTime() - courseStartDate.getTime()) / (1000 * 3600 * 24);
	let xScalePerDay = borderx/differenceInDays;
	console.log("xScalePerDay: " + xScalePerDay);
	
	//combine/filter grades that have the same due date together
	var gradeLoads = [];
	for (let i=0; i<data.length; i++) {
		let duedate = new Date(data[i].due * 1000);
		let daysTill = (duedate.getTime() - courseStartDate.getTime()) / (1000 * 3600 * 24);
		let dateObject = (duedate.getMonth()+1) + '/' + (duedate.getDay()+1) + '/' + duedate.getFullYear()
		let assignment = {};
		assignment.duedate = dateObject;
		assignment.gradeweight = data[i].weight;
		assignment.name = data[i].itemname; 
		assignment.xEnd = Math.floor(daysTill * xScalePerDay);
		gradeLoads.push(assignment);
	}
	//console.log("gradeLoads ");
	//console.log(gradeLoads);

	var heatmapData2 = [];
	for (let i=0; i<gradeLoads.length; i++) {
		let foundDup = false;
		for (let j = 0; j <heatmapData2.length; j++) {
			//check if there is a duplicate date already in heatmapData2, if there is, add the weight to the date
			if (heatmapData2[j].duedate == gradeLoads[i].duedate) {
				heatmapData2[j].gradeweight += gradeLoads[i].gradeweight;
				foundDup = true;
			}
		}
		if (!foundDup) {
			let duedateObject = {};
			duedateObject.duedate = gradeLoads[i].duedate;
			duedateObject.gradeweight = gradeLoads[i].gradeweight;
			duedateObject.xEnd = gradeLoads[i].xEnd;
			duedateObject.xStart = Math.floor(duedateObject.xEnd - (duedateObject.gradeweight*xScalePerDay*dayPerPercent));
			heatmapData2.push(duedateObject);
		}
	
	}
	console.log("heatmapData2 ");
	console.log(heatmapData2);


	
	
	//console.log(heaviestWeight);
	//drawTextHeatmap(scale*1.52, 0, heaviestWeight + "%",scale/30, draw);
	//drawTextHeatmap(scale*1.52, (scale/6 -scale*.015), (heaviestWeight/2) + "%",scale/30, draw);
	drawTextHeatmap(scale*1.52, (scale/3 -scale*.03), "0%",scale/30, draw);
	drawTextHeatmap(scale*1.51, scale*.13, "Percent of Grade", scale/25, draw, 90);
	drawTextHeatmap(scale*.7, scale/3+scale*.12, "Due Date", scale/25, draw);

	//get all plot Points (start and end) for each due date set
	let ypoints = [];
	let xpoints = [];
	let points = [];
	for (let i = 0; i< heatmapData2.length; i++) {
		let x = heatmapData2[i].xEnd;
		let y = (scale/3) - (heatmapData2[i].gradeweight * yScalePerWeight2);
		
		plotPoint(x,y,draw);
		drawTextHeatmap(x-scale*.03,scale/3 + scale*.05, heatmapData2[i].duedate, scale/30, draw, 90);
		
		let endPoint = {};
		endPoint.x = Math.floor(x);
		endPoint.y = Math.floor(y);
		endPoint.dueNow = true;
		endPoint.weight = heatmapData2[i].gradeweight;
		endPoint.start = Math.floor(heatmapData2[i].xStart); //this is useful later
		
		let startPoint = {};
		startPoint.x = Math.floor(heatmapData2[i].xStart);
		startPoint.y = Math.floor(scale/3);
		startPoint.dueNow = false;
		startPoint.weight = heatmapData2[i].gradeweight;

		points.push(startPoint);
		points.push(endPoint);
	}	
	points.sort((a, b) => (a.x > b.x) ? 1 : -1)
	console.log("sorted?");
	console.log(points);

	

	let heatMapLineString = "0," + scale/3 +  " ";
	let zeroY = Math.floor(scale/3);
	let lastx = 0;
	let currentWeight = 0;
	let lastY = zeroY;
	let assignmentsInProgress = 0;
	
	for (let i =0; i<points.length;i++) {
		if (currentWeight == 0) { //no work currently, new start date
			currentWeight += points[i].weight;
			//plot the start point
			heatMapLineString += points[i].x;
			heatMapLineString += ",";
			heatMapLineString += zeroY;
			lastx = points[i].x;
			lastY = zeroY;
			heatMapLineString += " ";
			console.log("new assignment" + currentWeight);
			assignmentsInProgress += 1;
			console.log("assignmentsInProgress:" + assignmentsInProgress);
		} else {
			if (points[i].dueNow) {
				//due date ends
				heatMapLineString += points[i].x;
				heatMapLineString += ",";
				lastY = zeroY - (currentWeight * yScalePerWeight2);
				heatMapLineString += lastY;
				heatMapLineString += " ";
				lastx = points[i].x;
				currentWeight -= points[i].weight;
				//console.log("current weight" + currentWeight);
				console.log("project ends");
				assignmentsInProgress -= 1;
				console.log("assignmentsInProgress:" + assignmentsInProgress);
				if (currentWeight == 0) {
					//line goes to zero, plot it
					heatMapLineString += points[i].x;
					lastx = points[i].x;
					heatMapLineString += ",";
					heatMapLineString += zeroY;
					lastY = zeroY;
					heatMapLineString += " ";
					console.log("proejct ends: goes to zero: "  + currentWeight);
				} else {
					//line doesn't go to zero
					heatMapLineString += points[i].x;
					lastx = points[i].x;
					heatMapLineString += ",";
					heatMapLineString += lastY + (currentWeight * yScalePerWeight2);
					lastY = lastY + (currentWeight * yScalePerWeight2);
					console.log("line doesn't go to zero" + points[i].weight);
					heatMapLineString += " ";
					console.log("project ends, doesn't go to zero, current:"  + currentWeight);
				}
			} else {
				//add another project to load
				let daysbetween = (points[i].x - lastx) / xScalePerDay; //get the days since last point
				let y = (daysbetween / dayPerPercent) * currentWeight;
				heatMapLineString += points[i].x;
				lastx = points[i].x
				heatMapLineString += ",";
				heatMapLineString +=  zeroY - y;
				lastY = zeroY - y;
				heatMapLineString += " ";
				currentWeight += points[i].weight; //add the new weight	
				console.log("add another project (current weight increase)"  + currentWeight);
				assignmentsInProgress += 1;
				console.log("assignmentsInProgress:" + assignmentsInProgress);
			}					
		}		
	}
	heatMapLineString += scale*1.5 + "," + scale/3 + " 0," + scale/3 + " 0,0";

	console.log(heatMapLineString);

	//console.log(heatMapLineString);
	var gradient = draw.gradient('linear', function(add) {
		add.stop(0, 'red')
		add.stop(1, 'green')
	  })
	gradient.from(0,0).to(0,1);
	var heatline = draw.polyline(heatMapLineString);
	heatline.stroke({color: 'red', width: 2});
	heatline.fill(gradient);
	heatline.opacity(.5);
	
	/*
	//find the highest weight of any date to set as the upper limit of the Y scale
	let heaviestWeight = null;
	for (let i =0; i < heatmapData2.length; i++) {
		//console.log(key + " : " + heatmapData[key]);
		if (heaviestWeight == null || heaviestWeight < heatmapData2[i].gradeweight) {
			heaviestWeight = heatmapData2[i].gradeweight;
		}
	}
	yScalePerWeight = (scale/3) / heaviestWeight;
	*/
	
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
	//console.log(rotation);
	var text = draw.text(message);
	text.x(x);
	text.y(y);
	text.rotate(rotation);
	text.font({
		size: fontsize
	})
}

