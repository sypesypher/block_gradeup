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
	 
		$this->content         =  new stdClass;
		$this->content->text   = 'The content of our SimpleHTML block!';
		$this->content->footer = 'Footer here...';
	 
		return $this->content;
	}
		
}

