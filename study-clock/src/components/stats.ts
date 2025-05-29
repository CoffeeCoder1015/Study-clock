export function log_break_cache(value:string){
    localStorage.setItem("breakcache",value)
}

export function get_break_cache(){
    const get_result = localStorage.getItem("breakcache")
    if (get_result === null) {
        return "" 
    }
    return get_result
}

// Session structure:
// Start time,
// End time,
// type
// 
// End time is constantly updated while session is underway
// Entire session is constantly being pushed into localStorage
// 
// Session key would be the relevant date
// 

export interface session{
    type: string
    start: Date
    end: Date
}

export function create_session() {
    console.log(Date())
}