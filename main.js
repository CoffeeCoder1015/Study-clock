//time values inputted for countdown
var hr = 0;
var min = 0;
var sec = 0;

function input_time(){
    var input = document.getElementById("timer-in")
    input.focus()
}

function update_text() {
    var text = String(document.getElementById("timer-in").value)
    if (text.length > 6){
        text = text.substring(text.length-6,text.length)
        document.getElementById("timer-in").value = text
    }
    text = String("0").repeat(6-text.length) + text 
    sec = Number(text.substring(4,6))
    min = Number(text.substring(2,4))
    hr = Number(text.substring(0,2))
    var time =document.getElementById("btimer").children
    time.namedItem("hr").innerText = text.substring(0,2)
    time.namedItem("min").innerText = text.substring(2,4)
    time.namedItem("sec").innerText = text.substring(4,6)
}

function recalculate() {
    //reformats the time set in the timer when it is improper
    //e.g 00:00:90 → 00:01:30
    min += parseInt(sec/60)
    sec %= 60
    hr += parseInt( min/60 )
    min %= 60
    var time =document.getElementById("btimer").children
    times = [hr,min,sec]
    times_padded = [] //in the format or hr, min, sec like the unpadded array above
    times.forEach(element => {
       if (element < 10) {
           times_padded.push("0" + element.toString())
           return
       }
       times_padded.push(element.toString())
    });
    time.namedItem("hr").innerText = times_padded[0]
    time.namedItem("min").innerText = times_padded[1]
    time.namedItem("sec").innerText = times_padded[2]
}

function countdown(){
    var countdown_sec = sec+min*60+hr*3600;
    var time =document.getElementById("btimer").children
    var x = setInterval(() => { //  x set here
        if (countdown_sec <= 0){
            time.namedItem("hr").innerText = "00"
            time.namedItem("min").innerText = "00"
            time.namedItem("sec").innerText = "00"
            clearInterval(x) //terminates using variable x, why does this work i wished it didnt so a less cursed method can be used
        }
        var cd_hrs = parseInt(countdown_sec/3600)
        var remaining_sec = countdown_sec%3600
        var cd_min = parseInt(remaining_sec/60)
        remaining_sec %= 60
        times = [cd_hrs,cd_min,remaining_sec]
        times_padded = [] //in the format or hr, min, sec like the unpadded array above
        times.forEach(element => {
        if (element < 10) {
            times_padded.push("0" + element.toString())
            return
        }
        times_padded.push(element.toString())
        });
        time.namedItem("hr").innerText = times_padded[0]
        time.namedItem("min").innerText = times_padded[1]
        time.namedItem("sec").innerText = times_padded[2]
        remaining_sec %= 60
        countdown_sec--
    }, 1000);
}

function countup(){
    var t_sec = 0;
    var time =document.getElementById("stimer").children
    var x = setInterval(() => { //  x set here
        var cu_hrs = parseInt(t_sec/3600)
        var remaining_sec = t_sec%3600
        var cu_min = parseInt(remaining_sec/60)
        remaining_sec %= 60
        times = [cu_hrs,cu_min,remaining_sec]
        times_padded = [] //in the format or hr, min, sec like the unpadded array above
        times.forEach(element => {
        if (element < 10) {
            times_padded.push("0" + element.toString())
            return
        }
        times_padded.push(element.toString())
        });
        time.namedItem("hr").innerText = times_padded[0]
        time.namedItem("min").innerText = times_padded[1]
        time.namedItem("sec").innerText = times_padded[2]
        remaining_sec %= 60
        t_sec++
    }, 1000);
}