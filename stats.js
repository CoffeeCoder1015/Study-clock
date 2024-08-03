class StatsDisplay {
    constructor(chart_canvas) {
        this.break_time = new Array(24).fill(0) //all in seconds
        this.study_time = new Array(24).fill(0) //all in seconds
        this.chart = new Chart(
            chart_canvas,
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
    }
}