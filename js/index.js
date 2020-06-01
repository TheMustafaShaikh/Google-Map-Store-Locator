var markers = [];
var map;
var infoWindow;

function initMap() {
    var location = {
        lat: 34.0522,
        lng: -118.2437
    }
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 6,
        center: location,
        styles: [{
            elementType: 'geometry',
            stylers: [{
                color: '#242f3e'
            }]
        }, {
            elementType: 'labels.text.stroke',
            stylers: [{
                color: '#242f3e'
            }]
        }, {
            elementType: 'labels.text.fill',
            stylers: [{
                color: '#746855'
            }]
        }, {
            featureType: 'administrative.locality',
            elementType: 'labels.text.fill',
            stylers: [{
                color: '#d59563'
            }]
        }, {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [{
                color: '#d59563'
            }]
        }, {
            featureType: 'poi.park',
            elementType: 'geometry',
            stylers: [{
                color: '#263c3f'
            }]
        }, {
            featureType: 'poi.park',
            elementType: 'labels.text.fill',
            stylers: [{
                color: '#6b9a76'
            }]
        }, {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{
                color: '#38414e'
            }]
        }, {
            featureType: 'road',
            elementType: 'geometry.stroke',
            stylers: [{
                color: '#212a37'
            }]
        }, {
            featureType: 'road',
            elementType: 'labels.text.fill',
            stylers: [{
                color: '#9ca5b3'
            }]
        }, {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [{
                color: '#746855'
            }]
        }, {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [{
                color: '#1f2835'
            }]
        }, {
            featureType: 'road.highway',
            elementType: 'labels.text.fill',
            stylers: [{
                color: '#f3d19c'
            }]
        }, {
            featureType: 'transit',
            elementType: 'geometry',
            stylers: [{
                color: '#2f3948'
            }]
        }, {
            featureType: 'transit.station',
            elementType: 'labels.text.fill',
            stylers: [{
                color: '#d59563'
            }]
        }, {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{
                color: '#17263c'
            }]
        }, {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{
                color: '#515c6d'
            }]
        }, {
            featureType: 'water',
            elementType: 'labels.text.stroke',
            stylers: [{
                color: '#17263c'
            }]
        }]
    });
    infoWindow = new google.maps.InfoWindow({
        pixelOffset: new google.maps.Size(4, 20)
    });

    searchPostalNumber();
    setOnClickContainer();
    //showMultipleStores();
    //StoreDatatoList();


}

function setOnClickContainer() {
    var addressContainer = document.querySelectorAll('.address');
    addressContainer.forEach(function(element, index) {
        element.addEventListener('click', function() {
            google.maps.event.trigger(markers[index], 'click');
        })
    });
}


function clearLocation() {
    infoWindow.close();
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers.length = 0;

}






function searchPostalNumber() {
    var inputFromUser = document.getElementById('postal-code-input').value;
    var foundLocations = [];
    if (inputFromUser) {
        stores.forEach(function(store, index) {
            var postalcode = store.address.postalCode;
            if (postalcode.indexOf(inputFromUser) != -1) {
                foundLocations.push(store);
            }

        });
    } else {
        foundLocations = stores;
    }

    console.log(foundLocations);


    clearLocation();
    StoreDatatoList(foundLocations);
    showMultipleStores(foundLocations);
    setOnClickContainer();
}




function StoreDatatoList(stores) {
    var storingAddress = "";
    stores.forEach(function(element, index) {
        var address0 = element.addressLines[0];
        var address1 = element.addressLines[1];
        var phoneNumber = element.phoneNumber;


        storingAddress += `<div class="address">
    <p class="address-street">
        <span id="street">${address0}</span><br /><span id="area">${address1}</span><br/><span class="phone-number">${phoneNumber}</span></p>
    <span class="number"><span>${index+1}</span></span>

</div>`;

    });

    //now setting up these details to html;

    document.querySelector('.list-of-address').innerHTML = storingAddress;

}

function showMultipleStores(stores) {
    var bounds = new google.maps.LatLngBounds();
    stores.forEach(function(element, index) {
        var latlng = new google.maps.LatLng(
            element.coordinates.latitude,
            element.coordinates.longitude);
        var name = element.name;
        var address = element.openStatusText;
        var phone = element.phoneNumber;
        var second_address = element.addressLines[1];
        bounds.extend(latlng);
        createMarker(latlng, name, address, phone, second_address);
    });
    map.fitBounds(bounds);

}



function createMarker(latlng, name, address, phone, second_address) {
    var api_location = "https://www.google.com/maps/dir/?api=1&origin=Los Angeles&destination=" + second_address + "&travelmode=driving";
    //var html = "<div class='bg'><b>" + name + "</b> <br/>" + address + "</div> <br/> <div class='img-map'><img src='images/map.png' alt='map' width='20px'><a class='api_loction_link' target='_blank' href='" + api_location + "'>" + second_address + "</a></div><div class='phone'><img src='images/phone.png' alt='phone' width='15px'> " + phone + "</div>";
    var html = `
    <div class="all-infowindow-container">
    <div class="left-logo">
        <img src="images/coffee-logo.png" alt="coffee-logo!" width="50">
    </div>
    
    <div class="right-info">
        <div class="bg">
            <b>${name}</b> 
            <br/><span id="open-status">${address}</span>
    </div> 
    <br/>
    <div class="img-map">
        <div class="cricle">
            <img src="images/map.png" alt="map" width="20px">
        </div>
        <a class="api_loction_link" target="_blank" href="${api_location}"> ${second_address}</a>
    </div>
    <div class="phone">
        <div class="cricle">
            <img src="images/phone.png" alt="phone" width="15px"> 
        </div>    
        ${phone} 
    </div>
    </div>
    <div>
    `;
    var marker = new google.maps.Marker({
        map: map,
        position: latlng,
        icon: 'images/star1.png',
        draggable: true,
        animation: google.maps.Animation.DROP



    });



    google.maps.event.addListener(marker, 'click', function() {

        infoWindow.setContent(html);

        infoWindow.open(map, marker);



    });

    markers.push(marker);

}