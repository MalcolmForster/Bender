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

var ctrlDivs = ["loadDiv", "suppDiv", "beamDiv"];

function hideOtherDivs(eleNum, array) {
    i = 0;
    while(i < array.length) {
        var otherEle = document.getElementById(array[i]);
        if(i != eleNum) {        
            otherEle.style ="hidden";            
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
    hideOtherDivs(eleType,ctrlDivs);
}

function cancelFunc() {
   hideOtherDivs(-1,ctrlDivs);
}

function changeSupportType() {
    var num = parseInt($("#supportType").find(":selected").val());
    
    var array = ["RollerEdit", "PinnedEdit", "FixedEdit"];
    hideOtherDivs(num, array);
}
