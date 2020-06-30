var currentState = 0;
var trackButton = document.getElementsByClassName("next");
var findText = document.getElementsByClassName("text-content");

var textContent = new Array();
var htmlContent = new Array();
var cssContent = new Array();
var browserContent = new Array();

let requestURL = "css.json";
let request = new XMLHttpRequest();
request.open("GET", requestURL);
request.responseType = "json";
request.send();

request.onload = function () {
  const content = request.response;
  console.log(content);
  console.log(content.exercise_name);
  document.getElementsByClassName("text-heading")[0].innerHTML =
    "<h2>" +
    content.exercise_name +
    '</h2><p class="text-steps">' +
    content.steps.length +
    " steps</p>";
  // set up our tutorial
  // run through it
  //https://zellwk.com/blog/looping-through-js-objects/

  const required_views = Object.entries(content.set_up);
  for (const [view, visible] of required_views) {
    console.log(`${view} should be visible: ${visible}`);
  }

  content.steps.forEach(function (step) {
    textContent.push(step.text);
    cssContent.push(step.css);
    htmlContent.push(step.html);
    browserContent.push(step.browser);
  });

  startPresentation();
};

function startPresentation() {
  updateText(findText, textContent[currentState]);
  addToCSSIframe("css", cssContent[currentState]);
  addToHTMLIframe("html", htmlContent[currentState]);
  addToBrowserIframe(
    "browser",
    cssContent[currentState],
    htmlContent[currentState]
  );
  trackButton[0].addEventListener("click", advancePresentation);
}

function advancePresentation() {
  window.scrollTo(0, 0);
  currentState++;
  updateText(findText, textContent[currentState]);
  addToCSSIframe("css", cssContent[currentState]);
  addToHTMLIframe("html", htmlContent[currentState]);
  addToBrowserIframe(
    "browser",
    cssContent[currentState],
    htmlContent[currentState]
  );
  if (textContent[currentState + 1] == undefined) {
    trackButton[0].remove();
  }
}

function updateText(update, content) {
  update[0].innerHTML = content;
}

function addToCSSIframe(target, content) {
  console.log(content);
  var doc = document.getElementById(target).contentWindow.document;
  doc.open();
  var visibleCSS = content.split("}").join("}\n").split("*/").join("*/\n");
  doc.write(
    '<!DOCTYPE html><html><head><link href="prism.css" rel="stylesheet" /><style>body {color: #eee; font-family:monospace; font-size: 1rem;}</style></head><body><pre><code class="language-css">' +
      visibleCSS +
      '</code></pre><script src="prism.js"></script></body></html>'
  );
  doc.close();
}

function addToHTMLIframe(target, content) {
  console.log(content);
  var doc = document.getElementById(target).contentWindow.document;
  doc.open();
  var visibleHTML = content
    .split("<")
    .join("&lt;")
    .split(">")
    .join("&gt;\n")
    .split("&lt;/")
    .join("\n&lt;/");
  console.log(content);
  doc.write(
    '<!DOCTYPE html><html><head><link href="prism.css" rel="stylesheet" /><style>body {color: #eee; font-family:monospace; font-size: 1rem;  }</style></head><body><pre><code class="language-html">' +
      visibleHTML +
      '</code></pre><script src="prism.js"></script></body></html>'
  );
  doc.close();
}

function addToBrowserIframe(target, cssContent, HTMLcontent) {
  var doc = document.getElementById(target).contentWindow.document;
  doc.open();
  doc.write(
    "<html><head><style>" +
      cssContent +
      "</style></head><body>" +
      HTMLcontent +
      "</body></html>"
  );
  doc.close();
}
