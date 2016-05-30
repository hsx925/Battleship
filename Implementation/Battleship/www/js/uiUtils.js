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
        //console.log(container.children().first().children().first().height());
        return container.children().first().children().first().height();
    },

    createShip: function (ship, height, additionalClasses) {
        if(!additionalClasses){
            additionalClasses="";
        }
        var shipUi=null;
        switch (ship.size) {
            case 1:
                shipUi = '<img src="img/battle_ship_1_blue.png" data-id="'+ ship.id +'" class="ship '+additionalClasses+'" style="height: ' + height + 'px;">';
                break;
            case 2:
                shipUi = '<img src="img/battle_ship_2_blue.png" data-id="'+ ship.id +'" class="ship '+additionalClasses+'" style="height: ' + height + 'px;">';
                break;
            case 3:
                shipUi = '<img src="img/battle_ship_3_blue.png" data-id="'+ ship.id +'" class="ship '+additionalClasses+'" style="height: ' + height + 'px;">';
                break;
            case 4:
                shipUi = '<img src="img/battle_ship_4_blue.png" data-id="'+ ship.id +'" class="ship '+additionalClasses+'" style="height: ' + height + 'px;">';
                break;
            case 5:
                shipUi = '<img src="img/battle_ship_5_blue.png" data-id="'+ ship.id +'" class="ship '+additionalClasses+'" style="height: ' + height + 'px;">';
                break;
        }
        return shipUi;
    },

    createShipsInBay: function (container, ships, height) {
        container.empty();
        var arrX = new Array(), arrY = new Array();
        var x=0, y=0;
        for(var i=0; i<ships.length; i++){
            arrX[x] = BATTLESHIP.uiUtils.createShip(ships[i], height, "shipInBay");
            ++x;
            if(i===ships.length-1||ships[i+1].size!==ships[i].size){
                arrY[y]='<div class="shipContainerRow">'+arrX.join("\r\n")+'</div>';
                ++y;
                x=0;
                arrX = new Array();
            }
        }
        container.append(arrY.join("\r\n"));
    }
};