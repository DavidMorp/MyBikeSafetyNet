var map, heatMapLayer, defaultOptions, removeDefaults, selectedGradientIdx = 0;
var magWeight = [
    'interpolate',
    ['linear'],
    ['get', 'mag'],
    0, 0,
    6, 1
];
var heatGradients = [
    //Default
    [
        "interpolate",
        ["linear"],
        ["heatmap-density"],
        0, "rgba(0,0,255,0)",
        0.1, "royalblue",
        0.3, "cyan",
        0.5, "lime",
        0.7, "yellow",
        1, "red"
    ],
    //Default with semi-transparent black mask
    [
        "interpolate",
        ["linear"],
        ["heatmap-density"],
        0, "rgba(0,0,0,0.5)",
        0.1, "royalblue",
        0.3, "cyan",
        0.5, "lime",
        0.7, "yellow",
        1, "red"
    ],
    //Color Spectur
    [
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0, 'rgba(0,0,0,0)',
        0.01, 'navy',
        0.25, 'blue',
        0.5, 'green',
        0.75, 'yellow',
        1, 'red'
    ],
    //Incandescent
    [
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0, 'rgba(0,0,0,0)',
        0.01, 'black',
        0.33, 'darkred',
        0.66, 'yellow',
        1, 'white'
    ],
    //Heated Metal
    [
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0, 'rgba(0,0,0,0)',
        0.01, 'black',
        0.25, 'purple',
        0.5, 'red',
        0.75, 'yellow',
        1, 'white'
    ],
    //Sunrise
    [
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0, 'rgba(0,0,0,0)',
        0.01, 'red',
        0.66, 'yellow',
        1, 'white'
    ],
    //Stepped Colors
    [
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0, 'rgba(0,0,0,0)',
        0.01, 'navy',
        0.25, 'navy',
        0.26, 'green',
        0.5, 'green',
        0.51, 'yellow',
        0.75, 'yellow',
        0.76, 'red',
        1, 'red'
    ],
    //Sunrise
    [
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0, 'rgba(0,0,0,0)',
        0.01, '#feb24c',
        0.03, '#feb24c',
        0.5, '#fd8d3c',
        0.7, '#fc4e2a',
        1, '#e31a1c'
    ],
    //Light blue to red
    [
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0, 'rgba(33,102,172,0)',
        0.2, 'rgb(103,169,207)',
        0.4, 'rgb(209,229,240)',
        0.6, 'rgb(253,219,199)',
        0.8, 'rgb(239,138,98)',
        1, 'rgb(178,24,43)'
    ],
    //Gray to Aqua Green
    [
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0, 'rgba(236,222,239,0)',
        0.2, 'rgb(208,209,230)',
        0.4, 'rgb(166,189,219)',
        0.6, 'rgb(103,169,207)',
        0.8, 'rgb(28,144,153)'
    ],
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
    map = new atlas.Map('myMap');
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
        fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson')
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
    });
    new ClipboardJS('.copyBtn');
}
function updateHeatMapLayer() {
    var options = getInputOptions();
    heatMapLayer.setOptions(options);

    document.getElementById('CodeOutput').value = JSON.stringify(options, null, '\t').replace(/\"([^(\")"]+)\":/g, "$1:");
}
function getInputOptions() {
    removeDefaults = document.getElementById('RemoveDefaults').checked;

    return {
        color: (removeDefaults && selectedGradientIdx == 0)? undefined: heatGradients[selectedGradientIdx],
        radius: getPropertyValue('radius', parseFloat(document.getElementById('Radius').value)),
        opacity: getPropertyValue('opacity', parseFloat(document.getElementById('Opacity').value)),
        intensity: getPropertyValue('intensity', parseFloat(document.getElementById('Intensity').value)),
        weight: document.getElementById('Weight').checked ? magWeight: 1,
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

function showPlot() {
    document.getElementById("plotDropdown").classList.toggle("show");
}