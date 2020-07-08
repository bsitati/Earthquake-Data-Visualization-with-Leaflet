var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// API_KEY = 'pk.eyJ1IjoidHJhdmlzZG9lc21hdGgiLCJhIjoiY2poOWNrYjRkMDQ2ejM3cGV1d2xqa2IyeCJ9.34tYWBvPBM_h8_YS3Z7__Q';

d3.json(url, function(data) {
    createFeatures(data.features);
});

function createFeatures(data) {
    var myMap = L.map("map", {
        center: [37.77, -122.41],
        zoom: 5
    });
      
    // L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    //     attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        
     L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken: API_KEY
      }).addTo(myMap);

    //   make markers
    data.forEach(feature => {
        var mag = feature.properties.mag;

        var color = "";
        if (mag <= 1) {
            color = "green";
        }
        else if (mag <= 2) {
            color = "yellow";
        }
        else if (mag <= 3) {
            color = "#E59866";
        }
        else if (mag <= 4) {
            color = "orange";
        }
        else if (mag <= 5) {
            color = "#D35400";
        }
        else {
            color = "red";
        }

        L.circle([feature.geometry.coordinates[1],
                 feature.geometry.coordinates[0]], {
                    fillColor: color,
                    fillOpacity: 0.75,
                    color: color,
                    radius: mag * 10000
                 }).bindPopup("<h3> Location: " + feature.properties.place + "<hr>Mag: " + mag + "</h3>").addTo(myMap);
    });
    
    // make legend
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function() {
        var div = L.DomUtil.create('div', 'info legend');
        var labels = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];
        var colors = ["green", "yellow", "#E59866",
                        "orange", "#D35400", "red"];
    
        // loop through our density intervals and generate a label with a colored background for each interval
        for (var i = 0; i < colors.length; i++) {
            div.innerHTML +=
                '<li style="background-color:' + colors[i] + '">' + labels[i] + '</li>';
            }
        return div;
    }
    legend.addTo(myMap);
}