var firebase_folder = 'Signed';
var icon_prefix = 'http://maps.google.com/mapfiles/ms/icons/';

let p_stats = document.getElementById('patients-stats');
let dyspnoia = document.getElementById('dyspnoia-stats');
let diahrrea = document.getElementById('diahrrea-stats');
let tachycardia = document.getElementById('tachycardia-stats');
let oxygen = document.getElementById('oxygen-stats');
let lowOsf = document.getElementById('lowosf-stats');
let ponokefalos = document.getElementById('ponokefalos-stats');

let chart = document.getElementById('chartContainer');
let chart2 = document.getElementById('chartContainer2');
let chart3 = document.getElementById('chartContainer3');
let chart4 = document.getElementById('chartContainer4');
let chart5 = document.getElementById('chartContainer5');
let chart6 = document.getElementById('chartContainer6');
let chart7 = document.getElementById('chartContainer7');

let keypoints = [];
let keypoints2 = [];
let keypoints3 = [];
let keypoints4 = [];
let keypoints5 = [];
let keypoints6 = [];
let keypoints7 = [];
let keypoints8 = [];

let once = false;
let once2 = false;
let once3 = false;
let once4 = false;
let once5 = false;
let once6 = false;
let once7 = false;
let once8 = false;

function initMap() {
    
    map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 38.030233, lng: 23.749884}, //map center
    zoom: 15 //init zoom level
    })
    database.ref(firebase_folder).on('child_added', (snap) => {
        suffix = 'yellow-dot.png';
        var map_marker = new google.maps.Marker({
            position: { lat: parseFloat(snap.val().lat), lng: parseFloat(snap.val().lng) },
            map: map,
            title: snap.val().user.toString(),
            icon: {
                url: icon_prefix + suffix
            }
        });
    })
}


    

ill_elem = document.getElementById('ill');
dys_elem = document.getElementById('dys');
diar_elem = document.getElementById('diar');
tachy_elem = document.getElementById('tach');
oxy_elem = document.getElementById('oxy');
low_elem = document.getElementById('low');
ponok_elem = document.getElementById('ponok');
let count = 0;
let count2 = 0;
let count3 = 0;
let count4 = 0;
let count5 = 0;
let count6 = 0;
let count7 = 0;
database.ref(firebase_folder).on('child_added', (snap) => {
    if(snap.val().temperature > 39){
        count++;

        ill_elem.innerHTML = 'Πυρετός: ' + count;
        
    }
    if(snap.val().dyspnoea){
        count2++;
        
        dys_elem.innerHTML = 'Δύσπνοια: ' + count2;
    }
    if(snap.val().diarrhea){
        count3++;
        diar_elem.innerHTML = 'Διάρροια: ' + count3;
    }
    if(snap.val().tachycardia){
        count4++;
        tachy_elem.innerHTML = 'Ταχυκαρδία: ' + count4;
    }
    if(snap.val().oxygen < 93){
        count5++;
        oxy_elem.innerHTML = 'Υποβαθμισμένο αξυγόνο: ' + count5;
    }
    if(snap.val().lack_of_smell){
        count6++;
        low_elem.innerHTML = 'Έλλειψη Όσφρησης: ' + count6;
    }
    if(snap.val().ponokefalos){
        count7++;
        ponok_elem.innerHTML = 'Πονοκέφαλος: ' + count7;
    }
})
statOnClick(ill_elem, chart, p_stats);

document.getElementById('stats-container').onscroll = () => {
    if(!once8){
        once8 = true;
        percent = {};
        coords.forEach(elem => {
          percent[elem.name] = (countEupathisByArea(elem.name, firebase_folder) / countEupathis(firebase_folder)) * 100;
        })
        
        for(key in percent){
           console.log(key);
           keypoints8.push({y: percent[key], label: key});
        }
        var chart8 = new CanvasJS.Chart("chartContainer8", {
            animationEnabled: true,
            theme: "light1",
            title: {
                text: "Ευπαθείς / Μη Ευπαθείς"
            },
            data: [{
                type: "pie",
                startAngle: 240,
                yValueFormatString: "##0.00\"%\"",
                indexLabel: "{label} {y}",
                dataPoints: keypoints8
            }]
        });
        chart8.render();
    }
    
}

function statOnClick(elem, chart, div) {
    elem.addEventListener('click', () => {
        if (div.style.height != '280px') {
            div.style.height = '280px';
            chart.style.display = 'block';
            
        }
        else {
            div.style.height = '60px';
            chart.style.display = 'none';
        }
    });
}
