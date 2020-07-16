<?php
//TODO: add moodle comment garbage discalaimers

class block_gradeup extends block_base {

	/** @var boolean This variable checks if js is loaded */
    private $jsloaded = false;

	public function init() {
		GLOBAL $PAGE;

        $this->title = get_string('gradeup', 'block_gradeup');
    }
	
	public function get_content() {
		if ($this->content !== null) {
		  return $this->content;
		}
	 
		$this->content       =  new stdClass;
		$this->content->text .= "";
		$this->content->text .= '<script src="https://cdn.jsdelivr.net/npm/@svgdotjs/svg.js@3.0/dist/svg.min.js"></script>';
		$this->content->text .= '<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.5.0/Chart.min.js"></script>';
		$this->content->text .= '<script src="/blocks/gradeup/gradeupjs/heatmap2.js"></script>';
		$this->content->text .= '<script src="/blocks/gradeup/gradeupjs/burnup.js"></script>';
		$this->content->text .= '<script src="/blocks/gradeup/gradeupjs/grades2.js"></script>">';
        $this->content->text .= '<div id="svgContainer"></div>';
		$this->content->text .= '<div style="width:800px"> <canvas id="heatmapChart"> </canvas> </div>';

		$this->content->text .= '<script>';
        $this->content->text .= 'function getData() {'; //Normally a call to get data, but this will do for an example
		$this->content->text .=     'let data = grades;';
        $this->content->text .=     'return data;';
        $this->content->text .= '}';
		$this->content->text .= 'let data = getData();';
		$this->content->text .= 'let scale = 600;';
		$this->content->text .= 'var draw = SVG().addTo(\'#svgContainer\').size(scale+400,scale+100);'; //additional area for chart legend and assignment names
		$this->content->text .= 'drawChart(scale,draw);';
		$this->content->text .= 'drawAssignments(scale, draw,data);';
		$this->content->text .= 'showHeatMap("heatmapChart",data);';
		$this->content->text .= '</script>';

		return $this->content;
	}
		
}

