var icon_prefix = 'http://maps.google.com/mapfiles/ms/icons/';
var map;
let patients_cont = document.getElementById('patients');
let patient_class = document.getElementsByClassName('patient');
let chat_cont = document.getElementById('chat');
let selection = document.getElementById('sendto');
let firebase_database = 'Signed';

function initMap() {
    
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 38.030233, lng: 23.749884}, //map center
      zoom: 15 //init zoom level
    })
}

function removeAllChildren(node){
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
}

function removeLastChild(div) {
    div.removeChild(div.lastChild);
}

function countWaiting(){
    count = 0
    database.ref(firebase_database).on('child_added', (snap) => {
        if(snap.val().finished == false){
            count++;
        }
    })
    return count;
}

function getUserData(user, data){
    let dat;
    database.ref(firebase_database).on('child_added', (snap) => {
        if(snap.val()['user'] == user){
            dat = snap.val()[data];
        }
    })
    return dat;
}

function getKey(user){
    key = "";
    listen = database.ref(firebase_database);
    listen.on('value', (snap) => {
        for(j in snap.val()){
            database.ref('Calls/' + j).on('child_added', (snapsh) => {
                if(snapsh.val() == user){
                    key = j;
                }
            })
        }
    })
    listen.off('value');
    return key;
}

function fixDublicationGlitch(){
    console.log(patients_cont.childElementCount, countWaiting());
    
    while(patients_cont.childElementCount > countWaiting()){
        
        removeLastChild(patients_cont);
    }
}

function mainListener(){
    removeAllChildren(patients_cont);
    refreshcalls();

    function refreshcalls() {
        database.ref(firebase_database).on('child_added', (snap) => {
                let user_coords = {lat: parseFloat(snap.val().lat), lng: parseFloat(snap.val().lng)};

                let colorDict = {
                    '#2ecc71': 'green-dot.png',
                    '#fffa65': 'yellow-dot.png',
                    '#e55039': 'red-dot.png'
                }
                let suffix = colorDict[classifyToColor(parseFloat(snap.val().temperature), snap.val().oxygen, snap.val().diarrhea, snap.val().dyspnoea, snap.val().tachycardia, snap.val().lack_of_smell)]
                
                var map_marker = new google.maps.Marker({
                    position: { lat: parseFloat(snap.val().lat), lng: parseFloat(snap.val().lng) },
                    map: map,
                    title: snap.val().temperature,
                    icon: {
                        url: icon_prefix + suffix
                    }
                });
                color = '';
                
                //[].forEach.call(document.getElementsByClassName('btn'), (elem) => {
                //    if(findClosestArea(user_coords) == elem.value){
                //        color = elem.style.backgroundColor;
                //    }
                //})

                let area_text = document.createElement('h5');
                area_text.innerHTML = findClosestArea(user_coords);
                area_text.setAttribute('class', 'area-text');
                

                let patient = document.createElement('h3');
                
                patient.innerHTML = snap.val().user;
                patient.setAttribute('class', 'patient');
                patient.appendChild(area_text);
                patient.style.color = color;
                patient.style.backgroundColor = classifyToColor(parseFloat(snap.val().temperature), parseInt(snap.val().oxygen), snap.val().diarrhea, snap.val().dyspnoea, snap.val().tachycardia, snap.val().lack_of_smell);
                patients_cont.appendChild(patient);

                clickEvent(patient, snap);
        });

    }
    
}

function init(){
    [].forEach.call(document.getElementsByClassName('btn'), elem => {
        elem.addEventListener('click', () => {
            for(i of coords){
                if(i['name'] == elem.value){
                    goTo({lat:i.lat, lng:i.lng}, 15);
                }
            }
        })
    })
    database.ref(firebase_database).on('value', () => {
        mainListener();
    })
    mainListener();
}

init();
