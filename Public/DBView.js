var columnValues = [];
var csv;
var dialog;
var form;
var filtersArray = [];
var currentTableData;
var filters = {};
var filtersApplied = false;
var alreadyFiltered = false;
var fromAdd = false;
var hideEmptyValues= false;
var contextItem;
var selectedTR;
var selectedTD;
var updatedEntry;
var removed = false;
var yArray=[];
var xArray = [];
var yAxe = [];
var xAxe = [];
var xLabel;
var yLabel;
var orientation;
var charType;
var chartMode;

/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function showFilters() {
    document.getElementById("myDropdown").classList.toggle("show");
    document.getElementById("addDropdown").classList.remove("show");
    document.getElementById("plotDropdown").classList.remove("show");

    // document.getElementById("filtersbutton").classList.toggle("selected");
    // document.getElementById("filterRefresh").classList.remove("selected");
    // document.getElementById("addRemove").classList.remove("selected");
}

function showAddRow() {
    document.getElementById("addDropdown").classList.toggle("show");
    document.getElementById("myDropdown").classList.remove("show");
    document.getElementById("plotDropdown").classList.remove("show");

    // document.getElementById("addRemove").classList.toggle("selected");
    // document.getElementById("filtersbutton").classList.remove("selected");
    // document.getElementById("filterRefresh").classList.remove("selected");
}

function showPlot() {
    document.getElementById("plotDropdown").classList.toggle("show");
    document.getElementById("addDropdown").classList.remove("show");
    document.getElementById("myDropdown").classList.remove("show");

    // document.getElementById("filtersbutton").classList.toggle("selected");
    // document.getElementById("addRemove").classList.remove("selected");
    // document.getElementById("filterRefresh").classList.remove("selected");
}

function showPlotMenu() {
    document.getElementById("plotMenuDropdown").classList.toggle("show");

    //document.getElementById("plotButton").classList.toggle("selected");
}

function refreshTable() {
    if($('.sliderInput').prop('checked')){
        hideEmptyValues = true;
    }else {
        hideEmptyValues = false;
    }
    filters = {};
    filtersApplied = true;
    var label;
    if($("#myDropdown > div").length > 1){
        $('#myDropdown').children('div').children('input').each(function () {
                label = $('label[for="' + $(this).attr("id") + '"]').html();
                label = label.substring(0, label.length-1)
                filters[label] = this.value;
        });
        //filtersArray.push(filter);
        console.log(filters);
        var table = $('#table');
  
        table.remove();
        table = $("<table/>");
        table.attr('id', 'table');
    
        $("#tableContainer").append(table);

        var filtersContainer = $('#myDropdown');
        filtersContainer.empty();
        
        var addNewRow = $('#addDropdown');
        addNewRow.empty();

        var plot = $('.leftDiv');
        plot.empty();

        alreadyFiltered = true;

        if(fromAdd){
            fromAdd = false;
            showAddRow();
        }else{
            showFilters();
        }

        csvJSON(currentTableData);

    }
}

function addNewRow() {
    fromAdd = true;
    filters = {};
    filtersApplied = true;
    var newLine = ""; 
    if($("#addDropdown > div").length > 1){
        $('#addDropdown').children('div').children('input').each(function () {
            newLine += this.value + ",";
        });
        newLine = newLine.substring(0, newLine.length - 1);
        currentTableData.splice(1, 0, newLine);

        refreshTable();

    }
}

function plotValues(){
    var xAxe = [];
    var yAxe = [];
    var plot1,plot2;
    var xLabel,yLabel;
    var firstplot = true;
    var selectedChart = $(".plotSelect").val();
    $('#plotDropdown > div > input').each(function(){
        var label = $("label[for='" + $(this).attr('id') + "']").text();
        if($(this).is(':checked')){
            if(firstplot){
                plot1 = $(this).attr('id');
                firstplot = false;
                xLabel = label;
            }else{
                plot2 = $(this).attr('id');
                yLabel = label;
            }
            console.log("Selected Values:", label);
        }
    });

    plot1 = plot1.charAt(plot1.length-1);
    plot2 = plot2.charAt(plot2.length-1);

    console.log("Plot1:", plot1);
    console.log("Plot2:", plot2);
    var currentTd;
    $('#tableBody > tr').each(function(){
        currentTd = $(this).children().get(plot1);
        xAxe.push($(currentTd).html());
        currentTd = $(this).children().get(plot2);
        yAxe.push($(currentTd).html());
    });
    console.log("X axe:", xAxe);
    console.log("Y axe:", yAxe);
    window.open("file:../HTML/Chart1.html");
    localStorage.setItem("xAxe",JSON.stringify(xAxe));
    localStorage.setItem("yAxe",JSON.stringify(yAxe));
    localStorage.setItem("xLabel",xLabel);
    localStorage.setItem("yLabel",yLabel);
    localStorage.setItem("selectedChart",selectedChart);
}


/* Read Data from CSV*/
$(document).ready(function(){
    var currentRow = selectedTR;
    $('#removeRow').click(function(){
        var r = confirm("Are you sure you want to remove the selected row?");
        if (r == true) {
            alert("Line succesfully removed.");
            removed = true;
            editRemove();
        } else {
            alert("Action canceled.");
        }
        
    });

    $('#updateEntry').click(function(){
        var currentCell = selectedTD;
        var r = prompt("Please enter new value:", currentCell.text());
        if (r == null || r == "") {
            alert("Action canceled.");
        } else {
            alert("Succesfully updated entry.");
            updatedEntry = r;   
            editRemove();
        }
       
    });

    $('#save').click(function(){
        var r = confirm("Are you sure you want to save the table?");
        if (r == true) {
            alert("Data successfully saved!");
            var download = [];
            currentTableData.forEach(function(line){
                download.push("\n" + line);
            });

            var data, filename, link;
            var csv = download;
            if (csv == null) return;
    
            filename = 'export.csv';
    
            //if (!csv.match(/^data:text\/csv/i)) {
                csv = 'data:text/csv;charset=utf-8,' + csv;
            
            data = encodeURI(csv);
    
            link = document.createElement('a');
            link.setAttribute('href', data);
            link.setAttribute('download', filename);
            link.click();
        } else {
            alert("Action canceled.");
        }
        console.log(download);
    });

    $('#upload').click(function(){
        filtersApplied = false;
        var title = "";
        title =   $('#filename')[0].files[0].name;
        //title.replace("_",/ /g);
        //title.substring(0, title.indexOf(".csv"));

        //console.log(title);
        $('#DBTitle').text(title);
        
        var table = $('#table');
  
        table.remove();
        table = $("<table/>");
        table.attr('id', 'table');
    
        $("#tableContainer").append(table);

        var filters = $('#myDropdown');
        filters.empty();

        var plot = $('.leftDiv');
        plot.empty();

        filtersArray = [];

        var csv = $('#filename');
        var csvFile = csv[0].files[0];
        var ext = csv.val().split(".").pop().toLowerCase();

        if($.inArray(ext, ["csv"]) === -1){
            alert('upload csv');
            return false;
        }
        if(csvFile != undefined){
            reader = new FileReader();
            reader.onload = function(e){
                csvResult = e.target.result.split(/\r|\n|\r\n/);
                //$('.csv').append(csvResult);
                currentTableData = csvResult;
                csvJSON(csvResult);
            }
            reader.readAsText(csvFile);
        }
    });
}); 

function csvJSON(csv){

    var lines=csv;
  
    var result = [];
  
    var headers=lines[0].split(",");

    var reference = false;
    var counter;
  
    for(var i=1;i<lines.length;i++){
  
        var obj = {};
        var initialLine=lines[i].split(",");
        var currentline = [];
        var final = false;
        counter = 0;

        for(var j=0;j<initialLine.length;j++){
            if(initialLine[j].indexOf("\"") == 0 || final){
                if(initialLine[j].indexOf("\"")==initialLine[j].length - 1){
                    currentline[j - counter] += initialLine[j];
                    final = false;
                }else{
                    final = true;
                    if(currentline[j - counter] == undefined){
                        currentline[j] = initialLine[j];
                    }else{
                        currentline[j - counter] += initialLine[j];
                    }
                    //console.log(counter);
                    counter ++;
                }
            }else{
                currentline.push(initialLine[j]);
            }
        }

        for(var j=0;j<headers.length;j++){
            
            obj[headers[j]] = currentline[j];
        }
  
        result.push(obj);
  
    }
    var tempArray = JSON.stringify(result[1]).split(",");

    columnValues = [];

    for (var i = 0; i < tempArray.length; i++) {
        columnValues.push(tempArray[i].substring(tempArray[i].indexOf("\"") + 1,tempArray[i].indexOf("\":")));
    }

    var newCell;
    var newRow;
    var tableHead;
    var filterLabel;
    var filterInput;
    var filtersLenght = Math.floor(columnValues.length / 2 );
    var happened = false;

    tableHead = $('<thead/>');
    newRow = $('<tr/>');
    var filterItem = $('<div/>');
    filterItem.addClass('leftDiv');
    var plotItem = $('.leftDiv');

    for (var i = 0; i < columnValues.length; i++) {
        newCell = $('<th/>');
        newCell.text(columnValues[i].trim());
        newCell.addClass("tableHeaders");
        newRow.append(newCell);

        if( i > filtersLenght && !happened){
            $('#addDropdown').append(filterItem.clone());
            $("#myDropdown").append(filterItem.clone());
            // $("#plotDropdown").append(plotItem);
            var filterItem = $('<div/>');
            filterItem.addClass('rightDiv');
            // var plotItem = $('<div/>');
            // plotItem.addClass('rightDiv');
            happened = true;
        }
        filterLabel = $('<label/>');
        filterLabel.attr("for", columnValues[i]);
        filterLabel.text(columnValues[i].trim() + ":");
        filterItem.append(filterLabel);

        filterInput = $('<input/>');
        filterInput.attr("id", columnValues[i]);
        filterInput.attr("type", "text");
        if(alreadyFiltered){
            filterInput.val(filters[columnValues[i]]);
        }else{
            filterInput.attr("placeholder", "...");
        }
        filterItem.append(filterInput);

        filterItem.append($('<br>'));

        //plot menu
        plotInput = $('<input/>');
        plotInput.attr("id", "plot_" + i);
        plotInput.attr("type", "checkbox");
        plotItem.append(plotInput);

        plotLabel = $('<label/>');
        plotLabel.attr("for", "plot_" + i);
        plotLabel.addClass("btn");
        plotLabel.text(columnValues[i].trim());
        plotItem.append(plotLabel);

        plotItem.append($('<br>'));

        
    }
    $('#addDropdown').append(filterItem.clone());
    $("#myDropdown").append(filterItem.clone());
    // $("#plotDropdown").append(plotItem);

    var textSwitch = $('<label/>');
    var labelSwitch = $('<label/>');
    var filterSelector = $('<input/>');
    var filterSpan = $('<span/>');

    var textSwitch = $('<label/>');
    textSwitch.text("Blank Entries");
    labelSwitch.addClass('switch');
    filterSelector.attr('type', 'checkbox');
    filterSelector.addClass('sliderInput');
    filterSpan.addClass('slider round');

    labelSwitch.append(filterSelector);
    labelSwitch.append(filterSpan);
    $("#myDropdown .rightDiv").append(textSwitch);
    $("#myDropdown .rightDiv").append(labelSwitch);

    var addButton = $('<button/>');
    addButton.addClass("addButton");
    addButton.attr("onclick","addNewRow()");
    addButton.text("Add new row!");
    $("#addDropdown .rightDiv").append(addButton);

    var filterButton = $('<button/>');
    filterButton.addClass("filterButton");
    filterButton.attr("onclick","refreshTable()");
    filterButton.text("Update Table");
    $("#myDropdown .rightDiv").append(filterButton);


    tableHead.append(newRow);
    $("#table").append(tableHead);

    var tableHead;

    tableBody = $('<tbody id="tableBody"/>');
    $("#table").append(tableBody);

    if(hideEmptyValues){
        $('.sliderInput').click();
    }
    result.forEach(function(line){

        addLineToTable(line);
    });
    $('#tableContainer').css('max-height', (window.innerHeight - 250));
    //return result; //JavaScript object
    return JSON.stringify(result); //JSON
  }


  /* Build Table */
  function addLineToTable(line){
    var newCell;
    var newRow;
    var filterPass = true;
    var currentFilter;


    newRow = $('<tr/>');

    for (var i = 0; i < columnValues.length; i++) {
        var attr = "";
        var max,min,temp;
        attr = columnValues[i];
        //console.log(attr);
        if(filtersApplied){
            if(filters != "" && filters[attr] != ""){
                currentFilter = filters[attr];
                if(currentFilter.indexOf(',') > -1){
                    max = Number(currentFilter.substring(currentFilter.indexOf(',') + 1,currentFilter.length));
                    min = Number(currentFilter.substring(0, currentFilter.indexOf(',')));

                    if(min > max){
                        temp = max;
                        max = min;
                        min = temp;
                    }

                    if(Number(line[attr]) > max || Number(line[attr]) < min){
                        filterPass = false;
                    }
                }else{
                    if(line[attr].toLowerCase().indexOf(currentFilter.toLowerCase()) == -1){
                        filterPass = false;
                    }
                }
            }
            if(hideEmptyValues){
                console.log("hello");
                if(line[attr].toLowerCase().indexOf('nan') > -1 || line[attr].toLowerCase().indexOf('--') > -1){
                    filterPass = false;
                }
            }
        }
        newCell = $('<td/>');
        newCell.addClass("tableCell");
        if(columnValues[i] == "Reference" || columnValues[i] == "Notes"){
            var newDiv = $('<div/>');
            newDiv.text(line[attr]);
            newDiv.addClass("largeText");
            newCell.append(newDiv);
        }else{
            newCell.text(line[attr]);
        }
        newRow.append(newCell);
    }

    if(filterPass){
        $("#tableBody").append(newRow);
    }
  
    //console.log(line);
    return
  }


  // Trigger action when the contexmenu is about to be shown
$(document).bind("contextmenu", function (event) {
    
    // Show contextmenu
    if($(event.target).closest('td').hasClass('tableCell')){
      // Avoid the real one
      event.preventDefault();
      selectedTR = $(event.target).parent();
      selectedTD = $(event.target).closest('td');
      contextItem = $(event.target).closest('div');
      
      var menu = $("#DBMenu");
      menu.finish().toggle(100).
      // In the right position (the mouse)
      css({
          top: event.pageY + "px",
          left: event.pageX + "px"
      });

    if (event.pageY + 300 >= $(document).height()){
        menu.css('top', $(document).height() - 300 + "px");
    }

    if (event.pageX + 360 >= $(document).width()){
        menu.css('left', $(document).width() - 380 + "px");
    }
    }
});

// If the document is clicked somewhere
$(document).click(function (e) {
  
  // If the clicked element is not the menu
  if (!$(e.target).parents(".DBMenu").length > 0) {
    hideContextMenu();
  }
});

function hideContextMenu(){
  $(".DBMenu").hide(100);
  contextItem = null;
}

function editRemove(){
    var selectedLine="";
    var selectedValue= selectedTD;
    var childrens = selectedTR.children();
    var index;
    var newline = "";
    
    console.log(childrens);
    for(var i=0;i<childrens.length;i++){
        if(i == 0){
            selectedLine = childrens[i].innerText.replace(/,/g, '').trim();
        }else{
            selectedLine += "," + childrens[i].innerText.replace(/,/g, '').trim();
        }
        
    }
    selectedLine = selectedLine.replace(/,/g, '').replace(/ /g,'').trim();

    for(var i=0;i<currentTableData.length;i++){
        if(currentTableData[i].replace(/,/g, '').replace(/ /g,'').replace(/(\r\n\t|\n|\r\t)/gm,"").trim() === selectedLine){
            index = i;
            console.log("Index of line:" + i);
        }

    }
    if(removed){
        currentTableData.splice(index, 1);
        removed = false;
    }else{
        var cellIndex = selectedValue[0].cellIndex;
        var cellToChange = childrens[cellIndex];
        cellToChange.innerText = updatedEntry ;

        for(var i=0;i<childrens.length;i++){
            if(i == 0){
                newLine = childrens[i].innerText;
            }else{
                newLine += "," + childrens[i].innerText;
            }
        }
 
        currentTableData.splice(index, 1);
        currentTableData.splice( index, 0, newLine);

    }
    
    var table = $('#table');

    table.remove();
    table = $("<table/>");
    table.attr('id', 'table');

    $("#tableContainer").append(table);

    var filtersContainer = $('#myDropdown');
    filtersContainer.empty();
    
    var addNewRow = $('#addDropdown');
    addNewRow.empty();

    var plot = $('.leftDiv');
    plot.empty();

    csvJSON(currentTableData);

}


// Plot page


function bindPlotPage(){

    xLabel=localStorage.getItem("xLabel");
    yLabel=localStorage.getItem("yLabel");
    charType = localStorage.getItem("selectedChart");

    xAxe = JSON.parse(localStorage.getItem("xAxe"));
    yAxe = JSON.parse(localStorage.getItem("yAxe"));

    for (var i=0; i < yAxe.length ;i++){
        yArray.push(parseFloat(yAxe[i]));
        xArray.push(xAxe[i] + "(" + i + ")");
    }

    console.log(xArray);
    console.log(yArray);
    console.log(xLabel);
    console.log(yLabel);
    plotGraph(xArray,yArray,xLabel,yLabel,charType);
}

function flipAxes(){
    if(orientation == 'h'){
        orientation = 'v';
        plotGraph(xArray,yArray,xLabel,yLabel,charType);
    }else{
        orientation = 'h';
        plotGraph(yArray,xArray,yLabel,xLabel,charType);
    }
}

function replotValues(){
    charType = $(".charType").val();
    plotGraph(xArray,yArray,xLabel,yLabel,charType);
}

function plotGraph(xAxe,yAxe,xLabel,yLabel,charType){

    if(charType.indexOf("markers")>-1){
        var trace1 = {
            x: xAxe, 
            y: yAxe, 
            name: 'SF Zoo', 
            type: 'scatter',
            mode:'lines+markers',
            orientation:orientation
        };

    }else{
        var trace1 = {
            x: xAxe, 
            y: yAxe, 
            name: 'SF Zoo', 
            type: charType,
            orientation:orientation
        };
    }

    
    var data = [trace1];
    var layout = {
            height: 900,
            margin: {
                l: 120,
                r: 50,
                b: 400,
                t: 30,
                pad: 0
              },
            xaxis: { 
                title: xLabel,
                titlefont: {
                size: 16,
                color: 'rgb(9, 46, 130)'
              }},
            yaxis: {
                title: yLabel,
                titlefont: {
                    size: 16,
                    color: 'rgb(9, 46, 130)'
                }
            },
        }
    
    Plotly.newPlot('myDiv', data , layout);
}