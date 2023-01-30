var beamHeight;
var beamThk;
var canvasWidth;
var canvasBorder = 50;
var a = 0;

var ds;

var RollerSupports = [];
var PinSupports = [];
var FixedSupports = [];

var DistributedLoads = [];
var PointLoads = [];
var MomentLoads = [];

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
var allDivsToHide = [...ctrlDivs, ...supportDivs, ...loadDivs];

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

function changeLoadType() {
    var num = parseInt($("#loadType").find(":selected").val());    
    hideOtherDivs(num, loadDivs);
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
    var visibleDiv = findVisibleDiv([...supportDivs,...loadDivs]);
    var clickX = Math.max( canvasBorder,Math.min(clickLocation-parseInt(marg), canvasWidth-canvasBorder));
    console.log(visibleDiv);
    // Checks what div is visible and select
    if(supportDivs.includes(visibleDiv)) {
        createSupport(c,visibleDiv,clickX);
    } else if(loadDivs.includes(visibleDiv)) {        
        createLoad(c,visibleDiv,clickX);        
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
        var bottomOfBeam = beamHeight +(beamThk/2);

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
function createLoad(c,kind,location) {
    var canvas = c.getContext("2d");   
    if(kind==loadDivs[0]) {
        if(a == 1) {            
            var amount = $("#distributedFinish").val();
            if(parseInt(amount)){
                ds.second(location,amount,canvas);
                DistributedLoads.push(ds);                                
                console.log(DistributedLoads.length);
                a = 0;
            } else {
                console.log("Need to input a number");
            }
        } else {
            var amount = $("#distributedStart").val();
            if(parseInt(amount)){   
                ds = new DistributedLoad(location, amount);
                a = 1;
            }  else {
                console.log("Need to input a number");
            }          
        }
    } else if (kind == loadDivs[1]) {
        var amount = $("#pointAmount").val();
        if(parseInt(amount)){
            let pl = new PointLoad(location, amount, canvas);
            PointLoads.push(pl);
            console.log(PointLoads.length);
        } else {
            console.log("Need to input a number");
        }            

    } else if (kind == loadDivs[2]) {
        var amount = $("#momentAmount").val();
        if (parseInt(amount)) {
            let mo = new Moment(location, amount, canvas);
            MomentLoads.push(mo);
            console.log(MomentLoads.length);
        } else {
            console.log("Need to input a number");
        }
    }     
}

// Below are the load classes
class DistributedLoad {
    constructor(startLoc, startHeight) {
        this.startLoc = startLoc;        
        this.startAmount = startHeight;            
    }

    second(finishLoc, finishHeight, canvas) {
        var topOfBeam = beamHeight - (beamThk/2);
        this.finishLoc = finishLoc;
        this.finishAmount = finishHeight;

        canvas.beginPath();
        canvas.moveTo(this.startLoc,topOfBeam);
        canvas.lineTo(this.startLoc,topOfBeam-this.startAmount);
        canvas.lineTo(this.finishLoc,topOfBeam-this.finishAmount);
        canvas.lineTo(this.finishLoc,topOfBeam);
        canvas.fill();
    }
}

class PointLoad {
    constructor(location, amount, canvas) {
        this.location = location;
        this.amount = amount; // size of the point load applied

        var sideLength = 10;
        var rectWidth = 6;
        var rectHeight = 10;
        var topOfBeam = beamHeight - (beamThk/2);
        
        canvas.beginPath();
        canvas.moveTo(location, topOfBeam);
        canvas.lineTo(location+(sideLength/2), topOfBeam-10);
        canvas.lineTo(location-(sideLength/2), topOfBeam-10);
        canvas.rect(location-(rectWidth/2),topOfBeam-10-rectHeight,rectWidth,rectHeight);
        canvas.fill();
    }
}

class Moment {
    constructor(location, amount, canvas) {
        this.location = location;
        this.amount = amount; // Size of the moment, +ve = cw and -ve = ccw moments
        var circleRad = 15;
        canvas.lineWidth = 3;
        canvas.beginPath();
        canvas.arc(location, beamHeight, circleRad,  Math.PI * 0.25, Math.PI * 1.75);
        
        canvas.stroke();
    }
}