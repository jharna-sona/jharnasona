// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"js/bg.js":[function(require,module,exports) {
// CHROME PLS :| Everything else is just ridiculously slow (mostly because of the shadowBlur prop)
(function () {
  var regular_stars = [],
      falling_star;
  var R = Math.PI / 5;
  var G = 1.3;
  var TOTAL = 25;
  var SIZE = 3.5;
  var CURVE = 0.25;
  var ENERGY = 0.01;
  var FALLING_CHANCE = 0.2;
  var canvas = document.querySelector('canvas');
  var cx = canvas.getContext('2d'); //canvas.style.backgroundColor = '#000822';

  resizeViewport();

  function Star() {
    this.r = Math.random() * SIZE * SIZE + SIZE;
    this.rp = Math.PI / Math.random();
    this.rd = Math.random() * 2 - 1;
    this.c = Math.random() * (CURVE * 2 - CURVE) + CURVE;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.e = 0;
    this.d = false;
  }

  function FallingStar() {
    Star.call(this);
    this.y = Math.random() * canvas.height / 2;
    this.r = Math.random() * SIZE * SIZE + SIZE * 3;
    this.falling = false;
  }

  function setShape(p) {
    var o = p.o;
    cx.save();
    cx.beginPath();
    cx.translate(o.x, o.y);
    cx.rotate(o.rp);
    o.rp += o.rd * 0.01;
    cx.moveTo(0, 0 - o.r);

    for (var i = 0; i < 5; i++) {
      cx.rotate(R);
      cx.lineTo(0, 0 - o.r * o.c);
      cx.rotate(R);
      cx.lineTo(0, 0 - o.r);
    }
  }

  function drawShape() {
    cx.stroke();
    cx.fill();
    cx.restore();
  }

  Star.prototype.shine = function () {
    this.d ? this.e -= ENERGY * this.r / 50 : this.e += ENERGY;

    if (this.e > 1 - ENERGY && this.d === false) {
      this.d = true;
    }

    setShape({
      o: this
    });
    cx.strokeStyle = "rgba(255, 209, 143, " + this.e + ")";
    cx.shadowColor = "rgba(255, 209, 143, " + this.e + ")";
    cx.fillStyle = "rgba(255, 209, 143, " + this.e + ")";
    cx.lineWidth = this.c * 2;
    cx.shadowBlur = this.r / SIZE;
    cx.shadowOffsetX = 0;
    cx.shadowOffsetY = 0;
    drawShape();
  };

  FallingStar.prototype.shine = function () {
    this.d ? this.e -= ENERGY * this.r / 25 : this.e += ENERGY * 5;

    if (this.e > 1 - ENERGY && this.d === false) {
      this.d = true;
    }

    setShape({
      o: this
    });
    cx.strokeStyle = "rgba(221, 19, 255, " + this.e * 2 + ")";
    cx.shadowColor = "rgba(221, 19, 255, " + this.e * 2 + ")";
    cx.fillStyle = "rgba(221, 19, 255, " + this.e * 2 + ")";
    cx.lineWidth = this.c * 2;
    cx.shadowBlur = 50;
    cx.shadowOffsetX = 0;
    cx.shadowOffsetY = 0;
    drawShape();
  };

  FallingStar.prototype.fall = function () {
    this.e -= ENERGY * 0.5;
    this.r -= this.r * ENERGY;
    cx.save();
    cx.translate(this.x + this.vx, this.y + this.vy);
    cx.scale(1, Math.pow(this.e, 2));
    cx.beginPath();
    cx.rotate(this.rp);
    this.rp += .1;
    cx.moveTo(0, 0 - this.r);

    for (var i = 0; i < 5; i++) {
      cx.rotate(R);
      cx.lineTo(0, 0 - this.r * this.c);
      cx.rotate(R);
      cx.lineTo(0, 0 - this.r);
    }

    this.vx += this.vx;
    this.vy += this.vy * G;
    cx.strokeStyle = "rgba(255, 210, 93, " + 1 / this.e + ")";
    cx.shadowColor = "rgba(255, 210, 93, " + 1 / this.e + ")";
    cx.fillStyle = "rgba(255, 210, 93, " + 1 / this.e + ")";
    cx.shadowBlur = 100;
    drawShape();
  };

  function redrawWorld() {
    resizeViewport();
    cx.clearRect(0, 0, canvas.width, canvas.height);
    if (regular_stars.length < TOTAL) regular_stars.push(new Star());

    for (var i = 0; i < regular_stars.length; i++) {
      regular_stars[i].shine();

      if (regular_stars[i].d === true && regular_stars[i].e < 0) {
        regular_stars.splice(i, 1);
      }
    }

    if (!falling_star && FALLING_CHANCE > Math.random()) {
      falling_star = new FallingStar();
    }

    if (falling_star) {
      falling_star.falling ? falling_star.fall() : falling_star.shine();

      if (falling_star.e < ENERGY) {
        falling_star = null;
      }
    }

    requestAnimationFrame(redrawWorld, canvas);
  }

  function resizeViewport() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function mouseMove(e) {
    if (falling_star) {
      if (e.clientX > falling_star.x - 2 * falling_star.r && e.clientX < falling_star.x + 2 * falling_star.r && e.clientY > falling_star.y - 2 * falling_star.r && e.clientY < falling_star.y + 2 * falling_star.r) {
        if (!falling_star.falling) {
          falling_star.falling = true;
          falling_star.e = 1;
          falling_star.r *= 2;
          falling_star.vy = 0.001;

          if (e.clientX > canvas.width / 2) {
            falling_star.vx = -(Math.random() * .01 + .01);
          } else {
            falling_star.vx = Math.random() * .01 + .01;
          }
        }
      }
    }
  }

  document.addEventListener('resize', resizeViewport, false);
  canvas.addEventListener('mousemove', mouseMove, false);
  canvas.addEventListener("touchstart", mouseMove, false);
  redrawWorld();
})();
},{}],"../../../.nvm/versions/node/v10.16.3/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "45347" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../.nvm/versions/node/v10.16.3/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/bg.js"], null)
//# sourceMappingURL=/bg.bd0fa76d.js.map