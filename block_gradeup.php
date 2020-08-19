<?php
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

class block_gradeup extends block_base {

	/** @var boolean This variable checks if js is loaded */
    private $jsloaded = false;

	public function init() {
		global $CFG, $USER, $DB, $USER; //TODO checkif duplicate

        $this->title = get_string('gradeup', 'block_gradeup');
    }
	
	

	public function get_content() {

		global $CFG, $USER, $DB, $USER;

		if ($this->content !== null) {
		  return $this->content;
		}
	 
		$this->content = new stdClass;

		//pull grades
		$getCoursesString = "SELECT c.id, c.fullname, c.startdate,c.enddate FROM mdl_course c INNER JOIN mdl_enrol e ON c.id=e.courseid INNER JOIN mdl_user_enrolments ue ON e.id=ue.enrolid WHERE userid=5 ORDER BY c.fullname;";
		$courses = $DB->get_records_sql($getCoursesString);

		//user selects which course to pull data from
		$dropdownCourses = [];

		$this->content->text .= '<script>';
		$this->content->text .= 'let allGrades = {};';
		$this->content->text .= '</script>';
		foreach ($courses as $course) {
			
			//Get the total points in a course to calculate weights of assignments
			$getTotalCoursePoints = "SELECT grademax FROM mdl_grade_items WHERE itemtype=\"course\" AND courseid=" . $course->id ."; ";
			$totalCoursePoints = $DB->get_records_sql($getTotalCoursePoints);
			$totalPoints = key($totalCoursePoints);
			
			$getUserRoleInCourse = "SELECT ra.roleid FROM mdl_role_assignments AS ra 
										LEFT JOIN mdl_user_enrolments AS ue ON ra.userid = ue.userid
										LEFT JOIN mdl_context AS c ON c.id = ra.contextid 
										LEFT JOIN mdl_enrol AS e ON e.courseid = c.instanceid AND ue.enrolid = e.id 
										WHERE  ue.userid = ". $USER->id ." AND e.courseid = ". $course->id ;
			$userRoleInCourse = $DB->get_records_sql($getUserRoleInCourse);
			$userRole = key($userRoleInCourse);


			$userIDforDataPull = $USER->id;
			if ($userRole != 5) {
				$anyUserIDInCourse = "SELECT g.userid
										FROM mdl_grade_grades g 
										INNER JOIN mdl_grade_items gi ON gi.id = g.itemid 
										INNER JOIN mdl_assign a ON a.name=gi.itemname 
										WHERE gi.courseid = 2";
				$anyUserID = $DB->get_records_sql($anyUserIDInCourse);
				$userIDforDataPull = key($anyUserID);
				
			}

			
			//Get user grades from the moodle database
			$getUserGrades = "SELECT q1.itemname , q1.finalgrade, q1.grademax, q2.averageGrade,IFNULL(q3.due,". $course->enddate .") as due FROM (
								SELECT gi.itemname, g.finalgrade, gi.grademax
									FROM mdl_grade_grades g 
									INNER JOIN mdl_grade_items gi ON gi.id = g.itemid 
									WHERE g.userid = ". $userIDforDataPull ." AND gi.courseid = ". $course->id ." AND gi.itemname IS NOT NULL 
								) q1 INNER JOIN (
									SELECT gi.itemname, AVG(finalgrade) as averageGrade
									FROM mdl_grade_grades g 
									INNER JOIN mdl_grade_items gi ON gi.id = g.itemid 
									WHERE gi.courseid = ". $course->id ." AND gi.itemname IS NOT NULL 
									GROUP BY itemname
								) q2 ON q1.itemname=q2.itemname LEFT OUTER JOIN (
									SELECT name as itemname,timeclose as due FROM mdl_quiz WHERE course=". $course->id ." UNION
									SELECT name as itemname,IF(timeclose=0,null,timeclose) as due FROM mdl_quiz WHERE course=". $course->id ." UNION
									SELECT name as itemname,IF(duedate=0,null,duedate) as due FROM mdl_assign WHERE course=". $course->id ." UNION
									SELECT name as itemname,IF(duedate=0,null,duedate) as due FROM mdl_forum WHERE course=". $course->id ."
								) q3 ON q1.itemname = q3.itemname
								ORDER BY due;"; 
			$student_grades = $DB->get_records_sql($getUserGrades);
			//take the database results and format into a PHP grades Object array 
			foreach ($student_grades as $grade) {
				$grade->weight = $grade->grademax / $totalPoints * 100; //calculate the weight of an assignment as a value out of 100
				if ($grade->finalgrade == null){
					$grade->score =  null;
					$grade->originalScore = null;
				} else {
					$grade->score =  ($grade->finalgrade) / ($grade->grademax);
					$grade->originalScore = $grade->score;
				}
				if ($grade->averagegrade == null) {
					$grade->averageScore = null;
				} else {
					$grade->averageScore = ($grade->averagegrade) / ($grade->grademax);
				}
				
			}
			
			//convert php grades objects array to a string (in JSON format) so it can be passed to the javascript, is there a better way? probably
			$jsonGradesString = "let grades" . $course->id . " = [";
			foreach ($student_grades as $grade){
				$jsonGradesString .= "{";
				$jsonGradesString .= "itemname: \"" . $grade->itemname . "\",";
				$jsonGradesString .= "weight: " . $grade->weight . ",";

				if ($grade->score == null) {
					$jsonGradesString .= "score: null,";
					$jsonGradesString .= "originalScore: null,";
				} else {
					$jsonGradesString .= "score: " . $grade->score . ",";
					$jsonGradesString .= "originalScore: " . $grade->score . ",";
				}

				if ($grade->averageScore == null) {
					$jsonGradesString .= "averageScore: null,";
				} else {
					$jsonGradesString .= "averageScore: " . $grade->averageScore . ",";
				}
				
				
				$jsonGradesString .= "due: " . $grade->due;
				$jsonGradesString .= "}";
				$jsonGradesString .= ",";
			}
			$jsonGradesString = rtrim($jsonGradesString, ","); //remove the comma after the last grade
			$jsonGradesString .= "];";
			
			//pass the json 
			$this->content->text .= '<script>';
			$this->content->text .= $jsonGradesString;
			$this->content->text .= 'allGrades["grades' . $course->id . '"] = grades' . $course->id . ';';
			$this->content->text .= '</script>';
		}

		//print_r($CFG->wwwroot);
		//required import statements
		$this->content->text .= '<script src="https://cdn.jsdelivr.net/npm/@svgdotjs/svg.js@3.0/dist/svg.min.js"></script>'; //SVG.js
		$this->content->text .= '<script src="'. $CFG->wwwroot . '/blocks/gradeup/gradeupjs/heatmap.js"></script>';
		$this->content->text .= '<script src="'. $CFG->wwwroot . '/blocks/gradeup/gradeupjs/burnup.js"></script>';
		$this->content->text .= '<script src="'. $CFG->wwwroot . '/blocks/gradeup/gradeupjs/valueChanged.js"></script>';
		
		//create drop down selection for courses
		$this->content->text .= '<label for="cars">' . get_string('courseSelection', 'block_gradeup') . '</label>';
		$this->content->text .= 	'<select name="cars" id="courseSelection" onchange="valueChanged()">';
		foreach ($courses as $course) {
			$this->content->text .= 	'<option value="' . $course->id . '">' . $course->fullname . '</option>'; // add an option for each course to be selected
		}
		$this->content->text .= '</select>';
		
		//user select scale option
		$this->content->text .= get_string('scaleSelection', 'block_gradeup') . '<input type="number" id="scaleSelection" name="scaleInput" value="500" min="100" max="1000" onchange="valueChanged()"><br><br>';	
		$this->content->text .= '<div id="svgContainer"></div>';

		//user slope selection
		$this->content->text .= get_string('difficultySelection', 'block_gradeup') . ' <input type="number" id="heatmapSelection" name="scaleInput" value="4" min="1" max="10" onchange="valueChanged()">';
		$this->content->text .= '<h2 style="font-size:30px; color:green; text-align:left">' . get_string('heatmapLabel', 'block_gradeup') . '</h2>';
		$this->content->text .= '<div id="svgContainer2"></div>';
		
		
		//Define all the needed String values reading from lang directory
		$this->content->text .= '<script>';
		
		//var course

		$courseStartDates = 'let courseStartDates = {};';
		$courseEndDates = 'let courseEndDates = {};';
		foreach ($courses as $course) {
			$courseStartDates .= 'courseStartDates[' . $course->id . '] = ' . $course->startdate . ';';
			$courseEndDates .= 'courseEndDates[' . $course->id . '] = ' . $course->enddate . ';';
		}
		$this->content->text .= $courseStartDates ;
		$this->content->text .= $courseEndDates;


		$this->content->text .= 'let promptString = \'' . get_string('promptString', 'block_gradeup') . '\';';
        $this->content->text .= 'let gradeString = \'' . get_string('gradeString', 'block_gradeup') . '\';';
        $this->content->text .= 'let weightString = \'' . get_string('weightString', 'block_gradeup') . '\';';
        $this->content->text .= 'let averageString = \'' . get_string('averageString', 'block_gradeup') . '\';';
        $this->content->text .= 'let maxGradeString = \'' . get_string('maxGradeString', 'block_gradeup') . '\';';
        $this->content->text .= 'let projectionGradeString = \'' . get_string('projectionGrade', 'block_gradeup') . '\';';
        $this->content->text .= 'let legendMinString =  \'' . get_string('legendMin', 'block_gradeup') . '\';';
        $this->content->text .= 'let legendAverageString = \'' . get_string('legendAverage', 'block_gradeup') . '\';';
        $this->content->text .= 'let potentialGradeString = \'' . get_string('potentialGradeString', 'block_gradeup') . '\';';
        $this->content->text .= 'let predictedGradeString = \'' . get_string('legendPredict', 'block_gradeup') . '\';';
		$this->content->text .= 'let legendString = \'' . get_string('legendLabel', 'block_gradeup') . '\';';
        $this->content->text .= 'let resetButtonString = \'' . get_string('resetButton', 'block_gradeup') . '\';';
		$this->content->text .= 'let heatMapString = \'' . get_string('heatmapLabel', 'block_gradeup') . '\';';
		$this->content->text .= 'let percentOfGradeString = \'' . get_string('percentOfGradeString', 'block_gradeup') . '\';';
		$this->content->text .= 'let dueDateString = \'' . get_string('dueDateString', 'block_gradeup') . '\';';

		$this->content->text .= 'function getData(courseid) {'; //Normally a call to get data, but this will do for an example
		$this->content->text .=     'let gradeString = "grades" + courseid;';
		$this->content->text .=     'let data = allGrades[gradeString];';
        $this->content->text .=     'return data;';
		$this->content->text .= '};';
		
		$this->content->text .= 'function isStudent() {'; //this is for teachers and admins so they can see average grades
		if ($userRole != 5) {
			$this->content->text .= 'return false;'; //don't show grades, just averages
		} else {
			$this->content->text .= 'return true;';
		}
		$this->content->text .= '};';


		$this->content->text .= 'var draw = SVG().addTo(\'#svgContainer\').size(700 + 700*2/3,700+700/6);'; //additional area for chart legend and assignment names
		
		$this->content->text .= 'var draw2 = SVG().addTo(\'#svgContainer2\').size(700+700*.66,700/2);';
		
		
		$this->content->text .= 'valueChanged();';
		$this->content->text .= '</script>';

		return $this->content;
	}
		
}

