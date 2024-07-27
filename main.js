//time values inputted for countdown
var hr = 0;
var min = 0;
var sec = 0;

function pad_time(hr,min,sec) {
    times = [hr,min,sec]
    times_padded = [] //in the format or hr, min, sec like the unpadded array above
    times.forEach(element => {
       if (element < 10) {
           times_padded.push("0" + element.toString())
           return
       }
       times_padded.push(element.toString())
    });
    return times_padded
}

function set_title_text(text) {
    document.getElementById("title").innerText = text
}

function input_time(){
    var input = document.getElementById("timer-in")
    input.focus()
}

function update_text(t,e) {
    var text = String(t.value)
    if (text.length > 6){
        text = text.substring(text.length-6,text.length)
        t.value = text
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

function clear_input(t) {
    t.value = "" 
}


class Phase{
    constructor(){
        this.stimer = document.getElementById("stimer_parent")
        this.btimer = document.getElementById("btimer_parent")
        this.logical_stimer = null
        this.logical_btimer = null
        //states the web app can be in 
        this.homescreen = 0
        this.study = 1
        this.break = 1
        //start with homescreeen state
        this.state = this.homescreen
        
        //on start up stuff
        document.getElementById("start").style.display = "unset"
    }

    auto_restart(t){
        if(this.state == this.break && t.value != ""){
            this.logical_btimer = this.countdown()
        }
    }
    
    recalculate() {
        this.reset_timer(this.btimer,this.logical_btimer)
        //reformats the time set in the timer when it is improper
        //e.g 00:00:90 → 00:01:30
        min += parseInt(sec/60)
        sec %= 60
        hr += parseInt( min/60 )
        min %= 60
        var time =document.getElementById("btimer").children
        var times_padded = pad_time(hr,min,sec)
        time.namedItem("hr").innerText = times_padded[0]
        time.namedItem("min").innerText = times_padded[1]
        time.namedItem("sec").innerText = times_padded[2]
    }

    reset_timer(disp_timer,log_timer){
        //resets the displayed timer and the logical timer
        clearInterval(log_timer)
        if(log_timer == this.logical_stimer){
            this.logical_stimer = null
        }else{
            this.logical_btimer = null
        }
        var time = disp_timer.children[1].children[0].children
        time.namedItem("hr").innerText = "00"
        time.namedItem("min").innerText = "00"
        time.namedItem("sec").innerText = "00"
    }

    start_session(){
        this.state = this.study
        this.btimer.className = "start_session_b"
        this.stimer.className = "start_session"
        this.logical_stimer = this.countup()
        document.getElementById("start").style.display = "none"
        document.getElementById("break").style.display = "unset"
        document.getElementById("end").style.display = "unset"
    }
    
    end_session(){
        this.state = this.homescreen
        this.reset_timer(this.stimer,this.logical_stimer)
        this.reset_timer(this.btimer,this.logical_btimer)
        this.recalculate()
        this.btimer.className = ""
        this.stimer.className = "homescreen_state"
        document.getElementById("container").style.flexDirection = "column"
        document.getElementById("start").style.display = "unset"
        document.getElementById("end").style.display = "none"
        document.getElementById("break").style.display = "none"
        document.getElementById("study").style.display = "none"
        set_title_text("Study timer")
    }
    
    enter_break(){
        this.state = this.break
        clearInterval(this.logical_stimer)
        this.logical_stimer = null
        var time = this.stimer.children[1].children[0].children
        time.namedItem("hr").innerText = "00"
        time.namedItem("min").innerText = "00"
        time.namedItem("sec").innerText = "00"
        this.stimer.className = "slideout"
        document.getElementById("container").style.flexDirection = "column-reverse"
        this.btimer.className = "slidein"
        this.logical_btimer = this.countdown()
        document.getElementById("break").style.display = "none"
        document.getElementById("study").style.display = "unset"
    }
    
    enter_study(){
        this.state = this.study
        clearInterval(this.logical_btimer)
        this.recalculate()
        this.logical_btimer = null
        this.btimer.className = "slideout"
        document.getElementById("container").style.flexDirection = "column"
        this.stimer.className = "slidein"
        this.logical_stimer = this.countup()
        document.getElementById("break").style.display = "unset"
        document.getElementById("study").style.display = "none"
    }
    
    countdown(){
        if(this.logical_btimer != null){
            console.log("Already started")
            return this.logical_btimer
        }
        var countdown_sec = sec+min*60+hr*3600;
        var time = this.btimer.children[1].children[0].children
        var x = setInterval(() => { //  x set here
            if (countdown_sec <= 0){
                this.reset_timer(this.btimer,x)
            }
            var cd_hrs = parseInt(countdown_sec/3600)
            var remaining_sec = countdown_sec%3600
            var cd_min = parseInt(remaining_sec/60)
            remaining_sec %= 60
            var times_padded = pad_time(cd_hrs,cd_min,remaining_sec)
            if(this.btimer.children[1].children[1] != document.activeElement){
                time.namedItem("hr").innerText = times_padded[0]
                time.namedItem("min").innerText = times_padded[1]
                time.namedItem("sec").innerText = times_padded[2]
            }
            set_title_text("Break!🥳 "+times_padded[0]+":"+times_padded[1]+":"+times_padded[2])
            remaining_sec %= 60
            countdown_sec--
        }, 1000);
        return x
    }
    
    countup(){
        if(this.logical_stimer != null){
            console.log("Already started")
            return this.logical_stimer
        }
        var t_sec = 0;
        var time = this.stimer.children[1].children[0].children
        // var time =document.getElementById("stimer").children
        return setInterval(() => { //  x set here
            var cu_hrs = parseInt(t_sec/3600)
            var remaining_sec = t_sec%3600
            var cu_min = parseInt(remaining_sec/60)
            remaining_sec %= 60
            var times_padded = pad_time(cu_hrs,cu_min,remaining_sec)
            time.namedItem("hr").innerText = times_padded[0]
            time.namedItem("min").innerText = times_padded[1]
            time.namedItem("sec").innerText = times_padded[2]
            set_title_text("Study!📝"+times_padded[0]+":"+times_padded[1]+":"+times_padded[2])
            remaining_sec %= 60
            t_sec++
        }, 1000);
    }
}