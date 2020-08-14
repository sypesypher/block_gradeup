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

$plugin->component = 'block_gradeup';  // Recommended since 2.0.2 (MDL-26035). Required since 3.0 (MDL-48494)
$plugin->version  = 2020081300;  // YYYYMMDDHH (year, month, day, 24-hr time) first version
$plugin->requires = 2015111600; // YYYYMMDDHH Moodle 3.0 required TODO: maybe work on earlier versions? idk this was tested on version moodle 4.0
//$plugin->maturity = MATURITY_BETA;
//$plugin->release = 0;