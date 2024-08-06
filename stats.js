class StatsDisplay {
    constructor(chart) {
        this.stats_wrapper = document.getElementById("stats_wrapper")
        this.chart_wrapper = chart
        this.break_time = new Array(24).fill(0) //all in seconds
        this.study_time = new Array(24).fill(0) //all in seconds
        this.chart = new Chart(
            chart.children[0],
            {
                type: 'bar',
                data: {
                    labels: ["12 am","1","2","3","4","5","6","7","8","9","10","11","12 pm","1","2","3","4","5","6","7","8","9","10","11"],
                    datasets: [
                        {
                            label: 'Studying',
                            data: new Array(24).fill(0),
                            // borderWidth:1,
                            // barPercentage:1,
                            // categoryPercentage:1
                        },
                        {
                            label: 'Breaking',
                            data: new Array(24).fill(0),
                            // borderWidth:1,
                            // barPercentage:1,
                            // categoryPercentage:1
                        }
                    ]
                },
                options: {
                    maintainAspectRatio:false,
                    responsive:true,
                    scales: {
                        x: {
                            stacked: true,
                            ticks:{
                                // autoSkip:false
                            }
                        },
                        y: {
                            stacked: true,
                            max:60,
                            title: {
                                display: true,
                                text: "Minutes"
                            },
                            ticks:{
                                beginAtZero:true,
                            }
                        }
                    },
                    plugins: {
                        tooltip: {
                            callbacks: {
                                title: function (context) {
                                    var ctx = context[0]
                                    var label = ctx.label 
                                    if(ctx.dataIndex < 12 && ctx.dataIndex != 0){
                                        label += " am"
                                    }else if(ctx.dataIndex != 12){
                                        label += " pm"
                                    }
                                    return label
                                },
                                label: function(context) {
                                    let label = context.dataset.label || '';
                                    var minutes = parseInt(context.parsed.y)
                                    var seconds = Math.round((context.parsed.y-minutes)*60)
                                    if (label) {
                                        label += ': ';
                                    }
                                    if (context.parsed.y !== null) {
                                        label += minutes + ":" + seconds
                                    }
                                    return label;
                                }
                            }
                        }
                    }
                }
            }
        )

        //load storage
        //# load last saved break time
        var last_timestamp = localStorage.getItem("statsTS")
        if(last_timestamp == null){
            return
        }
        var current_timestamp = new Date().toLocaleDateString()
        if (last_timestamp == current_timestamp){
            this.break_time = localStorage.getItem("break_time_stats").split(",").map((v)=>Number(v))
            this.study_time = localStorage.getItem("study_time_stats").split(",").map((v)=>Number(v))
            this.syncChart(1,this.break_time.map((v)=>v/60))
            this.syncChart(0,this.study_time.map((v)=>v/60))
            this.chart.update()
        }
    }

    storeState(){
        localStorage.setItem("statsTS",new Date().toLocaleDateString())
        localStorage.setItem("break_time_stats",this.break_time.toString())
        localStorage.setItem("study_time_stats",this.study_time.toString())
    }

    syncChart(chart_number,data){
        this.chart.data.datasets[chart_number].data = data
    }

    increment(type){
        var index = new Date().getHours()
        if(type == "b"){
            this.break_time[index] ++
            this.chart.data.datasets[1].data[index] = this.break_time[index]/60
        }else if(type == "s"){
            this.study_time[index] ++
            this.chart.data.datasets[0].data[index] = this.study_time[index]/60
        }
        this.chart.update()
        this.storeState()
    }

    showElement(element){
        element.classList.remove("hide_stats")
        element.classList.add("show_stats")
    }
    hideElement(element){
        element.classList.remove("show_stats")
        element.classList.add("hide_stats")
    }
    showChart(element){
        this.stats_wrapper.style.animationDuration = "3s, 3s, 3s"
        this.stats_wrapper.style.animationFillMode = 'forwards'
        this.stats_wrapper.style.animationName = "stats_display_show, width_expand, margin_expand"
        this.chart_wrapper.className = "show_stats"
        this.hideElement(element)
        this.showElement(document.getElementById("hide"))
    }
    
    hideChart(element){
        this.stats_wrapper.style.animationDuration = "3s, 3s, 3s"
        this.stats_wrapper.style.animationFillMode = 'forwards'
        this.stats_wrapper.style.animationName = "stats_display_hide, width_retract, margin_retract"
        this.chart_wrapper.className = "hide_stats"
        this.showElement(document.getElementById("show"))
        this.hideElement(element)
    }
}