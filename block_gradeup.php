<?php
//TODO: add moodle comment garbage discalaimers

class block_gradeup extends block_base {
	public function init() {
        $this->title = get_string('gradeup', 'block_gradeup');
    }
	
	public function get_content() {
		if ($this->content !== null) {
		  return $this->content;
		}
	 
		$this->content       =  new stdClass;
		$this->content->text = 'The content of our test block!';
		$this->content->text .= 'line 2 or same line?';
		$this->content->text .= '<script src="https://cdn.jsdelivr.net/npm/@svgdotjs/svg.js@3.0/dist/svg.min.js"></script>';
		$this->content->footer = 'Footer here...';
	 
		return $this->content;
	}
		
}

