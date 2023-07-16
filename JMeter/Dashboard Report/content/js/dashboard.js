/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.07027472527472528, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.005714285714285714, 500, 1500, "PUT Update profiles"], "isController": false}, {"data": [0.08357142857142857, 500, 1500, "GET List product"], "isController": false}, {"data": [0.09857142857142857, 500, 1500, "DEL Delete product"], "isController": false}, {"data": [0.007142857142857143, 500, 1500, "POST Registration"], "isController": false}, {"data": [0.04071428571428572, 500, 1500, "GET Categories"], "isController": false}, {"data": [0.07214285714285715, 500, 1500, "GET List Offers"], "isController": false}, {"data": [0.0035714285714285713, 500, 1500, "POST Login"], "isController": false}, {"data": [0.10857142857142857, 500, 1500, "PUT Update offer"], "isController": false}, {"data": [0.016428571428571428, 500, 1500, "POST Create product"], "isController": false}, {"data": [0.17785714285714285, 500, 1500, "GET Category by id"], "isController": false}, {"data": [0.15785714285714286, 500, 1500, "GET Profiles"], "isController": false}, {"data": [0.12642857142857142, 500, 1500, "GET Product by id"], "isController": false}, {"data": [0.015, 500, 1500, "POST Create offer"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 9100, 0, 0.0, 4026.236483516479, 43, 11102, 2950.5, 8029.800000000001, 9009.949999999999, 10129.99, 15.855978923744939, 24.185865655318022, 25.4884691041459], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["PUT Update profiles", 700, 0, 0.0, 6343.62714285715, 1258, 10730, 6677.0, 9641.2, 10105.699999999999, 10642.93, 1.2891344383057088, 1.776518257941989, 11.59033832585175], "isController": false}, {"data": ["GET List product", 700, 0, 0.0, 2782.0142857142855, 1001, 9496, 2311.5, 5196.299999999999, 6477.649999999998, 8021.1, 1.2932738673692223, 2.254520237542078, 0.5759110190628569], "isController": false}, {"data": ["DEL Delete product", 700, 0, 0.0, 2759.300000000002, 43, 10188, 2102.5, 6019.699999999999, 7082.95, 9216.880000000001, 1.3482124628760068, 1.157645791121443, 0.5911595662415303], "isController": false}, {"data": ["POST Registration", 700, 0, 0.0, 5513.347142857144, 698, 11102, 5423.0, 8794.5, 9522.55, 10482.95, 1.2788191019036137, 2.1801457197239578, 0.37453450128338633], "isController": false}, {"data": ["GET Categories", 700, 0, 0.0, 4808.202857142859, 375, 10255, 4683.5, 8256.1, 8921.349999999999, 9769.0, 1.2801029934294141, 1.337607620087376, 0.22001770199568055], "isController": false}, {"data": ["GET List Offers", 700, 0, 0.0, 2784.492857142858, 265, 9539, 2082.0, 6294.5, 6913.799999999999, 7934.530000000002, 1.3249520651270725, 1.4599685252904957, 0.557670253974383], "isController": false}, {"data": ["POST Login", 700, 0, 0.0, 7428.189999999998, 922, 11042, 7789.5, 9924.3, 10178.9, 10701.59, 1.2748597654258031, 2.172839112697603, 0.3559451861522911], "isController": false}, {"data": ["PUT Update offer", 700, 0, 0.0, 2441.741428571431, 65, 9742, 1828.0, 5693.9, 6776.65, 8729.92, 1.3425264429761894, 3.4194680418772356, 0.6476641238576539], "isController": false}, {"data": ["POST Create product", 700, 0, 0.0, 5433.40571428571, 1030, 10179, 5614.5, 8682.4, 9217.3, 9734.380000000001, 1.2876286478979464, 2.214856001154267, 10.1095734615137], "isController": false}, {"data": ["GET Category by id", 700, 0, 0.0, 2468.5942857142823, 368, 9639, 2000.5, 5158.099999999999, 6766.499999999999, 9008.550000000001, 1.289694968715685, 0.9220455391293453, 0.22418525823378116], "isController": false}, {"data": ["GET Profiles", 700, 0, 0.0, 2690.8142857142884, 380, 10083, 2058.0, 5997.3, 7442.399999999998, 8961.98, 1.2909008090259784, 1.4238754784401124, 0.5307316802733759], "isController": false}, {"data": ["GET Product by id", 700, 0, 0.0, 2471.5471428571427, 1012, 7524, 2013.5, 4706.699999999999, 5705.499999999999, 7058.67, 1.3095126742119538, 2.1678225990318962, 0.5460565545786176], "isController": false}, {"data": ["POST Create offer", 700, 0, 0.0, 4415.797142857138, 630, 7527, 4674.5, 6735.099999999999, 7009.849999999999, 7290.89, 1.3160541687895875, 3.359858018318534, 0.687463881950881], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 9100, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
