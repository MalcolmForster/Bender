var beamHeight;
var beamThk;
var canvasWidth;
var canvasBorder = 50;

var RollerSupports = [];
var PinSupports = [];
var FixedSupports = [];

window.onload = function(){

    var c = document.getElementById("AppCanvas");
    c.addEventListener('click',canvasClick);
    var ctx = c.getContext("2d");
    beamHeight = c.offsetHeight-100;
    canvasWidth = c.offsetWidth;
    beamThk = 10;
    ctx.lineWidth = beamThk;
    ctx.beginPath();
    ctx.moveTo(canvasBorder,beamHeight);
    ctx.lineTo(canvasWidth-canvasBorder,beamHeight);    
    ctx.stroke();

};

var ctrlDivs = ["loadDiv", "suppDiv", "beamDiv"];
var supportDivs = ["RollerEdit", "PinnedEdit", "FixedEdit"];
var loadDivs = ["DistributedEdit", "PointEdit", "MomentEdit"];
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
        RollerSupports.push(rs);
        console.log(RollerSupports.length);
    } else if (kind == supportDivs[1]) {
        let ps = new PinSupport(location, canvas);
        PinSupports.push(ps);
        console.log(PinSupports.length);
    } else if (kind == supportDivs[2]) {
        let fs = new FixedSupport(location, canvas);
        
        if(fs["side"] != 'f') {
            FixedSupports.push(fs);
            console.log(FixedSupports.length);
        }
    }    
}

// Below are the support classes

class RollerSupport {
    constructor(location, canvas) {
        this.location = location;
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
        this.location = location;
        var sideLength = 10;
        var bottomOfBeam = beamHeight +(beamThk/2)

        canvas.beginPath();
        canvas.moveTo(location, bottomOfBeam);
        canvas.lineTo(location+(sideLength/2), bottomOfBeam+10);
        canvas.lineTo(location-(sideLength/2), bottomOfBeam+10);
        canvas.fill();        
    }    
}


class FixedSupport {
    constructor(location, canvas) {
        var supportWidth = 20;
        var supportHeight = 40;
        var side;

        this.side = 'f';

        if(location < canvasWidth/2 && this.checkExists('l') == false) {
            var xLoc = canvasBorder-supportWidth;
            this.side = 'l';
        } else if(location >= canvasWidth/2 && this.checkExists('r') == false) {
            var xLoc = canvasWidth-canvasBorder;
            this.side = 'r';
        }
        
        if(side != 'f') {
            this.location = this.side;
            canvas.beginPath();
            canvas.rect(xLoc,beamHeight-(supportHeight/2),supportWidth,supportHeight);
            canvas.fill();
        }
    }

    checkExists(checkSide) {
        var found = false;
        FixedSupports.forEach(element => {
            if(element.side == checkSide) {
                found = true;
            }
        });
        return found;
    }
}


// Method called from html page to create loads

function createLoad(c,kind,location,amount) {

    var canvas = c.getContext("2d");
    if(kind==loadDivs[0]) {
        let rs = new DistributedLoad(location[0],location[1], amount[0],amount[1],canvas);
        DistributedLoads.push(rs);
        console.log(DistributedLoads.length);

    } else if (kind == loadDivs[1]) {
        let pl = new PointLoad(location, amount, canvas);
        PointLoads.push(pl);
        console.log(PointLoads.length);

    } else if (kind == loadDivs[2]) {
        let mo = new Moment(location, amount, canvas);
        MomentLoads.push(mo);
        console.log(MomentLoads.length);
    }
     
}

// Below are the load classes

class DistributedLoad {
    constructor(startLoc, finishLoc, startHeight, finishHeight, canvas) {
        this.startLoc = startLoc;
        this.finishLoc = finishLoc;
        this.leftAmount = startHeight;
        this.rightAmount = finishHeight;


    }
}

class PointLoad {
    constructor(location, amount, canvas) {
        this.location = location;
        this.amount = amount; // size of the point load applied

        var sideLength = 10;
        var topOfBeam = beamHeight - (beamThk/2)
        
        canvas.beginPath();
        canvas.moveTo(location, topOfBeam);
        canvas.lineTo(location+(sideLength/2), topOfBeam-10);
        canvas.lineTo(location-(sideLength/2), topOfBeam-10);
        canvas.fill();
    }
}

class Moment {
    constructor(location, amount, canvas) {
        this.location = location;
        this.amount = amount; // Size of the moment, +ve = cw and -ve = ccw moments
    }
}

