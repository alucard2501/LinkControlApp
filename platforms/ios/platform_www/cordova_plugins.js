cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "cordova-plugin-chrome-apps-common.events",
      "file": "plugins/cordova-plugin-chrome-apps-common/events.js",
      "pluginId": "cordova-plugin-chrome-apps-common",
      "clobbers": [
        "chrome.Event"
      ]
    },
    {
      "id": "cordova-plugin-chrome-apps-common.errors",
      "file": "plugins/cordova-plugin-chrome-apps-common/errors.js",
      "pluginId": "cordova-plugin-chrome-apps-common"
    },
    {
      "id": "cordova-plugin-chrome-apps-common.stubs",
      "file": "plugins/cordova-plugin-chrome-apps-common/stubs.js",
      "pluginId": "cordova-plugin-chrome-apps-common"
    },
    {
      "id": "cordova-plugin-chrome-apps-common.helpers",
      "file": "plugins/cordova-plugin-chrome-apps-common/helpers.js",
      "pluginId": "cordova-plugin-chrome-apps-common"
    },
    {
      "id": "cordova-plugin-chrome-apps-sockets-udp.sockets.udp",
      "file": "plugins/cordova-plugin-chrome-apps-sockets-udp/sockets.udp.js",
      "pluginId": "cordova-plugin-chrome-apps-sockets-udp",
      "clobbers": [
        "chrome.sockets.udp"
      ]
    },
    {
      "id": "cordova-plugin-networkinterface.networkinterface",
      "file": "plugins/cordova-plugin-networkinterface/www/networkinterface.js",
      "pluginId": "cordova-plugin-networkinterface",
      "clobbers": [
        "window.networkinterface"
      ]
    },
    {
      "id": "phonegap-plugin-barcodescanner.BarcodeScanner",
      "file": "plugins/phonegap-plugin-barcodescanner/www/barcodescanner.js",
      "pluginId": "phonegap-plugin-barcodescanner",
      "clobbers": [
        "cordova.plugins.barcodeScanner"
      ]
    },
    {
      "id": "cordova-plugin-wkwebview-engine.ios-wkwebview-exec",
      "file": "plugins/cordova-plugin-wkwebview-engine/src/www/ios/ios-wkwebview-exec.js",
      "pluginId": "cordova-plugin-wkwebview-engine",
      "clobbers": [
        "cordova.exec"
      ]
    },
    {
      "id": "cordova-plugin-wkwebview-engine.ios-wkwebview",
      "file": "plugins/cordova-plugin-wkwebview-engine/src/www/ios/ios-wkwebview.js",
      "pluginId": "cordova-plugin-wkwebview-engine",
      "clobbers": [
        "window.WkWebView"
      ]
    }
  ];
  module.exports.metadata = {
    "cordova-plugin-chrome-apps-common": "1.0.7",
    "cordova-plugin-chrome-apps-iossocketscommon": "1.0.2",
    "cordova-plugin-chrome-apps-sockets-udp": "1.3.0",
    "cordova-plugin-networkinterface": "2.0.0",
    "cordova-plugin-splashscreen": "6.0.0",
    "cordova-plugin-whitelist": "1.3.4",
    "phonegap-plugin-barcodescanner": "8.1.0",
    "cordova-plugin-wkwebview-engine": "1.2.1"
  };
});