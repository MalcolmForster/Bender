var beamHeight;
var beamThk;
var canvasWidth;

window.onload = function(){

    var c = document.getElementById("AppCanvas");
    c.addEventListener('click',canvasClick);
    var ctx = c.getContext("2d");
    beamHeight = c.offsetHeight-100;
    canvasWidth = c.offsetWidth;
    beamThk = 10;
    ctx.lineWidth = beamThk;
    ctx.beginPath();
    ctx.moveTo(50,beamHeight);
    ctx.lineTo(canvasWidth-50,beamHeight);    
    ctx.stroke();

};

var ctrlDivs = ["loadDiv", "suppDiv", "beamDiv"];
var supportDivs = ["RollerEdit", "PinnedEdit", "FixedEdit"];


var allDivsToHide = [...ctrlDivs, ...supportDivs];

function hideOtherDivs(eleNum, array) {
    if(array == null) {
        array = allDivsToHide;
    }
    i = 0;
    while(i < array.length) {
        var otherEle = document.getElementById(array[i]);
        if(i != eleNum) {        
            otherEle.style = "hidden";            
        } else {            
            otherEle.style.display = "block";
        }
        i++;
    }
}

function addElement(eleType) {
    var c = document.getElementById("AppCanvas");
    var ctx = c.getContext("2d");

    if(eleType == 0) {
        //add a load to the beam
        console.log("going to add a load");   
    } else if(eleType == 1) {
        //add a connecton to the beam
        console.log("going to add a support");
        
    } else if(eleType == 2) {
        console.log("editing beam")
        var ele = document.getElementById("beamDiv");
    }
    hideOtherDivs(eleType,null);
}

function cancelFunc() {
   hideOtherDivs(-1,null);
}

function changeSupportType() {
    var num = parseInt($("#supportType").find(":selected").val());
    
    hideOtherDivs(num, supportDivs);
}

function findVisibleDiv(divArray) {
    var divOpen = null;
    divArray.forEach(element => {
        var domElement = document.getElementById(element);        
        if(domElement.style.display == "block") {
            divOpen = element;
        }
    });
    return divOpen;
}

function canvasClick(event) {
    var c = document.getElementById("AppCanvas");
    var marg = (window.getComputedStyle(c)).marginLeft;
    var clickLocation = event.clientX;
    var visibleDiv = findVisibleDiv(supportDivs);
    var clickX = clickLocation-parseInt(marg);

    if(supportDivs.includes(visibleDiv)) {
        createSupport(c,visibleDiv,clickX);
    }
}

function createSupport(c, kind, location) {
    var canvas = c.getContext("2d");
    //console.log("Creating a " + kind + " at location " + location.toString());
    if(kind==supportDivs[0]) {
        let rs = new RollerSupport(location, canvas);
    } else if (kind == supportDivs[1]) {
        let ps = new PinSupport(location, canvas);
    } else if (kind == supportDivs[2]) {
        let fs = new FixedSupport(location, canvas);
    }
    
}

class RollerSupport {
    constructor(location, canvas) {
        var baseWidth = 20;
        var ballRad = 5;
        this.location = location;
        canvas.beginPath();
        canvas.rect(location -(baseWidth/2),beamHeight+(ballRad*2),baseWidth,5);
        canvas.ellipse(location, beamHeight + ballRad + (beamThk/2), ballRad, ballRad, 0, 0, Math.PI * 2);
        canvas.fill();
    }
}

class PinSupport {
    constructor(location, canvas) {
        
    }    
}

class FixedSupport {
    constructor(location, canvas) {
        var side;
        if(location < canvasWidth/2) {
            side = 'r';
        } else if(location >= canvasWidth/2) {
            side = 'l';
        }

        canvas.beginPath();
        canvas.rect();
    }
}