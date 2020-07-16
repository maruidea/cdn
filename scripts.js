var map = null;
var clusters = [];
var infoWindow = null;

function initMap() {

  // instantiate map
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 5,
    center: { lat: -3.1750037, lng: 111.3151227 }
  });

  // on load
  var listener = google.maps.event.addListener(map, 'tilesloaded', function () {
    clusters.push(generateCluster(map, 'GD', 'https://raw.githubusercontent.com/maruidea/cdn/master/marker-icon/1s.png', 'https://raw.githubusercontent.com/maruidea/cdn/master/marker-icon/1.png'));
    clusters.push(generateCluster(map, 'KO', 'https://raw.githubusercontent.com/maruidea/cdn/master/marker-icon/2s.png', 'https://raw.githubusercontent.com/maruidea/cdn/master/marker-icon/2.png'));
    clusters.push(generateCluster(map, 'KI', 'https://raw.githubusercontent.com/maruidea/cdn/master/marker-icon/3s.png', 'https://raw.githubusercontent.com/maruidea/cdn/master/marker-icon/3.png'));

    // Create the DIV to hold the control and call the CenterControl()
    // constructor passing in this DIV.
    var clusteringControlDiv = document.createElement('div');
    var clusteringControl = new ClusteringControl(clusteringControlDiv, map, clusters);

    clusteringControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(clusteringControlDiv);

    initInfoWindow();

    google.maps.event.removeListener(listener);
  });

}

function initInfoWindow() {
  var contentString = '<div class="card" style="width: 18rem;">' +
    '<img src="https://source.unsplash.com/200x75/?warehouse" class="card-img-top" alt="...">' +
    '<div class="card-body">' +
    '<h6 class="card-title">Gudang</h6>' +
    '<p class="card-text">Jl. Brawijaya 46, Surabaya, Jawa Timur</p>' +
    '<ul class="list-group list-group-flush">' +
    '<li class="list-group-item d-flex justify-content-between align-items-center">' +
    'Ammo' +
    '<span class="badge badge-primary badge-pill">15000</span>' +
    '</li>' +
    '<li class="list-group-item d-flex justify-content-between align-items-center">' +
    'Tank' +
    '<span class="badge badge-warning badge-pill">10</span>' +
    '</li>' +
    '<li class="list-group-item d-flex justify-content-between align-items-center">' +
    'Anoa' +
    '<span class="badge badge-danger badge-pill">0</span>' +
    '</li>' +
    '</ul>' +
    '<div class="card-body">' +
    '<a href="#" class="card-link">Detail</a>' +
    '</div>' +
    '</div>' +
    '</div>';


  infoWindow = new google.maps.InfoWindow({
    content: contentString,
    //disableAutoPan: true
  });

  clusters[0].getMarkers().forEach(marker => {
    marker.addListener("click", function () {
      infoWindow.open(map, marker);
    });
  });
}

function getRandomLocation(bounds) {
  var lat_min = bounds.getSouthWest().lat();
  var lat_range = bounds.getNorthEast().lat() - lat_min;
  var lng_min = bounds.getSouthWest().lng();
  var lng_range = bounds.getNorthEast().lng() - lng_min;

  return new google.maps.LatLng(lat_min + (Math.random() * lat_range),
    lng_min + (Math.random() * lng_range));
}

function generateMarkers(map, label, icon) {
  var markerImage = new google.maps.MarkerImage(
    icon,
    new google.maps.Size(24, 24)
  );

  var markers = [];
  for (var i = 0; i < 30; i++) {
    var marker = new google.maps.Marker({
      position: getRandomLocation(map.getBounds()),
      icon: markerImage
    });
    markers.push(marker);
  };

  return markers
}

function generateCluster(map, label, icon, clusterIcon) {
  var styles = [
    MarkerClusterer.withDefaultStyle({
      url: clusterIcon,
      width: 32,
      height: 32,
      anchorIcon: [16, 16],
      textColor: '#ff00ff',
      textSize: 11,
      className: 'custom-clustericon-1'
    }),
    MarkerClusterer.withDefaultStyle({
      url: clusterIcon,
      width: 32,
      height: 32,
      anchorIcon: [16, 16],
      textColor: '#ff0000',
      textSize: 12,
      className: 'custom-clustericon-2'
    }),
    MarkerClusterer.withDefaultStyle({
      url: clusterIcon,
      width: 32,
      height: 32,
      anchorIcon: [16, 16],
      textSize: 13,
      className: 'custom-clustericon-3'
    }),
  ];

  // Add a marker clusterer to manage the markers.
  return new MarkerClusterer(map, generateMarkers(map, label, icon),
    {
      styles: styles,
      clusterClass: 'custom-clustericon',
      averageCenter: true,
      ignoreHidden: true
    });

}

function ClusteringControl(controlDiv, map, clusters) {
  var control = this;
  control.map = map;
  control.clusters = clusters;

  // Set CSS for the control border.
  var controlUI = document.createElement('div');
  controlUI.style.backgroundColor = '#fff';
  controlUI.style.border = '2px solid #fff';
  controlUI.style.borderRadius = '3px';
  controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
  controlUI.style.cursor = 'pointer';
  controlUI.style.marginBottom = '22px';
  controlUI.style.marginRight = '10px';
  controlUI.style.textAlign = 'center';
  controlUI.style.width = "38px";
  controlUI.style.height = "38px";
  controlUI.style.position = "relative";
  controlUI.title = 'Toggle Clustering';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior.
  control.controlIcon = document.createElement('img');
  control.controlIcon.src = "https://raw.githubusercontent.com/maruidea/cdn/master/marker-icon/object-ungroup-regular.png";
  control.controlIcon.style.position = "absolute";
  control.controlIcon.style.display = "block";
  control.controlIcon.style.top = "50%";
  control.controlIcon.style.left = "50%";
  control.controlIcon.style.marginTop = "-16px";
  control.controlIcon.style.marginLeft = "-16px";
  controlUI.appendChild(control.controlIcon);

  // Setup the click event listeners: simply set the map to Chicago.
  controlUI.addEventListener('click', function () {
    control.setClusteringEnabled(!control.isClusteringEnabled());
  });

}

ClusteringControl.prototype.clusteringEnabled = true;
ClusteringControl.prototype.map = null;
ClusteringControl.prototype.clusters = null;
ClusteringControl.prototype.controlIcon = null;
ClusteringControl.prototype.isClusteringEnabled = function () {
  return this.clusteringEnabled;
};

ClusteringControl.prototype.setClusteringEnabled = function (clusteringEnabled) {
  this.clusteringEnabled = clusteringEnabled;

  var maxZoom = this.clusteringEnabled ? null : 1;
  var gridSize = this.clusteringEnabled ? 60 : 1;
  this.clusters.forEach(cluster => {
    cluster.setMaxZoom(maxZoom);
    cluster.setGridSize(gridSize);
    cluster.repaint();
  });

  var icon = this.clusteringEnabled ? "https://raw.githubusercontent.com/maruidea/cdn/master/marker-icon/object-ungroup-regular.png" : "https://raw.githubusercontent.com/maruidea/cdn/master/marker-icon/object-group-regular.png";
  this.controlIcon.src = icon;
};

$(document).ready(function () {
  $("#marker1").on("click", function (event) {
    var visible = !$("#marker1").hasClass('active');
    clusters[0].getMarkers().forEach(marker => {
      marker.setVisible(visible);
    });
    clusters[0].repaint();
  });

  $("#marker2").on("click", function (event) {
    var visible = !$("#marker2").hasClass('active');
    clusters[1].getMarkers().forEach(marker => {
      marker.setVisible(visible);
    });
    clusters[1].repaint();
  });

  $("#marker3").on("click", function (event) {
    var visible = !$("#marker3").hasClass('active');
    clusters[2].getMarkers().forEach(marker => {
      marker.setVisible(visible);
    });
    clusters[2].repaint();
  });

  $("#poi-list a").on("click", function (event) {
    var targetMarker = clusters[0].getMarkers()[Math.round(Math.random() * 30)];
    map.panTo(targetMarker.getPosition());
    google.maps.event.addListenerOnce(map, "idle", function () {
      map.setZoom(8);
      google.maps.event.addListenerOnce(map, "idle", function () {
        infoWindow.open(map, targetMarker);
      });
    });
  });
});
