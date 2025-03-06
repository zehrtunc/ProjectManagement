"use strict";

!function (ZehraApp, $) {
  "use strict";

  ZehraApp.Package.name = "DashLite";
  ZehraApp.Package.version = "2.3";
  var $win = $(window),
      $body = $('body'),
      $doc = $(document),
      //class names
  _body_theme = 'nio-theme',
      _menu = 'nk-menu',
      _mobile_nav = 'mobile-menu',
      _header = 'nk-header',
      _header_menu = 'nk-header-menu',
      _sidebar = 'nk-sidebar',
      _sidebar_mob = 'nk-sidebar-mobile',
      //breakpoints
  _break = ZehraApp.Break;

  function extend(obj, ext) {
    Object.keys(ext).forEach(function (key) {
      obj[key] = ext[key];
    });
    return obj;
  } // ClassInit @v1.0


  ZehraApp.ClassBody = function () {
    ZehraApp.AddInBody(_sidebar);
  }; // ClassInit @v1.0


  ZehraApp.ClassNavMenu = function () {
    ZehraApp.BreakClass('.' + _header_menu, _break.lg, {
      timeOut: 0
    });
    ZehraApp.BreakClass('.' + _sidebar, _break.lg, {
      timeOut: 0,
      classAdd: _sidebar_mob
    });
    $win.on('resize', function () {
      ZehraApp.BreakClass('.' + _header_menu, _break.lg);
      ZehraApp.BreakClass('.' + _sidebar, _break.lg, {
        classAdd: _sidebar_mob
      });
    });
  }; // Code Prettify @v1.0


  ZehraApp.Prettify = function () {
    window.prettyPrint && prettyPrint();
  }; // Copied @v1.0


  ZehraApp.Copied = function () {
    var clip = '.clipboard-init',
        target = '.clipboard-text',
        sclass = 'clipboard-success',
        eclass = 'clipboard-error'; // Feedback

    function feedback(el, state) {
      var $elm = $(el),
          $elp = $elm.parent(),
          copy = {
        text: 'Copy',
        done: 'Copied',
        fail: 'Failed'
      },
          data = {
        text: $elm.data('clip-text'),
        done: $elm.data('clip-success'),
        fail: $elm.data('clip-error')
      };
      copy.text = data.text ? data.text : copy.text;
      copy.done = data.done ? data.done : copy.done;
      copy.fail = data.fail ? data.fail : copy.fail;
      var copytext = state === 'success' ? copy.done : copy.fail,
          addclass = state === 'success' ? sclass : eclass;
      $elp.addClass(addclass).find(target).html(copytext);
      setTimeout(function () {
        $elp.removeClass(sclass + ' ' + eclass).find(target).html(copy.text).blur();
        $elp.find('input').blur();
      }, 2000);
    } // Init ClipboardJS


    if (ClipboardJS.isSupported()) {
      var clipboard = new ClipboardJS(clip);
      clipboard.on('success', function (e) {
        feedback(e.trigger, 'success');
        e.clearSelection();
      }).on('error', function (e) {
        feedback(e.trigger, 'error');
      });
    } else {
      $(clip).css('display', 'none');
    }

    ;
  }; // CurrentLink Detect @v1.0


  ZehraApp.CurrentLink = function () {
    var _link = '.nk-menu-link, .menu-link, .nav-link',
        _currentURL = window.location.href,
        fileName = _currentURL.substring(0, _currentURL.indexOf("#") == -1 ? _currentURL.length : _currentURL.indexOf("#")),
        fileName = fileName.substring(0, fileName.indexOf("?") == -1 ? fileName.length : fileName.indexOf("?"));

    $(_link).each(function () {
      var self = $(this),
          _self_link = self.attr('href');

      if (fileName.match(_self_link)) {
        self.closest("li").addClass('active current-page').parents().closest("li").addClass("active current-page");
        self.closest("li").children('.nk-menu-sub').css('display', 'block');
        self.parents().closest("li").children('.nk-menu-sub').css('display', 'block');
      } else {
        self.closest("li").removeClass('active current-page').parents().closest("li:not(.current-page)").removeClass("active");
      }
    });
  }; // PasswordSwitch @v1.0


  ZehraApp.PassSwitch = function () {
    ZehraApp.Passcode('.passcode-switch');
  }; // Toastr Message @v1.0 


  ZehraApp.Toast = function (msg, ttype, opt) {
    var ttype = ttype ? ttype : 'info',
        msi = '',
        ticon = ttype === 'info' ? 'ni ni-info-fill' : ttype === 'success' ? 'ni ni-check-circle-fill' : ttype === 'error' ? 'ni ni-cross-circle-fill' : ttype === 'warning' ? 'ni ni-alert-fill' : '',
        def = {
      position: 'bottom-right',
      ui: '',
      icon: 'auto',
      clear: false
    },
        attr = opt ? extend(def, opt) : def;
    attr.position = attr.position ? 'toast-' + attr.position : 'toast-bottom-right';
    attr.icon = attr.icon === 'auto' ? ticon : attr.icon ? attr.icon : '';
    attr.ui = attr.ui ? ' ' + attr.ui : '';
    msi = attr.icon !== '' ? '<span class="toastr-icon"><em class="icon ' + attr.icon + '"></em></span>' : '', msg = msg !== '' ? msi + '<div class="toastr-text">' + msg + '</div>' : '';

    if (msg !== "") {
      if (attr.clear === true) {
        toastr.clear();
      }

      var option = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": attr.position + attr.ui,
        "closeHtml": '<span class="btn-trigger">Close</span>',
        "preventDuplicates": true,
        "showDuration": "1500",
        "hideDuration": "1500",
        "timeOut": "2000",
        "toastClass": "toastr",
        "extendedTimeOut": "3000"
      };
      toastr.options = extend(option, attr);
      toastr[ttype](msg);
    }
  }; // Toggle Screen @v1.0


  ZehraApp.TGL.screen = function (elm) {
    if ($(elm).exists()) {
      $(elm).each(function () {
        var ssize = $(this).data('toggle-screen');

        if (ssize) {
          $(this).addClass('toggle-screen-' + ssize);
        }
      });
    }
  }; // Toggle Content @v1.0


  ZehraApp.TGL.content = function (elm, opt) {
    var toggle = elm ? elm : '.toggle',
        $toggle = $(toggle),
        $contentD = $('[data-content]'),
        toggleBreak = true,
        toggleCurrent = false,
        def = {
      active: 'active',
      content: 'content-active',
      "break": toggleBreak
    },
        attr = opt ? extend(def, opt) : def;
    ZehraApp.TGL.screen($contentD);
    $toggle.on('click', function (e) {
      toggleCurrent = this;
      ZehraApp.Toggle.trigger($(this).data('target'), attr);
      e.preventDefault();
    });
    $doc.on('mouseup', function (e) {
      if (toggleCurrent) {
        var $toggleCurrent = $(toggleCurrent),
            $s2c = $('.select2-container'),
            $dpd = $('.datepicker-dropdown'),
            $tpc = $('.ui-timepicker-container');

        if (!$toggleCurrent.is(e.target) && $toggleCurrent.has(e.target).length === 0 && !$contentD.is(e.target) && $contentD.has(e.target).length === 0 && !$s2c.is(e.target) && $s2c.has(e.target).length === 0 && !$dpd.is(e.target) && $dpd.has(e.target).length === 0 && !$tpc.is(e.target) && $tpc.has(e.target).length === 0) {
          ZehraApp.Toggle.removed($toggleCurrent.data('target'), attr);
          toggleCurrent = false;
        }
      }
    });
    $win.on('resize', function () {
      $contentD.each(function () {
        var content = $(this).data('content'),
            ssize = $(this).data('toggle-screen'),
            toggleBreak = _break[ssize];

        if (ZehraApp.Win.width > toggleBreak) {
          ZehraApp.Toggle.removed(content, attr);
        }
      });
    });
  }; // ToggleExpand @v1.0


  ZehraApp.TGL.expand = function (elm, opt) {
    var toggle = elm ? elm : '.expand',
        def = {
      toggle: true
    },
        attr = opt ? extend(def, opt) : def;
    $(toggle).on('click', function (e) {
      ZehraApp.Toggle.trigger($(this).data('target'), attr);
      e.preventDefault();
    });
  }; // Dropdown Menu @v1.0


  ZehraApp.TGL.ddmenu = function (elm, opt) {
    var imenu = elm ? elm : '.nk-menu-toggle',
        def = {
      active: 'active',
      self: 'nk-menu-toggle',
      child: 'nk-menu-sub'
    },
        attr = opt ? extend(def, opt) : def;
    $(imenu).on('click', function (e) {
      if (ZehraApp.Win.width < _break.lg || $(this).parents().hasClass(_sidebar)) {
        ZehraApp.Toggle.dropMenu($(this), attr);
      }

      e.preventDefault();
    });
  }; // Show Menu @v1.0


  ZehraApp.TGL.showmenu = function (elm, opt) {
    var toggle = elm ? elm : '.nk-nav-toggle',
        $toggle = $(toggle),
        $contentD = $('[data-content]'),
        toggleBreak = $contentD.hasClass(_header_menu) ? _break.lg : _break.xl,
        toggleOlay = _sidebar + '-overlay',
        toggleClose = {
      profile: true,
      menu: false
    },
        def = {
      active: 'toggle-active',
      content: _sidebar + '-active',
      body: 'nav-shown',
      overlay: toggleOlay,
      "break": toggleBreak,
      close: toggleClose
    },
        attr = opt ? extend(def, opt) : def;
    $toggle.on('click', function (e) {
      ZehraApp.Toggle.trigger($(this).data('target'), attr);
      e.preventDefault();
    });
    $doc.on('mouseup', function (e) {
      if (!$toggle.is(e.target) && $toggle.has(e.target).length === 0 && !$contentD.is(e.target) && $contentD.has(e.target).length === 0 && ZehraApp.Win.width < toggleBreak) {
        ZehraApp.Toggle.removed($toggle.data('target'), attr);
      }
    });
    $win.on('resize', function () {
      if (ZehraApp.Win.width < _break.xl || ZehraApp.Win.width < toggleBreak) {
        ZehraApp.Toggle.removed($toggle.data('target'), attr);
      }
    });
  }; // Compact Sidebar @v1.0


  ZehraApp.sbCompact = function () {
    var toggle = '.nk-nav-compact',
        $toggle = $(toggle),
        $content = $('[data-content]'),
        $sidebar = $('.' + _sidebar),
        $sidebar_body = $('.' + _sidebar + '-body');
    $toggle.on('click', function (e) {
      e.preventDefault();
      var $self = $(this),
          get_target = $self.data('target'),
          $self_content = $('[data-content=' + get_target + ']');
      $self.toggleClass('compact-active');
      $self_content.toggleClass('is-compact');

      if (!$self_content.hasClass('is-compact')) {
        $self_content.removeClass('has-hover');
      }
    });
    $sidebar_body.on('mouseenter', function (e) {
      if ($sidebar.hasClass('is-compact')) {
        $sidebar.addClass('has-hover');
      }
    });
    $sidebar_body.on('mouseleave', function (e) {
      if ($sidebar.hasClass('is-compact')) {
        $sidebar.removeClass('has-hover');
      }
    });
  }; // Animate FormSearch @v1.0


  ZehraApp.Ani.formSearch = function (elm, opt) {
    var def = {
      active: 'active',
      timeout: 400,
      target: '[data-search]'
    },
        attr = opt ? extend(def, opt) : def;
    var $elem = $(elm),
        $target = $(attr.target);

    if ($elem.exists()) {
      $elem.on('click', function (e) {
        e.preventDefault();
        var $self = $(this),
            the_target = $self.data('target'),
            $self_st = $('[data-search=' + the_target + ']'),
            $self_tg = $('[data-target=' + the_target + ']');

        if (!$self_st.hasClass(attr.active)) {
          $self_tg.add($self_st).addClass(attr.active);
          $self_st.find('input').focus();
        } else {
          $self_tg.add($self_st).removeClass(attr.active);
          setTimeout(function () {
            $self_st.find('input').val('');
          }, attr.timeout);
        }
      });
      $doc.on({
        keyup: function keyup(e) {
          if (e.key === "Escape") {
            $elem.add($target).removeClass(attr.active);
          }
        },
        mouseup: function mouseup(e) {
          if (!$target.find('input').val() && !$target.is(e.target) && $target.has(e.target).length === 0 && !$elem.is(e.target) && $elem.has(e.target).length === 0) {
            $elem.add($target).removeClass(attr.active);
          }
        }
      });
    }
  }; // Animate FormElement @v1.0


  ZehraApp.Ani.formElm = function (elm, opt) {
    var def = {
      focus: 'focused'
    },
        attr = opt ? extend(def, opt) : def;

    if ($(elm).exists()) {
      $(elm).each(function () {
        var $self = $(this);

        if ($self.val()) {
          $self.parent().addClass(attr.focus);
        }

        $self.on({
          focus: function focus() {
            $self.parent().addClass(attr.focus);
          },
          blur: function blur() {
            if (!$self.val()) {
              $self.parent().removeClass(attr.focus);
            }
          }
        });
      });
    }
  }; // Form Validate @v1.0


  ZehraApp.Validate = function (elm, opt) {
    if ($(elm).exists()) {
      $(elm).each(function () {
        var def = {
          errorElement: "span"
        },
            attr = opt ? extend(def, opt) : def;
        $(this).validate(attr);
      });
    }
  };

  ZehraApp.Validate.init = function () {
    ZehraApp.Validate('.form-validate', {
      errorElement: "span",
      errorClass: "invalid",
      errorPlacement: function errorPlacement(error, element) {
        error.appendTo(element.parent());
      }
    });
  }; // Dropzone @v1.1


  ZehraApp.Dropzone = function (elm, opt) {
    if ($(elm).exists()) {
      $(elm).each(function () {
        var maxFiles = $(elm).data('max-files'),
            maxFiles = maxFiles ? maxFiles : null;
        var maxFileSize = $(elm).data('max-file-size'),
            maxFileSize = maxFileSize ? maxFileSize : 256;
        var acceptedFiles = $(elm).data('accepted-files'),
            acceptedFiles = acceptedFiles ? acceptedFiles : null;
        var def = {
          autoDiscover: false,
          maxFiles: maxFiles,
          maxFilesize: maxFileSize,
          acceptedFiles: acceptedFiles
        },
            attr = opt ? extend(def, opt) : def;
        $(this).addClass('dropzone').dropzone(attr);
      });
    }
  }; // Dropzone Init @v1.0


  ZehraApp.Dropzone.init = function () {
    ZehraApp.Dropzone('.upload-zone', {
      url: "/images"
    });
  }; // Wizard @v1.0


  ZehraApp.Wizard = function () {
    var $wizard = $(".nk-wizard").show();
    $wizard.steps({
      headerTag: ".nk-wizard-head",
      bodyTag: ".nk-wizard-content",
      labels: {
        finish: "Submit",
        next: "Next",
        previous: "Prev",
        loading: "Loading ..."
      },
      onStepChanging: function onStepChanging(event, currentIndex, newIndex) {
        // Allways allow previous action even if the current form is not valid!
        if (currentIndex > newIndex) {
          return true;
        } // Needed in some cases if the user went back (clean up)


        if (currentIndex < newIndex) {
          // To remove error styles
          $wizard.find(".body:eq(" + newIndex + ") label.error").remove();
          $wizard.find(".body:eq(" + newIndex + ") .error").removeClass("error");
        }

        $wizard.validate().settings.ignore = ":disabled,:hidden";
        return $wizard.valid();
      },
      onFinishing: function onFinishing(event, currentIndex) {
        $wizard.validate().settings.ignore = ":disabled";
        return $wizard.valid();
      },
      onFinished: function onFinished(event, currentIndex) {
        window.location.href = "#";
      }
    }).validate({
      errorElement: "span",
      errorClass: "invalid",
      errorPlacement: function errorPlacement(error, element) {
        error.appendTo(element.parent());
      }
    });
  }; // DataTable @1.1


  ZehraApp.DataTable = function (elm, opt) {
    if ($(elm).exists()) {
      $(elm).each(function () {
        var auto_responsive = $(this).data('auto-responsive');
        var dom_normal = '<"row justify-between g-2"<"col-7 col-sm-6 text-left"f><"col-5 col-sm-6 text-right"<"datatable-filter"l>>><"datatable-wrap my-3"t><"row align-items-center"<"col-7 col-sm-12 col-md-9"p><"col-5 col-sm-12 col-md-3 text-left text-md-right"i>>';
        var dom_separate = '<"row justify-between g-2"<"col-7 col-sm-6 text-left"f><"col-5 col-sm-6 text-right"<"datatable-filter"l>>><"my-3"t><"row align-items-center"<"col-7 col-sm-12 col-md-9"p><"col-5 col-sm-12 col-md-3 text-left text-md-right"i>>';
        var dom = $(this).hasClass('is-separate') ? dom_separate : dom_normal;
        var def = {
          responsive: true,
          autoWidth: false,
          dom: dom,
          language: {
            search: "",
            searchPlaceholder: "Type in to Search",
            lengthMenu: "<span class='d-none d-sm-inline-block'>Show</span><div class='form-control-select'> _MENU_ </div>",
            info: "_START_ -_END_ of _TOTAL_",
            infoEmpty: "No records found",
            infoFiltered: "( Total _MAX_  )",
            paginate: {
              "first": "First",
              "last": "Last",
              "next": "Next",
              "previous": "Prev"
            }
          }
        },
            attr = opt ? extend(def, opt) : def;
        attr = auto_responsive === false ? extend(attr, {
          responsive: false
        }) : attr;
        $(this).DataTable(attr);
      });
    }
  }; // DataTable Init @v1.0


  ZehraApp.DataTable.init = function () {
    ZehraApp.DataTable('.datatable-init', {
      responsive: {
        details: true
      }
    });
    $.fn.DataTable.ext.pager.numbers_length = 7;
  }; // BootStrap Extended


  ZehraApp.BS.ddfix = function (elm, exc) {
    var dd = elm ? elm : '.dropdown-menu',
        ex = exc ? exc : 'a:not(.clickable), button:not(.clickable), a:not(.clickable) *, button:not(.clickable) *';
    $(dd).on('click', function (e) {
      if (!$(e.target).is(ex)) {
        e.stopPropagation();
        return;
      }
    });

    if (ZehraApp.State.isRTL) {
      var $dMenu = $('.dropdown-menu');
      $dMenu.each(function () {
        var $self = $(this);

        if ($self.hasClass('dropdown-menu-right') && !$self.hasClass('dropdown-menu-center')) {
          $self.prev('[data-toggle="dropdown"]').dropdown({
            popperConfig: {
              placement: 'bottom-start'
            }
          });
        } else if (!$self.hasClass('dropdown-menu-right') && !$self.hasClass('dropdown-menu-center')) {
          $self.prev('[data-toggle="dropdown"]').dropdown({
            popperConfig: {
              placement: 'bottom-end'
            }
          });
        }
      });
    }
  }; // BootStrap Specific Tab Open


  ZehraApp.BS.tabfix = function (elm) {
    var tab = elm ? elm : '[data-toggle="modal"]';
    $(tab).on('click', function () {
      var _this = $(this),
          target = _this.data('target'),
          target_href = _this.attr('href'),
          tg_tab = _this.data('tab-target');

      var modal = target ? $body.find(target) : $body.find(target_href);

      if (tg_tab && tg_tab !== '#' && modal) {
        modal.find('[href="' + tg_tab + '"]').tab('show');
      } else if (modal) {
        var tabdef = modal.find('.nk-nav.nav-tabs');
        var link = $(tabdef[0]).find('[data-toggle="tab"]');
        $(link[0]).tab('show');
      }
    });
  }; // Dark Mode Switch @since v2.0


  ZehraApp.ModeSwitch = function () {
    var toggle = $('.dark-switch');

    if ($body.hasClass('dark-mode')) {
      toggle.addClass('active');
    } else {
      toggle.removeClass('active');
    }

    toggle.on('click', function (e) {
      e.preventDefault();
      $(this).toggleClass('active');
      $body.toggleClass('dark-mode');
    });
  }; // Knob @v1.0


  ZehraApp.Knob = function (elm, opt) {
    if ($(elm).exists() && typeof $.fn.knob === 'function') {
      var def = {
        min: 0
      },
          attr = opt ? extend(def, opt) : def;
      $(elm).each(function () {
        $(this).knob(attr);
      });
    }
  }; // Knob Init @v1.0


  ZehraApp.Knob.init = function () {
    var knob = {
      "default": {
        readOnly: true,
        lineCap: "round"
      },
      half: {
        angleOffset: -90,
        angleArc: 180,
        readOnly: true,
        lineCap: "round"
      }
    };
    ZehraApp.Knob('.knob', knob["default"]);
    ZehraApp.Knob('.knob-half', knob.half);
  }; // Range @v1.0.1


  ZehraApp.Range = function (elm, opt) {
    if ($(elm).exists() && typeof noUiSlider !== 'undefined') {
      $(elm).each(function () {
        var $self = $(this),
            self_id = $self.attr('id');
        var target = document.getElementById(self_id);
        var def = {
          start: [25],
          connect: 'lower',
          direction: ZehraApp.State.isRTL ? "rtl" : "ltr",
          range: {
            'min': 0,
            'max': 100
          }
        },
            attr = opt ? extend(def, opt) : def;
        noUiSlider.create(target, attr);
      });
    }
  }; // Range Init @v1.0


  ZehraApp.Range.init = function () {
    ZehraApp.Range('.form-range-slider');
  };

  ZehraApp.Select2.init = function () {
    // ZehraApp.Select2('.select');
    ZehraApp.Select2('.form-select');
  }; // Slick Slider @v1.0.1


  ZehraApp.Slick = function (elm, opt) {
    if ($(elm).exists() && typeof $.fn.slick === 'function') {
      $(elm).each(function () {
        var def = {
          'prevArrow': '<div class="slick-arrow-prev"><a href="javascript:void(0);" class="slick-prev"><em class="icon ni ni-chevron-left"></em></a></div>',
          'nextArrow': '<div class="slick-arrow-next"><a href="javascript:void(0);" class="slick-next"><em class="icon ni ni-chevron-right"></em></a></div>',
          rtl: ZehraApp.State.isRTL
        },
            attr = opt ? extend(def, opt) : def;
        $(this).slick(attr);
      });
    }
  }; // Slick Init @v1.0


  ZehraApp.Slider.init = function () {
    ZehraApp.Slick('.slider-init');
  }; // Number Spinner 


  ZehraApp.NumberSpinner = function (elm, opt) {
    var plus = document.querySelectorAll("[data-number='plus']");
    var minus = document.querySelectorAll("[data-number='minus']");
    plus.forEach(function (item, index, arr) {
      var parent = plus[index].parentNode;
      plus[index].addEventListener("click", function () {
        var child = plus[index].parentNode.children;
        child.forEach(function (item, index, arr) {
          if (child[index].classList.contains("number-spinner")) {
            var value = !child[index].value == "" ? parseInt(child[index].value) : 0;
            var step = !child[index].step == "" ? parseInt(child[index].step) : 1;
            var max = !child[index].max == "" ? parseInt(child[index].max) : Infinity;

            if (max + 1 > value + step) {
              child[index].value = value + step;
            } else {
              child[index].value = value;
            }
          }
        });
      });
    });
    minus.forEach(function (item, index, arr) {
      var parent = minus[index].parentNode;
      minus[index].addEventListener("click", function () {
        var child = minus[index].parentNode.children;
        child.forEach(function (item, index, arr) {
          if (child[index].classList.contains("number-spinner")) {
            var value = !child[index].value == "" ? parseInt(child[index].value) : 0;
            var step = !child[index].step == "" ? parseInt(child[index].step) : 1;
            var min = !child[index].min == "" ? parseInt(child[index].min) : 0;

            if (min - 1 < value - step) {
              child[index].value = value - step;
            } else {
              child[index].value = value;
            }
          }
        });
      });
    });
  }; // Extra @v1.1


  ZehraApp.OtherInit = function () {
    ZehraApp.ClassBody();
    ZehraApp.PassSwitch();
    ZehraApp.CurrentLink();
    ZehraApp.LinkOff('.is-disable');
    ZehraApp.ClassNavMenu();
    ZehraApp.SetHW('[data-height]', 'height');
    ZehraApp.SetHW('[data-width]', 'width');
    ZehraApp.NumberSpinner();
  }; // Animate Init @v1.0


  ZehraApp.Ani.init = function () {
    ZehraApp.Ani.formElm('.form-control-outlined');
    ZehraApp.Ani.formSearch('.toggle-search');
  }; // BootstrapExtend Init @v1.0


  ZehraApp.BS.init = function () {
    ZehraApp.BS.menutip('a.nk-menu-link');
    ZehraApp.BS.tooltip('.nk-tooltip');
    ZehraApp.BS.tooltip('.btn-tooltip', {
      placement: 'top'
    });
    ZehraApp.BS.tooltip('[data-toggle="tooltip"]');
    ZehraApp.BS.tooltip('.tipinfo,.nk-menu-tooltip', {
      placement: 'right'
    });
    ZehraApp.BS.popover('[data-toggle="popover"]');
    ZehraApp.BS.progress('[data-progress]');
    ZehraApp.BS.fileinput('.custom-file-input');
    ZehraApp.BS.modalfix();
    ZehraApp.BS.ddfix();
    ZehraApp.BS.tabfix();
  }; // Picker Init @v1.0


  ZehraApp.Picker.init = function () {
    ZehraApp.Picker.date('.date-picker');
    ZehraApp.Picker.dob('.date-picker-alt');
    ZehraApp.Picker.time('.time-picker');
    ZehraApp.Picker.date('.date-picker-range', {
      todayHighlight: false,
      autoclose: false
    });
  }; // $('.date-input-daterange').datepicker();
  // Addons @v1


  ZehraApp.Addons.Init = function () {
    ZehraApp.Knob.init();
    ZehraApp.Range.init();
    ZehraApp.Select2.init();
    ZehraApp.Dropzone.init();
    ZehraApp.Slider.init();
    ZehraApp.DataTable.init();
  }; // Toggler @v1


  ZehraApp.TGL.init = function () {
    ZehraApp.TGL.content('.toggle');
    ZehraApp.TGL.expand('.toggle-expand');
    ZehraApp.TGL.expand('.toggle-opt', {
      toggle: false
    });
    ZehraApp.TGL.showmenu('.nk-nav-toggle');
    ZehraApp.TGL.ddmenu('.' + _menu + '-toggle', {
      self: _menu + '-toggle',
      child: _menu + '-sub'
    });
  };

  ZehraApp.BS.modalOnInit = function () {
    $('.modal').on('shown.bs.modal', function () {
      ZehraApp.Select2.init();
      ZehraApp.Validate.init();
    });
  }; // Initial by default
  /////////////////////////////


  ZehraApp.init = function () {
    ZehraApp.coms.docReady.push(ZehraApp.OtherInit);
    ZehraApp.coms.docReady.push(ZehraApp.Prettify);
    ZehraApp.coms.docReady.push(ZehraApp.ColorBG);
    ZehraApp.coms.docReady.push(ZehraApp.ColorTXT);
    ZehraApp.coms.docReady.push(ZehraApp.Copied);
    ZehraApp.coms.docReady.push(ZehraApp.Ani.init);
    ZehraApp.coms.docReady.push(ZehraApp.TGL.init);
    ZehraApp.coms.docReady.push(ZehraApp.BS.init);
    ZehraApp.coms.docReady.push(ZehraApp.Validate.init);
    ZehraApp.coms.docReady.push(ZehraApp.Picker.init);
    ZehraApp.coms.docReady.push(ZehraApp.Addons.Init);
    ZehraApp.coms.docReady.push(ZehraApp.Wizard);
    ZehraApp.coms.docReady.push(ZehraApp.sbCompact);
    ZehraApp.coms.winLoad.push(ZehraApp.ModeSwitch);
  };

  ZehraApp.init();
  return ZehraApp;
}(ZehraApp, jQuery);