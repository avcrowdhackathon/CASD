var icon_prefix = 'http://maps.google.com/mapfiles/ms/icons/';
var map;
let calls_cont = document.getElementById('calls');
let checks_cont = document.getElementById('checks');
let once = false;

function initMap() {
    
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 38.030233, lng: 23.749884}, //map center
      zoom: 15 //init zoom level
    })
}

function countWaiting(){
    count = 0
    database.ref('Calls').on('child_added', (snap) => {
        if(snap.val().finished == false){
            count++;
        }
    })
    return count;
}

function getUserData(user, data){
    let dat;
    database.ref('Calls').on('child_added', (snap) => {
        if(snap.val()['user'] == user){
            dat = snap.val()[data];
        }
    })
    return dat;
}

function fixDublicationGlitch(){
    console.log(calls_cont.childElementCount, countWaiting());
    
    while(calls_cont.childElementCount > countWaiting()){
        
        removeLastChild(calls_cont);
    }
}

function simulateDrone(user_key){
    if(!once){
        once = true;
        setTimeout(() => {
            database.ref('Calls/' + user_key).update({finished: true});
            database.ref('Calls/' + user_key).update({
                temperature: (Math.random() * (40 - 35.8) + 35.8).toFixed(1),
                oxygen: Math.floor(Math.random() * (100 - 85) + 85),
                diarrhea: Math.random() >= 0.6,
                dyspnoea: Math.random() >= 0.8,
                tachycardia: Math.random() >= 0.55,
                lack_of_smell: Math.random() >= 0.65
            })
            mainThread();
        }, Math.random() * (20000 - 9000) + 9000);
    }
}

function mainListener(){
    removeAllChildren(calls_cont);
    removeAllChildren(checks_cont);
    refreshcalls();

    function refreshcalls() {
        database.ref('Calls').on('child_added', (snap) => {
            let user_coords = {lat: parseFloat(snap.val().lat), lng: parseFloat(snap.val().lng)};

            suffix = 'red-dot.png';
            var map_marker = new google.maps.Marker({
                position: { lat: parseFloat(snap.val().lat), lng: parseFloat(snap.val().lng) },
                map: map,
                title: 'test',
                icon: {
                    url: icon_prefix + suffix
                }
            });
            color = '';
            
            [].forEach.call(document.getElementsByClassName('btn'), (elem) => {
                if(findClosestArea(user_coords) == elem.value){
                    color = elem.style.backgroundColor;
                }
            })

            let area_text = document.createElement('h5');
            area_text.innerHTML = findClosestArea(user_coords);
            area_text.setAttribute('class', 'area-text');
            

            let new_call = document.createElement('h3');
            
            new_call.innerHTML = snap.val().user;
            new_call.appendChild(area_text);
            new_call.style.color = color;
            
            if(snap.val().finished){
                new_call.setAttribute('class', 'checked');
                new_call.style.backgroundColor = classifyToColor(snap.val().temperature, snap.val().oxygen, snap.val().diarrhea, snap.val().dyspnoea, snap.val().tachycardia, snap.val().lack_of_smell);
                clickEvent(new_call, snap);

                checks_cont.appendChild(new_call);
                checks_cont.scrollBy(0, 100);
            }
            else{
                new_call.setAttribute('class', 'call');
                new_call.addEventListener('click', elem => {
                    goTo(user_coords, 15);
                });
                calls_cont.appendChild(new_call);
                calls_cont.scrollBy(0, 100);
                fixDublicationGlitch();
                simulateDrone(getKey(snap.val().user, 'Calls'));
            }
            once = false;
            
        });

        //function refreshFinished(){
        //    database.ref('Calls').on('value', (snap) => {
        //        removeAllChildren(calls_cont);
        //    })
        //}
        //refreshFinished();
    
        database.ref('Calls').on('child_removed', () => {
            removeAllChildren(calls_cont);
            removeAllChildren(checks_cont);
            refreshcalls();
            initMap();
        });

    }
    
}

function mainThread(){
    if(!once){
        [].forEach.call(document.getElementsByClassName('btn'), elem => {
            elem.addEventListener('click', () => {
                for(i of coords){
                    if(i['name'] == elem.value){
                        goTo({lat:i.lat, lng:i.lng}, 15);
                    }
                }
            })
        })
        mainListener();
    }
    
}

mainThread();
