import { geolocation } from "geolocation";
import { me } from "companion"
import * as messaging from "messaging";

//me.monitorSignificantLocationChanges = true

// Listen for the onopen event
messaging.peerSocket.onopen = function() {
  geolocation.getCurrentPosition(function(position) {
    let longitude = position.coords.longitude;
    
    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
      messaging.peerSocket.send(longitude);
    }
  }, function(err) {
    console.log(err);  
  });
}

// Listen for the onerror event
messaging.peerSocket.onerror = function(err) {
  console.log(err);
}
