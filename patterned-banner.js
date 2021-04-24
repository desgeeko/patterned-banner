const SIZE = 5;
const MODE_SIZE = 'random';
const PATTERN = 'circle';
const DENSITY = 100;
const COLOR = 'rgba(128, 128, 128, 1)';
const FONT = 'Montserrat';

function drawBanner(canvas, width) {

    // Initialize variables, except width
    let onscreen_ctx = canvas.getContext('2d');
    let h = onscreen_ctx.canvas.height; 
    let size = parseInt(canvas.dataset.max_size) || SIZE;
    let mode_size = canvas.dataset.mode_size || MODE_SIZE;
    let pattern = canvas.dataset.pattern || PATTERN;
    let density = parseInt(canvas.dataset.density) || DENSITY;
    let margin = 2 * size;

    // Offscreen context preparation
    let offscreen_canvas = document.createElement('canvas');
    let offscreen_ctx = offscreen_canvas.getContext('2d')
    let body = document.getElementsByTagName('body')[0];
    offscreen_ctx.canvas.width = width || body.clientWidth;
    offscreen_ctx.canvas.height = h;
    offscreen_ctx.fillStyle = 'white';
    offscreen_ctx.font = 'Bold ' + (h - margin) + 'px ' + FONT;
    offscreen_ctx.textAlign = 'center';
    offscreen_ctx.textBaseline = 'middle';

    // Measure text width and apply to onscreen canvas when width has not been specified
    let banner_txt = canvas.innerHTML;
    var tw = offscreen_ctx.measureText(banner_txt).width;
    let w = width || (Math.ceil(tw) + margin);

    // Onscreen context preparation
    onscreen_ctx.canvas.width = w;
    onscreen_ctx.fillStyle = canvas.dataset.color || COLOR;

    // Draw mask
    offscreen_ctx.fillText(banner_txt, Math.floor(w / 2), Math.floor(h / 2));
    let on_target = 0;
    let mask = offscreen_ctx.getImageData(Math.floor(w / 2) - Math.floor(tw) / 2, 0, Math.floor(tw), h);

    // Patterns
    function drawSquare(x, y, d) {
        onscreen_ctx.fillRect(x, y, d, d);
    }
    function drawCircle(x, y, d) {
        onscreen_ctx.beginPath();
        onscreen_ctx.arc(x, y, Math.ceil(d / 2), 0, 2 * Math.PI);
        //onscreen_ctx.stroke();
        onscreen_ctx.fill();
    }

    // Actual drawing
    let iter = 3 * tw * density / size;
    for (let i = 0; i < iter; i++) {
        let a = Math.floor(Math.random() * Math.floor(tw));
        let b = Math.floor(Math.random() * h);
        let x = Math.floor(Math.floor(w / 2) - Math.floor(tw / 2) + a);
        let y = Math.floor(b);
        if (mask.data[4 * ((b * Math.floor(tw) + a))] == 255) {
            on_target += 1;
            let d = size;
            if (mode_size == 'random') d = Math.ceil(Math.random() * d);
            if (pattern == 'square') drawSquare(x, y, d);
            else drawCircle(x, y, d);
        }
    }
}

window.addEventListener('load', function() {
    let banners = document.getElementsByClassName('patterned-banner');
    Array.from(banners).forEach((banner) => {
        drawBanner(banner); // add document.getElementsByTagName('body')[0].clientWidth parameter to force width to screen
    });
});
