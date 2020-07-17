function showHeatMap(elementId, grades) {
    //TODO:
	//for each assignment: assign the difficulty points to the week it is due
	//line graph chart all the weeks' difficulties
	//ability to change difficulty for assignments
    
    console.log('show heatmap is called');
    
    var canvas = document.getElementById(elementId);
    var ctx = canvas.getContext('2d');
    var gradient = ctx.createLinearGradient(0,80,0,100);
    gradient.addColorStop(0,'red');
    //gradient.addColorStop(.4,'yellow') //include yellow?
    gradient.addColorStop(1,'green');
	
	var warningIcon = new Image();
	warningIcon.src = 'https://imgur.com/uR4K2lx'; //TODO?

    var weeklyLoad = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    var weekLabels = ['week1','week2','week3','week4','week5','week6','week7','week8','week9','week10','week11','week12','week13','week14','week15','week16']
    
    for(i = 0; i < grades.length;i++) {
        weeklyLoad[grades[i].dueDateWeek - 1]+=grades[i].difficulty;
    }

    var chartData = {
        labels: weekLabels,
        
		datasets: [
        {
            label: "Intensity",
            data: weeklyLoad,
            fill: true,
            borderColor: "#EE6868",
            backgroundColor: gradient,
            lineTension: 0,
            hoverBackgroundColor: "grey",
            hoverBorderColor: "grey",
        }]
    };

    var chartOptions = {
        title: {
            display: true,
            text: heatMapString,
            fontSize: 23,
			fontColor: 'green'
        },
        legend: {
            display: false,
        },
		maintainAspectRatio:false,
		responsive: true
    };

    var lineChart = new Chart(canvas, {
        type: 'line',
        data: chartData,
        options: chartOptions
    });
}
