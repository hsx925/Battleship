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
    createBattlefield($("#placeShipsBattlefield"), 10);
    createBattlefield($("#battleBattlefieldUser"), 10);
    createBattlefield($("#battleBattlefieldEnemy"), 20);
});
