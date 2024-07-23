//time values inputted
var hr = 0;
var min = 0;
var sec = 0;

function input_time(){
    var input = document.getElementById("timer-in")
    input.focus()
}

function update_text() {
    var text = String(document.getElementById("timer-in").value)
    console.log(text)
    if (text.length > 6){
        text = text.substring(text.length-6,text.length)
        document.getElementById("timer-in").value = text
    }
    text = String("0").repeat(6-text.length) + text 
    sec = Number(text.substring(4,6))
    min = Number(text.substring(2,4))
    hr = Number(text.substring(0,2))
    var time =document.getElementById("timer-disp").children
    time.namedItem("hr").innerText = text.substring(0,2)
    time.namedItem("min").innerText = text.substring(2,4)
    time.namedItem("sec").innerText = text.substring(4,6)
}

function recalculate() {
    //reformats the time set in the timer when it is improper
    //e.g 00:00:90 → 00:01:30
    min += Math.floor(sec/60) 
    sec %= 60
    hr += Math.floor(min/60)
    min %= 60
    var time =document.getElementById("timer-disp").children
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