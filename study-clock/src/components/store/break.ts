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