var map, heatMapLayer, defaultOptions = 0;

var heatGradients = [
    //Purple, pink, light blue
    [
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0, 'rgba(0,0,0,0)',
        0.01, 'purple',
        0.5, '#fb00fb',
        1, '#00c3ff'
    ]
];
function GetMap() {
    //Add your Azure Maps subscription key to the map SDK. Get an Azure Maps key at https://azure.com/maps
    atlas.setSubscriptionKey('Fp4Ibij15dsJdAIQYD_vUKwOXrYtK-PvGo3yDHZ2rnQ');
    //Initialize a map instance.
    map = new atlas.Map('myMap', {
        center: [-1.2577, 51.7520],
        zoom: 14
    });


    //Wait until the map resources have fully loaded.
    map.events.add('load', function (e) {
        //Create a style control and add it to the map.
        map.controls.add(new atlas.control.StyleControl({
            style: 'dark'
        }), {
            position: 'top-right'
        });
        //Create a data source and add it to the map.
        var datasource = new atlas.source.DataSource();
        map.sources.add(datasource);
        //Load a data set of points, in this case earthquake data from the USGS.
        fetch("data/bike_theft_data_1.txt", {mode: "no-cors"})
            .then(function (response) {
                return response.json();
            }).then(function (response) {
            //Add the earthquake data to the data source.
            datasource.add(response.features);
            //Create a heat map layer and add it to the map.
            heatMapLayer = new atlas.layer.HeatMapLayer(datasource);
            map.layers.add(heatMapLayer, 'labels');
            defaultOptions = heatMapLayer.getOptions();
            //Update the heat map layer with the options in the input fields.
            var options = getInputOptions();
            heatMapLayer.setOptions(options);
        });

        navigator.geolocation.getCurrentPosition(function (position) {
            //Create a data source and add it to the map.
            var datasource = new atlas.source.DataSource();
            map.sources.add(datasource);
            //Create a circle from a Point feature by providing it a subType property set to "Circle" and radius property.
            var userPosition = [position.coords.longitude, position.coords.latitude];
            var userPoint = new atlas.data.Point(userPosition)
            //Add a point feature with Circle properties to the data source for the users position. This will be rendered as a polygon.
            datasource.add(new atlas.data.Feature(userPoint, {
                subType: "Circle",
                radius: position.coords.accuracy
            }));

            datasource.add(userPoint);

            map.layers.add([
                //Create a polygon layer to render the filled in area of the accuracy circle for the users position.
                new atlas.layer.PolygonLayer(datasource, null, {
                    fillColor: 'rgba(0, 153, 255, 0.5)'
                }),
                //Create a symbol layer to render the users position on the map.
                new atlas.layer.SymbolLayer(datasource, null, {
                    filter: ['==', '$type', 'Point']
                })
            ]);
            //Center the map on the users position.
            map.setCamera({
                center: userPosition,
                zoom: 15
            });
        });



        new ClipboardJS('.copyBtn');
    });
}

function getInputOptions() {
    return {
        color: heatGradients[0],
        radius: 15,
        opacity: 0.6,
        intensity: 6,
        weight: 0.6,
        minZoom: 10,
        maxZoom: 100
    };
}


function viewPostcode() {
    openNav();
    document.getElementById("postcode").style.width = '300px';
}

function closePostcode() {
    document.getElementById("postcode").style.width = '0';
    openNav();
}

function viewMap() {
    document.getElementById("myMap").classList.toggle("show");
}

function openNav() {
    document.getElementById("mySidenav").classList.toggle("show");
}

function postcodeio() {
    var  postcode = document.getElementById("search").value;
    var lat, long;
    $.ajax({
        url: 'https://api.postcodes.io/postcodes/' + postcode,
        dataType: 'jsonp',
        success: function(json) {
            console.log(json.status);
            long = json.result.longitude, lat = json.result.latitude;
            console.log(lat);
            console.log(long);
        },

        fail: function() {
            alert('ajax fail');
        }
    });




}