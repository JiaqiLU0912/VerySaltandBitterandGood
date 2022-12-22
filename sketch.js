let vid;
let cam;
let faceapiVid;
let faceapiCam;

let vidIsPlaying = false;
let gillianExpr;
let viewerExpr;

const detectionOptions = {
  withLandmarks: true,
  withExpressions: true,
  withDescriptors: false,
  minConfidence: 0.5
};

function preload() {
  vid = createVideo('assets/07Salt.mp4');
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0);

  vid.position(0, 0);
  vid.size(windowWidth, windowHeight);
  vid.loop();
  faceapiVid = ml5.faceApi(vid, detectionOptions, modelReady);

  cam = createCapture(VIDEO);
  cam.size(width / 4.5, height / 4.5);
  cam.hide();
  faceapiCam = ml5.faceApi(cam, detectionOptions, modelReady);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  translate(width, 0);
  scale(-1, 1);
  image(cam, 0, 0);

  playVideo(gillianExpr, viewerExpr);
}

function modelReady() {
  faceapiVid.detect(gotVidResults);
  faceapiCam.detect(gotCamResults);
}

function gotVidResults(error, vidResults) {
  if (error) {
    console.log(error);
    return;
  }

  let expressions = vidResults[0].expressions;
  // console.log(expressions);

  expr = Object.keys(expressions).sort((a, b) => { return expressions[b] - expressions[a] })
  gillianExpr = expr[0] + expr[1];
  // console.log(gillianExpr);

  faceapiVid.detect(gotVidResults);
}

function gotCamResults(error, camResults) {
  if (error) {
    console.log(error);
    return;
  }

  let expressions = camResults[0].expressions;

  expr = Object.keys(expressions).sort((a, b) => { return expressions[b] - expressions[a] })
  viewerExpr = expr[0] + expr[1];
  // console.log(viewerExpr);

  faceapiCam.detect(gotCamResults);
}

function playVideo(gillianExpr, viewerExpr) {
  if (viewerExpr === gillianExpr) {
    console.log('play');

    vid.play();
    vidIsPlaying = false;
  } else {
    console.log('pause');

    vid.pause();
    vidIsPlaying = true;
  }
}
