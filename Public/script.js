var map, heatMapLayer, defaultOptions, removeDefaults, selectedGradientIdx = 0;
var magWeight = [
    'interpolate',
    ['linear'],
    ['get', 'mag'],
    0, 0,
    6, 1
];
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
    createGradientOptions();
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
            gradientSelected(document.getElementById('gradientDropdown').childNodes[0], 0);
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

function updateHeatMapLayer() {
    var options = getInputOptions();
    heatMapLayer.setOptions(options);

    document.getElementById('CodeOutput').value = JSON.stringify(options, null, '\t').replace(/\"([^(\")"]+)\":/g, "$1:");
}
function getInputOptions() {
    removeDefaults = document.getElementById('RemoveDefaults').checked;

    return {
        color: heatGradients[0],
        radius: 15,
        opacity: 0.6,
        intensity: 6,
        weight: 0.6,
        minZoom: getPropertyValue('minZoom', parseFloat(document.getElementById('MinZoom').value)),
        maxZoom: getPropertyValue('maxZoom', parseFloat(document.getElementById('MaxZoom').value)),
        visible: getPropertyValue('visible', document.getElementById('Visible').checked)
    };
}
function getPropertyValue(propertyName, value) {
    if (removeDefaults && defaultOptions[propertyName] === value) {
        return undefined;
    }
    return value;
}
function getSelectValue(id) {
    var elm = document.getElementById(id);
    return elm.options[elm.selectedIndex].value;
}
function openTab(elm, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    elm.className += " active";
}
function createGradientOptions() {
    var html = [];
    for (var i = 0; i < heatGradients.length; i++) {
        var canvas = document.createElement('canvas');
        canvas.width = 150;
        canvas.height = 15;
        var ctx = canvas.getContext('2d');
        var grd = ctx.createLinearGradient(0, 0, 150, 0);
        for (var j = 3; j < heatGradients[i].length; j += 2) {
            grd.addColorStop(heatGradients[i][j], heatGradients[i][j + 1]);
        }
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, 150, 15);
        html.push('<a href="javascript:void(0)" onclick="gradientSelected(this, ', i, ');"><img src="', canvas.toDataURL(),'"/></a>');
    }
    document.getElementById('gradientDropdown').innerHTML = html.join('');
}
function gradientSelected(elm, idx) {
    selectedGradientIdx = idx;
    updateHeatMapLayer();
    document.getElementById('gradientDropdownBtn').style.backgroundImage = 'url(' + elm.childNodes[0].src + ')';
    toggleGradientDropdown();
}
function toggleGradientDropdown() {
    document.getElementById("gradientDropdown").classList.toggle("show");
}

function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("mySidenav").style.border = "1px solid black";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("mySidenav").style.border = "none";
}