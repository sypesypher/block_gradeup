USE mysql;
SHOW tables;
SELECT * FROM mdl_grade_grades;
SELECT * FROM mdl_grade_items;
SELECT * FROM mdl_assign;
SELECT * FROM mdl_assign_grades;
SELECT * FROM mdl_grade_items;
SELECT * FROM mdl_grade_grades_history;

/** get courses that a user is enrolled in*/
SELECT c.id, c.fullname FROM mdl_course c INNER JOIN mdl_enrol e ON c.id=e.courseid INNER JOIN mdl_user_enrolments ue ON e.id=ue.enrolid WHERE userid=5 ORDER BY c.fullname;

/* returns the total points available in a course for use in computing assignment weight */
SELECT SUM(grade) FROM mdl_assign a WHERE a.course=2; 

/*get grades for a user given a specific class and user id*/
SELECT gi.courseid,g.userid,gi.itemname, g.finalgrade, gi.grademax, a.duedate 
	FROM mdl_grade_grades g 
    INNER JOIN mdl_grade_items gi ON gi.id = g.itemid 
    INNER JOIN mdl_assign a ON a.name=gi.itemname 
    WHERE g.userid = 5 AND gi.courseid = 2 AND gi.itemname IS NOT NULL 
    ORDER BY a.duedate;
