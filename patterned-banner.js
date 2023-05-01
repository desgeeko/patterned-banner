const SIZE = 5;
const MODE_SIZE = 'random';
const OUTLINE = 'no';
const PATTERN = 'circle';
const DENSITY = 100;
const COLOR = 'rgba(128, 128, 128, 1)';
const FONT = 'Montserrat';

function drawBanner(canvas, width) {

    // Initialize variables from dataset
    let size = parseInt(canvas.dataset.max_size) || SIZE;
    let mode_size = canvas.dataset.mode_size || MODE_SIZE;
    let outline = canvas.dataset.outline || OUTLINE;
    let pattern = canvas.dataset.pattern || PATTERN;
    let density = parseInt(canvas.dataset.density) || DENSITY;
    let margin = 4 * size;

    // Initialize dimensions
    let body = document.getElementsByTagName('body')[0];
    let onscreen_ctx = canvas.getContext('2d');
    let h = onscreen_ctx.canvas.height; 
    let w = width || body.clientWidth;
    console.log("height=" + h);
    console.log("width=" + h);
    console.log("margin=" + margin);

    // Offscreen context preparation
    let offscreen_canvas = document.createElement('canvas');
    let offscreen_ctx = offscreen_canvas.getContext('2d')

    offscreen_ctx.canvas.width = w;
    offscreen_ctx.canvas.height = h;
    offscreen_ctx.fillStyle = 'white';
    offscreen_ctx.font = 'Bold ' + (h - 2 * margin) + 'px ' + FONT;
    offscreen_ctx.textAlign = 'center';
    offscreen_ctx.textBaseline = 'middle';

    // Measure text width and apply to onscreen canvas when width has not been specified
    let banner_txt = canvas.innerHTML;
    var tw = Math.floor(offscreen_ctx.measureText(banner_txt).width);

    console.log("banner text=" + banner_txt);
    console.log("text width=" + tw);

    // Onscreen context preparation
    onscreen_ctx.canvas.width = w;
    onscreen_ctx.fillStyle = canvas.dataset.color || COLOR;

    // Draw mask
    offscreen_ctx.fillText(banner_txt, Math.floor(w / 2) - 2, Math.floor(h / 2));
    let on_target = 0;
    let mask = offscreen_ctx.getImageData(0, 0, w, h);

    // Patterns
    function drawSquare(x, y, d) {
        onscreen_ctx.fillRect(x - d / 2, y - d / 2, d, d);
    }
    function drawCircle(x, y, d) {
        onscreen_ctx.beginPath();
        onscreen_ctx.arc(x, y, Math.ceil(d / 2), 0, 2 * Math.PI);
        //onscreen_ctx.stroke();
        onscreen_ctx.fill();
    }

    function expDiff(y, h) {
        let n = (h / 2 - y) / (h / 2);
        if (n > 0) {
            return Math.floor(h / 2 + Math.pow(n, 2) * h / 2);
        }
        else {
            return Math.floor(h / 2 - Math.pow(n, 2) * h / 2);
        }
    }

    function drawShape(x, y, d) {
        if (mode_size == 'random') d = Math.ceil(Math.random() * d);
        if (pattern == 'square') drawSquare(x, y, d);
        else drawCircle(x, y, d);
    }

    // Actual drawing
    let iter = 3 * tw * density / size;
    if (outline == 'border') iter *= 10;

    for (let i = 0; i < iter; i++) {
        let x = Math.floor(Math.random() * w);
        let y = Math.floor(Math.random() * h);
        point = mask.data[4 * (y * Math.floor(w) + x)]
        if (outline == 'no') {
            if (point == 255) {
                on_target += 1;
                drawShape(x, y, size);
            }
        }
        else if (outline == 'background') {
            if (point != 255) {
                on_target += 1;
                drawShape(x, y, size);
            }
        }
        else if (outline == 'border') {
            point_up = mask.data[4 * ((y-1) * Math.floor(w) + x)]
            point_down = mask.data[4 * ((y+1) * Math.floor(w) + x)]
            point_left = mask.data[4 * (y * Math.floor(w) + x-1)]
            point_right = mask.data[4 * (y * Math.floor(w) + x+1)]
            if ((point == 255) 
                && ((point_up != 255) || (point_down != 255) || (point_left != 255) || (point_right != 255))) {
                on_target += 1;
                drawShape(x, y, size);
            }
        }
    }
    console.log("number of drawn shapes=" + on_target);
}

window.addEventListener('load', function() {
    let banners = document.getElementsByClassName('patterned-banner');
    Array.from(banners).forEach((banner) => {
        drawBanner(banner); // add document.getElementsByTagName('body')[0].clientWidth parameter to force width to screen
    });
});
