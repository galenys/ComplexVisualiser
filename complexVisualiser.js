var graphScale = 300;

var sqrtTwo = 1.41421;
var e = 2.718281;
var pi = Math.PI;

var fx = "x";
var fy = "y";

function updateX() {
  fx = document.getElementById('inputX').value;
  doStuff();
}
function updateY() {
  fy = document.getElementById('inputY').value;
  doStuff();
}

function f(x, y) {
  return [eval(fx), eval(fy)];
}

function paint(pos) {
  var d = dist(0, 0, pos[0], pos[1]);
  var maxDist = height/sqrtTwo;
  
  var light = map(d, 0, maxDist, 0, 1);
  
  var arg = argument(pos[0], pos[1]);
  var hue = map(arg, 0, 2*pi, 0, 1);
  
  var rgb = hslToRgb(hue, 1, light);
  rgb.push(255);
  return rgb;
}

function argument(x, y) {
  var angle = Math.atan(Math.abs(y/x));
  if (x<=0 && y>=0) {
    // second quadrant
    angle = pi - angle;
  } else if (x<=0 && y<=0) {
    // third quadrant
    angle = angle - pi;
  } else if (x>=0 && y<=0) {
    // fourth quadrant
    angle = -angle;
  }
  
  return angle;
}

function hslToRgb(h, s, l) {
  var r, g, b;

  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    }

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;

    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return [ r * 255, g * 255, b * 255 ];
}

function setup() {
  createCanvas(window.innerHeight,
               window.innerHeight);
  pixelDensity(1);
  
  doStuff();
}

function doStuff() {
  background(255);
  loadPixels();
  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      var index = (x+y*width)*4;
      
      var output = f(
        (x-width/2)/graphScale, (y-height/2)/graphScale
      );
      output[0] *= graphScale;
      output[1] *= graphScale;
      var rgba = paint(output);
      // var rgba = [255, 0, 0, 255];
      
      for (var i = 0; i < 4; i++) {
        pixels[index+i] = rgba[i];
      }
    }
  }
  updatePixels();
}