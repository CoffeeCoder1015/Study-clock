export function log_coords(lat:number,lon:number){
    localStorage.setItem("coord",JSON.stringify({lat,lon}))
}

export function get_coords(): {lat:number, lon: number} {
    const get_result = localStorage.getItem("coord")
    if (get_result === null) {
        return {lat:0,lon:0} 
    }
    return JSON.parse(get_result)
}