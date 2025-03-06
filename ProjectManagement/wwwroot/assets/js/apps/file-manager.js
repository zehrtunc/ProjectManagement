"use strict";

!function (ZehraApp, $) {
  "use strict";

  var $win = $(window),
      $body = $('body'),
      breaks = ZehraApp.Break; // Variable

  var $file_dload = $('.file-dl-toast');

  ZehraApp.FileManager = function () {
    $file_dload.on("click", function (e) {
      e.preventDefault();
      ZehraApp.Toast('<h5>Downloading File</h5><p>Generating the file to start download.</p>', 'success', {
        position: 'bottom-center',
        icon: 'ni ni-download-cloud',
        ui: 'is-dark'
      });
    });
  };

  ZehraApp.coms.docReady.push(ZehraApp.FileManager);
}(ZehraApp, jQuery);