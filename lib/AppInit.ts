// it executes when the user logs in
//it handles synchonization with server, so it takes care of
// *Retrieving technician's assigned tasks and activities
// *Checking db for unsynched entities
// *sending those entities to the server and updating local entities



export default function appInit(){
    updateTechData()
    syncUnsynchedData()
}

/* ------------ level 1 --------------- */
//retrieves all of the technician's tasks and activities and saves them to the db 
function updateTechData(){
    fetchData()
    saveData()
}
// checks the db for unsynched data, and either updates it or sends it to the server
function syncUnsynchedData(){
    getUnsynchedData()
    syncData()
}

/* ------------ level 2 --------------- */

//retrieves the technician's tasks and activities
function fetchData(){

}
//saves all the data to the db
function saveData(){

}
//retrieves all unsynched data
function getUnsynchedData(){

}

//attempts to synchronize data
function syncData(){
    
}