(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.FH = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = void 0;

  const {
    createPopper
  } = require('@popperjs/core');

  const FH = function () {
    let _counter = 0;
    let _steps = [];

    function _isInViewport(element) {
      const rect = element.getBoundingClientRect();
      return rect.top >= 0 && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth);
    }

    function _start() {
      document.onreadystatechange = () => {
        if (document.readyState === 'complete') {
          // document ready
          setTimeout(() => {
            console.log("After 5 seconds of DOM READY complete");

            _showFeatureHelp();
          }, 5000);
        }
      };
    }

    function _showDialog(message, selector) {
      console.log("dialog shown" + message);
      let dialogDiv = document.querySelector('#fh-tooltip');

      if (!dialogDiv) {
        dialogDiv = document.createElement('div');
        dialogDiv.setAttribute('id', 'fh-tooltip');
        dialogDiv.setAttribute('role', 'tooltip'); // let ignoreBtn = document.createElement('button');
        // ignoreBtn.setAttribute('id', 'fh-ignore-btn');
        // ignoreBtn.innerHTML = 'Ignore';
        // dialogDiv.appendChild(ignoreBtn);

        document.body.appendChild(dialogDiv);
      } // dialogDiv.style.position = 'absolute';
      // dialogDiv.style.top = '100px';
      // dialogDiv.style.padding = '10px';
      // dialogDiv.style.border = '1px solid GREY';
      // dialogDiv.style.backgroundColor = '#CFC';
      // dialogDiv.style.height = '50px';
      // dialogDiv.style.width = '100px';
      // dialogDiv.style.borderRadius = '5px';


      dialogDiv.innerHTML = message + '<div id="arrow" data-popper-arrow></div><button id="fh-close-btn">x</button>';
      const popcorn = document.querySelector(selector);
      const tooltip = document.querySelector('#fh-tooltip');
      createPopper(popcorn, tooltip, {
        placement: 'top',
        modifiers: [{
          name: 'offset',
          options: {
            offset: [0, 8]
          }
        }]
      });
    }

    function _showFeatureHelp() {
      if (_counter > _steps.length - 1) {
        document.querySelector('#fh-tooltip').style.display = 'none';
        return;
      }

      const step = _steps[_counter]; // look for 10 seconds to wait for element to show in dom

      let elementPresentCounter = 0;
      const elementTimer = setInterval(() => {
        const element = document.querySelectorAll(step.selector)[0];

        if (element) {
          clearInterval(elementTimer);
          let elementInViewPortCounter = 0;
          const elementInViewPortTimer = setInterval(() => {
            if (_isInViewport(element)) {
              _showDialog(step.message, step.selector);

              const clickHandler = function () {
                console.log('element clicked');
                element.removeEventListener('click', clickHandler);
                _counter++;

                _showFeatureHelp();
              };

              element.addEventListener('click', clickHandler);
              clearInterval(elementInViewPortTimer); // Handling click of close button of dialog

              const closeBtn = document.querySelector('#fh-close-btn');

              if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                  // clearInterval(elementInViewPortTimer);
                  element.removeEventListener('click', clickHandler);
                  _counter = 0;
                  document.querySelector('#fh-tooltip').style.display = 'none';
                });
              }
            }

            if (elementInViewPortCounter >= 15) {
              clearInterval(elementInViewPortTimer);
            }

            elementInViewPortCounter++;
          }, 1000);
        }

        if (elementPresentCounter >= 10) {
          clearInterval(elementTimer);
        } else {
          elementPresentCounter++;
        }
      }, 1000);
    }

    return {
      init: options => {
        _steps = options.steps;

        _start();
      }
    };
  }(); // console.log(FH);


  var _default = FH; // module.exports = FH;

  _exports.default = _default;
});