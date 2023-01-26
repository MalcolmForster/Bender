window.onload = function(){

    var c = document.getElementById("AppCanvas");
    var ctx = c.getContext("2d");
    var beamHeight = c.offsetHeight-100;
    var canvasWidth = c.offsetWidth;
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(50,beamHeight);
    ctx.lineTo(canvasWidth-50,beamHeight);    
    ctx.stroke();

};

var array = ["loadDiv", "connDiv", "beamDiv"];

function hideOtherDivs(eleNum) {
    i = 0;
    while(i < array.length) {
        if(i != eleNum) {
            var otherEle = document.getElementById(array[i]);
            otherEle.style ="hidden";            
        }
        i++;
    }
}

function addElement(eleType) {
    var c = document.getElementById("AppCanvas");
    var ctx = c.getContext("2d");

    if(eleType == 0) {
        //add a load to the beam
        console.log("going to add a load")
        var ele = document.getElementById("loadDiv");
        if(ele.style.display != "block") {
            console.log("was not found");
            ele.style.display = "block";
        }
        hideOtherDivs(eleType);
    } else if(eleType == 1) {
        //add a connecton to the beam
        console.log("going to add a load")
        var ele = document.getElementById("connDiv");

        if(ele.style.display != "block") {
            console.log("was not found");
            ele.style.display = "block";
        }

        hideOtherDivs(eleType);
        
    } else if(eleType == 2) {
        console.log("going to add a load")
        var ele = document.getElementById("beamDiv");
        if(ele.style.display != "block") {
            console.log("was not found");
            ele.style.display = "block";
        }
        hideOtherDivs(eleType);
    }
}

function cancelFunc() {
   hideOtherDivs();
}

