/* This file is part of Moodle - http://moodle.org/
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
*/

/*
 * Gradeup Block.
 *
 * @package   block_gradeup
 * @author    Chris Strothman	<cstrothman@southern.edu>
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
 
 /*
THIS IS A DEV RESOURCE FILE ONLY
This file is not used by gradeup - but the sql commands used within gradeup are contained in this file. 
use MySQL Workbench or any other database software to play around with moodle's tables and use the below to understand what is going on
*/

USE mysql;
SHOW tables; 
SELECT * FROM mdl_grade_grades;
SELECT * FROM mdl_grade_items;
SELECT * FROM mdl_quiz;
SELECT * FROM mdl_assign;
SELECT * FROM mdl_assign_grades;
SELECT * FROM mdl_course;
SELECT * FROM mdl_role_assignments;
SELECT * FROM mdl_role;
SELECT * FROM mdl_user_enrolments;
SELECT * FROM mdl_context;


SELECT * FROM mdl_role_assignments AS ra LEFT JOIN mdl_context as c ON c.id = ra.contextid;

/*get a given user's role 5 == student, 3 == teacher */
SELECT ra.roleid FROM mdl_role_assignments AS ra 
LEFT JOIN mdl_user_enrolments AS ue ON ra.userid = ue.userid
LEFT JOIN mdl_context AS c ON c.id = ra.contextid 
LEFT JOIN mdl_enrol AS e ON e.courseid = c.instanceid AND ue.enrolid = e.id 
WHERE  ue.userid = 4 AND e.courseid = 3;

/*get any user ID from a course - used to pull averages for the teacher*/
SELECT g.userid
	FROM mdl_grade_grades g 
    INNER JOIN mdl_grade_items gi ON gi.id = g.itemid 
    INNER JOIN mdl_assign a ON a.name=gi.itemname 
    WHERE gi.courseid = 2;



/** get courses that a user is enrolled in*/
SELECT c.id, c.fullname, c.startdate,c.enddate FROM mdl_course c INNER JOIN mdl_enrol e ON c.id=e.courseid INNER JOIN mdl_user_enrolments ue ON e.id=ue.enrolid WHERE userid=2 ORDER BY c.fullname;

/**get course startdate*/
SELECT c.startdate FROM mdl_course c INNER JOIN mdl_enrol e ON c.id=e.courseid INNER JOIN mdl_user_enrolments ue ON e.id=ue.enrolid WHERE userid=5 AND courseid=2;

/* returns the total points available in a course for use in computing assignment weight */
SELECT SUM(grade) as totalPoints FROM mdl_assign a WHERE a.course=2; 


/*get grades for a user given a specific class and user id*/
SELECT gi.courseid,g.userid,gi.itemname, g.finalgrade, gi.grademax, a.duedate 
	FROM mdl_grade_grades g 
    INNER JOIN mdl_grade_items gi ON gi.id = g.itemid 
    INNER JOIN mdl_assign a ON a.name=gi.itemname 
    WHERE g.userid = 5 AND gi.courseid = 2 AND gi.itemname IS NOT NULL 
    ORDER BY a.duedate;


SELECT name as itemname,timeclose as due FROM mdl_quiz WHERE course=3 UNION
SELECT name as itemname,duedate as due FROM mdl_assign WHERE course=3;

-- get grades ---------------------------
SELECT q1.itemname , q1.finalgrade, q1.grademax, q2.averageGrade, IFNULL(q3.due,7) as due FROM (
	SELECT gi.itemname, g.finalgrade, gi.grademax
		FROM mdl_grade_grades g 
		INNER JOIN mdl_grade_items gi ON gi.id = g.itemid 
		WHERE g.userid = 5 AND gi.courseid = 3 AND gi.itemname IS NOT NULL 
	) q1 INNER JOIN (
		SELECT gi.itemname, AVG(finalgrade) as averageGrade
		FROM mdl_grade_grades g 
		INNER JOIN mdl_grade_items gi ON gi.id = g.itemid 
		WHERE gi.courseid = 3 AND gi.itemname IS NOT NULL 
		GROUP BY itemname
	) q2 ON q1.itemname=q2.itemname LEFT OUTER JOIN (
		SELECT name as itemname,IF(timeclose=0,null,timeclose) as due FROM mdl_quiz WHERE course=3 UNION
		SELECT name as itemname,IF(duedate=0,null,duedate) as due FROM mdl_assign WHERE course=3 UNION
        SELECT name as itemname,IF(duedate=0,null,duedate) as due FROM mdl_forum WHERE course=3 UNION
		SELECT name as itemname,IF(deadline=0,null,deadline) as due FROM mdl_lesson
	) q3 ON q1.itemname = q3.itemname;


SELECT name as itemname,timeclose as due FROM mdl_quiz WHERE course=3 UNION
SELECT name as itemname,duedate as due FROM mdl_assign WHERE course=3 UNION
SELECT name as itemname,duedate as due FROM mdl_forum WHERE course=3 UNION
SELECT name as itemname,deadline as due FROM mdl_lesson;

SELECT grademax FROM mdl_grade_items WHERE itemtype="course" AND courseid=3;
