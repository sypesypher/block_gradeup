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
 
function valueChanged() {
	var e = document.getElementById("courseSelection");
	var s = document.getElementById("scaleSelection");
	var h = document.getElementById("heatmapSelection");
	console.log("new course: " + e.options[e.selectedIndex].value);
	console.log("new scale: " + s.value);
	console.log("new heatmap Slope/Scale: " + h.value);
	
	//redraw			
	let scale = parseInt(s.value);
	let heatmapScale = parseInt(h.value);
	draw.size(scale+scale*2/3,scale+scale/6); //additional area for chart legend and assignment names
	draw.clear();
	drawChart(scale,draw);
	drawAssignments(scale, draw,data);

	draw2.size(scale+scale*.66,scale/2);
	draw2.clear();
	drawHeatMap(scale,draw2,data,classStartDate,heatmapScale);	
}