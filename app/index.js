import clock from "clock";
import document from "document";
import * as messaging from "messaging";
import * as util from "../common/utils";

const label = document.getElementById("label");

let longitude = null;

// Listen for longitude from companion GPS
messaging.peerSocket.onmessage = function(evt) {
  longitude = evt.data;
}

clock.granularity = "seconds";

clock.ontick = function(evt) {
  if (longitude) {
    let today = evt.date;

    // Equation of time
    // https://www.esrl.noaa.gov/gmd/grad/solcalc/solareqns.PDF
    let days = Math.ceil((today - Date.UTC(today.getUTCFullYear(), 0)) / 86400000);
    let hours = today.getUTCHours();
    let y = (2 * Math.PI / 365) * (days - 1 + (hours - 12) / 24);
    let eot = 60 * 229.18 * (
      0.000075 +
      0.001868 * Math.cos(1 * y) -
      0.032077 * Math.sin(1 * y) -
      0.014615 * Math.cos(2 * y) -
      0.040849 * Math.sin(2 * y)
    );

    // Seconds since local midnight
    let utc = today.getUTCHours() * 3600 + today.getUTCMinutes() * 60 + today.getUTCSeconds();
    let tz = (86400 / 2) * (longitude / 180);
    let seconds = utc + tz + eot;

    // Convert to geodate
    let centidays = Math.floor(100 * seconds / 86400);
    let dimidays = Math.floor(100 * ((100 * seconds / 86400) - centidays));

    label.text = util.monoDigits(util.zeroPad(centidays)) + " " + util.monoDigits(util.zeroPad(dimidays));
  } else {
    label.text = "-- --";
  }
};
