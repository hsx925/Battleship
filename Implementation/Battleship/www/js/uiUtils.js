var BATTLESHIP = BATTLESHIP || {};

BATTLESHIP.uiUtils = {

    createBattlefield: function (container, size) {
        container.empty();
        var arrX, arrY = new Array();
        for(var y=0; y<=size; y++){
            arrX = new Array(size);
            for(var x=0; x<=size; x++){
                if(y===0 && x>0){
                    arrX[x]='<div class="battlefieldField battlefieldText">'+x+'</div>';
                }else if(x===0 && y>0){
                    arrX[x]='<div class="battlefieldField battlefieldText">'+String.fromCharCode(64 + y)+'</div>';
                }else if(x===0 && y===0) {
                    arrX[x]='<div class="battlefieldField battlefieldText">&nbsp;</div>';
                }else{
                    arrX[x]='<div class="field battlefieldField" data-x="'+(x-1)+'" data-y="'+(y-1)+'">&nbsp;</div>';
                }
            }
            arrY[y]='<div class="battlefieldRow">'+arrX.join("\r\n")+'</div>';
        }
        container.append(arrY.join("\r\n"));
    },

    getBattlefieldFieldSize: function (container) {
        if(!$.trim(container.html())){ //isemtpy
            return 0;
        }
        console.log(container.children().first().children().first().height());
        return container.children().first().children().first().height();
    },

    createFleet: function (container, fleet, height) {
        container.empty();
        var arrX = new Array(), arrY = new Array();
        var x=0, y=0;
        for(var i=0; i<fleet.length; i++){
            switch (fleet[i]) {
                case 1:
                    arrX[x] = '<img src="img/battle_ship_1_blue.png" data-size="1" class="ship" height="' + height + '">';
                    break;
                case 2:
                    arrX[x] = '<img src="img/battle_ship_2_blue.png" data-size="2" class="ship" height="' + height + '">';
                    break;
                case 3:
                    arrX[x] = '<img src="img/battle_ship_3_blue.png" data-size="3" class="ship" height="' + height + '">';
                    break;
                case 4:
                    arrX[x] = '<img src="img/battle_ship_4_blue.png" data-size="4" class="ship" height="' + height + '">';
                    break;
                case 5:
                    //TODO no ship image available yet
                    break;
            }
            ++x;
            if(i===fleet.length-1||fleet[i+1]!==fleet[i]){
                arrY[y]='<div class="shipRow">'+arrX.join("\r\n")+'</div>';
                ++y;
                x=0;
                arrX = new Array();
            }
        }
        container.append(arrY.join("\r\n"));
    }
};