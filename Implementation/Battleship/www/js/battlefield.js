var BATTLESHIP = BATTLESHIP || {};

BATTLESHIP.Battlefield = function (container, size) {
    this.container = container;
    this.size = size;
    this. field = new Array(size);
    this.container.empty();
    var arrX, arrY = new Array();
    for(var y=0; y<=size; y++){
        this.field[y] = new Array(size);
        arrX = new Array(size);
        for(var x=0; x<=size; x++){
            if(y===0 && x>0){
                this.field[y][x]=-1;
                arrX[x]='<div class="battlefieldField battlefieldText">'+x+'</div>';
            }else if(x===0 && y>0){
                this.field[y][x]=-1;
                arrX[x]='<div class="battlefieldField battlefieldText">'+String.fromCharCode(64 + y)+'</div>';
            }else{
                this.field[y][x]=0;
                arrX[x]='<div class="battlefieldField">&nbsp;</div>';
            }
        }
        arrY[y]='<div class="battlefieldRow">'+arrX.join("\r\n")+'</div>';
    }
    this.container.append(arrY.join("\r\n"));
}

var createBattlefield=function(container, size){
    console.log(container);
    var arrX, arrY = new Array();
    for(var y=0; y<=size; y++){
        arrX = new Array();
        for(var x=0; x<=size; x++){
            if(y===0 && x>0){
                arrX[x]='<div class="battlefieldField battlefieldText">'+x+'</div>';
            }else if(x===0 && y>0){
                arrX[x]='<div class="battlefieldField battlefieldText">'+String.fromCharCode(64 + y)+'</div>';
            }else{
                arrX[x]='<div class="battlefieldField">&nbsp;</div>';
            }
            //arrX[x]='<div class="battlefieldField">&nbsp;</div>';
        }
        arrY[y]='<div class="battlefieldRow">'+arrX.join("\r\n")+'</div>';
    }
    container.append(arrY.join("\r\n"));
};

$(document).ready(function () {
    
});
