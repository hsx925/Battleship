var BATTLESHIP = BATTLESHIP || {};
var inAppPurchaseDone = false; //checks if any item was bought in-app
var id = 0;  //id of hosted game, should never be the same -> written into an array??


BATTLESHIP.menuController = {
    initialize: function () {
        this.bindEvents();
        this.beforeStart();
    },
    bindEvents: function () {


        //die zwei folgenden fkt. werden bei mir nicht aufgerufen... veraltert? 
        $(document).on("pagebeforeshow", "#main-menu", this.onPageBeforeShow); // Before entering main-menu
        $(document).on("pageshow", "#main-menu", this.onPageShow); // When entering main-menu

        //add all listner function bindings for main menu button

        $('#singleBtn').click(this.step1_single);
        $('#networkBtn').click(this.step1_network);

        $('.hostButton').click(this.step2_host);
        $('.joinButton').click(this.step2_join);

        $('.easyBtn').click(this.step2_easy);
        $('.mediumBtn').click(this.step2_med);
        $('.hardBtn').click(this.step2_hard);

        $('input').blur(this.step3_input);

        $('.stdBtn').click(this.step3_std);
        $('.bigShipsBtn').click(this.step3_bigShips);
        $('.gfyBtn').click(this.step3_gfy);
        $('.osoBtn').click(this.step3_oso);

        $('.stdFieldBtn').click(this.step4_stdField);
        $('.easyFieldBtn').click(this.step4_easyField);
        $('.evilFieldBtn').click(this.step4_evilField);

        $('.playButtonMain').click(this.playbuttonClicked);
        //$('#googleLogin').click(this.loginOutAchievements);
        $('#achievements').click(this.achievements);
        $('#inApp').click(this.inApp);
        $('.X').click(this.closeOverlay);


    },
    onPageBeforeShow: function () {
        console.log('main-menu pagebeforeshow');
        BATTLESHIP.gameManager = new BATTLESHIP.GameManager(); //create new game on loading menu page
        //sets mainmenu back to default
        $('.brownButton').removeClass('brownButton');
        $('.ui-block-b > .mainButton').addClass('greyButton').removeClass('blueButton');
        $('.ui-block-c > .mainButton').removeClass('blueButton').addClass('greyButton');
        $('.ui-block-d > .mainButton').removeClass('blueButton').addClass('greyButton');

        $('.greyButtonBuy').removeClass('greyButton');
        $('.host').addClass('hide');
        $('.join').addClass('hide');
        $('.network').addClass('hide');
        $('.single').removeClass('hide');
        //$('.single').addClass('hide');

        $('.ui-block-b > .headlineMain').addClass('greyFont');
        $('.ui-block-c > .headlineMain').addClass('greyFont');
        $('.ui-block-d > .headlineMain').addClass('greyFont');

        $('.playButtonMain').addClass('playButtonMainGrey');


        //edits buttons of the menu if in app purchases have been done
        if (BATTLESHIP.InAppPurchase.BIGSHIPS === true) {
            inAppPurchaseDone = true; //if minimum one item is bought, set this to true
            $('.bigShipsBtn').removeClass('greyButtonBuy');
            $('.bigShipsBtn').addClass('greyButton');
            $('.bigShipsBtn').removeClass('blueButton');
        }
        if (BATTLESHIP.InAppPurchase.GFY === true) {
            inAppPurchaseDone = true;
            $('.gfyBtn').removeClass('greyButtonBuy');
            $('.gfyBtn').addClass('greyButton');
            $('.gfyBtn').removeClass('blueButton');
        }
        if (BATTLESHIP.InAppPurchase.OSO === true) {
            inAppPurchaseDone = true;
            $('.osoBtn').removeClass('greyButtonBuy');
            $('.osoBtn').addClass('greyButton');
            $('.osoBtn').removeClass('blueButton');
        }
        if (BATTLESHIP.InAppPurchase.EASYFIELD === true) {
            inAppPurchaseDone = true;
            $('.easyFieldBtn').removeClass('greyButtonBuy');
            $('.easyFieldBtn').addClass('greyButton');
            $('.easyFieldBtn').removeClass('blueButton');
        }
        if (BATTLESHIP.InAppPurchase.EVILFIELD === true) {
            inAppPurchaseDone = true;
            $('.evilFieldBtn').removeClass('greyButtonBuy');
            $('.evilFieldBtn').addClass('greyButton');
            $('.evilFieldBtn').removeClass('blueButton');
        }

    },

    beforeStart: function () {
        BATTLESHIP.gameManager = new BATTLESHIP.GameManager(); //create new game on loading menu page



        //TODO: show google login for authentification

        //sets mainmenu back to default
        $('.brownButton').removeClass('brownButton');
        $('.playButtonMain').addClass('playButtonMainGrey');

        if (!$('.ui-block-b > .mainButton').hasClass('greyButtonBuy')) {
            $('.ui-block-b > .mainButton').addClass('greyButton');
        }

        if (!$('.ui-block-c > .mainButton').hasClass('greyButtonBuy')) {
            $('.ui-block-c > .mainButton').removeClass('blueButton');
            $('.ui-block-c > .mainButton').addClass('greyButton');
        }

        if (!$('.ui-block-d > .mainButton').hasClass('greyButtonBuy')) {
            $('.ui-block-d > .mainButton').removeClass('blueButton');
            $('.ui-block-d > .mainButton').addClass('greyButton');
        }

        //edits buttons of the menu if in app purchases have been done
        if (BATTLESHIP.InAppPurchase.BIGSHIPS === true) {
            inAppPurchaseDone = true; //if minimum one item is bought, set this to true
            console.log(inAppPurchaseDone);
            $('.bigShipsBtn').removeClass('greyButtonBuy');
            $('.bigShipsBtn').addClass('greyButton');
            $('.bigShipsBtn').removeClass('blueButton');
        }
        if (BATTLESHIP.InAppPurchase.GFY === true) {
            inAppPurchaseDone = true;
            $('.gfyBtn').removeClass('greyButtonBuy');
            $('.gfyBtn').addClass('greyButton');
            $('.gfyBtn').removeClass('blueButton');
        }
        if (BATTLESHIP.InAppPurchase.OSO === true) {
            inAppPurchaseDone = true;
            $('.osoBtn').removeClass('greyButtonBuy');
            $('.osoBtn').addClass('greyButton');
            $('.osoBtn').removeClass('blueButton');
        }
        if (BATTLESHIP.InAppPurchase.EASYFIELD === true) {
            inAppPurchaseDone = true;
            $('.easyFieldBtn').removeClass('greyButtonBuy');
            $('.easyFieldBtn').addClass('greyButton');
            $('.easyFieldBtn').removeClass('blueButton');
        }
        if (BATTLESHIP.InAppPurchase.EVILFIELD === true) {
            inAppPurchaseDone = true;
            $('.evilFieldBtn').removeClass('greyButtonBuy');
            $('.evilFieldBtn').addClass('greyButton');
            $('.evilFieldBtn').removeClass('blueButton');
        }

    },

    step1_single: function () {
        $('#singleBtn').addClass('brownButton');
        $('#networkBtn').removeClass('brownButton');

        $('.ui-block-b > .headlineMain').removeClass('greyFont');
        $('.ui-block-b > .mainButton').removeClass('greyButton');
        $('.ui-block-b > .mainButton').addClass('blueButton');

        //sets buttons back to default:
        $('.ui-block-c > .headlineMain').addClass('greyFont');
        $('.ui-block-c > .mainButton').addClass('greyButton');
        $('.ui-block-c > .mainButton').removeClass('blueButton');

        $('.ui-block-d > .headlineMain').addClass('greyFont');
        $('.ui-block-d > .mainButton').addClass('greyButton');
        $('.ui-block-d > .mainButton').removeClass('blueButton');

        $('.greyButtonBuy').removeClass('greyButton');

        $('.single').removeClass('hide');
        $('.network').addClass('hide');

        $('.playButtonMain').empty();
        $('.playButtonMain').html('Play');

        $('.single > .mainButton').removeClass('brownButton');

        //checks the enabling of the play button
        if ($('.single > .mainButton').hasClass('brownButton')) {
            $('.playButtonMain').removeClass('playButtonMainGrey');
        } else {
            $('.playButtonMain').addClass('playButtonMainGrey');
        }


    },
    step1_network: function () {
        $('#networkBtn').addClass('brownButton');
        $('#singleBtn').removeClass('brownButton');

        $('.network').removeClass('hide');
        $('.single').addClass('hide');
        $('.ui-block-c.network').addClass('hide');
        $('.ui-block-d.network').addClass('hide');

        $('.ui-block-b.network > .mainButton').removeClass('greyButton').addClass('blueButton');


        $('.network > .headlineMain').addClass('greyFont');
        $('.ui-block-b > .headlineMain').removeClass('greyFont');

        $('.network > .mainButton').removeClass('brownButton');

        //checks the enabling of the play button
        if ($('.network > .mainButton').hasClass('brownButton')) {
            $('.playButtonMain').removeClass('playButtonMainGrey');
        } else {
            $('.playButtonMain').addClass('playButtonMainGrey');
        }


    },

    step2_host: function () {
        $('.ui-block-c.network').removeClass('hide');
        $('.ui-block-c.network > .headlineMain').removeClass('greyFont');

        $('.ui-block-d.network').removeClass('hide');
        $('.ui-block-d.network > .headlineMain').removeClass('greyFont');

        $('.hostButton').addClass('brownButton');
        $('.joinButton').removeClass('brownButton');

        $('.ui-block-c.join').addClass('hide');

        $('.ui-block-c > .mainButton').addClass('blueButton');
        $('.ui-block-c > .mainButton').removeClass('greyButton');

        //back to default
        $('.ui-block-d > .mainButton').removeClass('blueButton');
        $('.ui-block-d > .mainButton').addClass('greyButton');

        $('.greyButtonBuy').removeClass('greyButton');

        $('.playButtonMain').empty();
        $('.playButtonMain').html('Create Game');

        //checks the enabling of the play button
        if ($('.host > .mainButton').hasClass('brownButton')) {
            $('.playButtonMain').removeClass('playButtonMainGrey');
        } else {
            $('.playButtonMain').addClass('playButtonMainGrey');
        }

        if (inAppPurchaseDone === false) {
            $('.stdBtn').addClass('brownButton');
            $('.stdBtn').removeClass('greyButton');
            $('.ui-block-d.network').removeClass('hide');
            $('.ui-block-d > .mainButton').removeClass('greyButton');
            $('.ui-block-d > .headlineMain').removeClass('greyFont');
            $('.ui-block-d > .mainButton').removeClass('greyButton');
            $('.ui-block-d > .mainButton').addClass('brownButton');
            //enable playButton
            $('.playButtonMain').removeClass('playButtonMainGrey');
        }


    },

    step2_join: function () {
        $('.ui-block-c.network.host').addClass('hide');
        $('.ui-block-d.network.host').addClass('hide');

        $('.hostButton').removeClass('brownButton');
        $('.joinButton').addClass('brownButton');

        $('.ui-block-c.join').removeClass('hide');
        $('.ui-block-c.join > .headlineMain').removeClass('greyFont');

        $('.playButtonMain').empty();
        $('.playButtonMain').html('Join Game');

        //TODO: checks the ID and then enable the play button
        // $('.playButtonMain').removeClass('playButtonMainGrey');


        //also for disabling the playButtonMain               
        $('.host > .mainButton').removeClass('brownButton');


    },


    step2_easy: function () {
        if (!$('.easyBtn').hasClass('greyButton')) {

            BATTLESHIP.gameManager.difficultyAI = BATTLESHIP.DifficultyAI.EASY;

            $('.easyBtn').addClass('brownButton');
            $('.mediumBtn').removeClass('brownButton');
            $('.hardBtn').removeClass('brownButton');

            $('.ui-block-c > .headlineMain').removeClass('greyFont');
            $('.ui-block-c > .mainButton').removeClass('greyButton');
            $('.ui-block-c > .mainButton').addClass('blueButton');

            if (inAppPurchaseDone === false) {
                $('.stdBtn').addClass('brownButton');
                $('.ui-block-d > .headlineMain').removeClass('greyFont');
                $('.ui-block-d > .mainButton').removeClass('greyButton');
                $('.ui-block-d > .mainButton').addClass('brownButton');

                //enable playButton
                $('.playButtonMain').removeClass('playButtonMainGrey');
            }
        }
    },
    step2_med: function () {

        if (!$('.mediumBtn').hasClass('greyButton')) {

            BATTLESHIP.gameManager.difficultyAI = BATTLESHIP.DifficultyAI.NORMAL;
            $('.mediumBtn').addClass('brownButton');
            $('.easyBtn').removeClass('brownButton');
            $('.hardBtn').removeClass('brownButton');

            //enable block c
            $('.ui-block-c > .headlineMain').removeClass('greyFont');
            $('.ui-block-c > .mainButton').removeClass('greyButton');
            $('.ui-block-c > .mainButton').addClass('blueButton');


            if (inAppPurchaseDone === false) {
                $('.stdBtn').addClass('brownButton');
                $('.ui-block-d > .headlineMain').removeClass('greyFont');
                $('.ui-block-d > .mainButton').removeClass('greyButton');
                $('.ui-block-d > .mainButton').addClass('brownButton');

//check above if nothing is bought, if not ->
                //enable playButton
                $('.playButtonMain').removeClass('playButtonMainGrey');
            }
        }
    },
    step2_hard: function () {

        if (!$('.hardBtn').hasClass('greyButton')) {

            BATTLESHIP.gameManager.difficultyAI = BATTLESHIP.DifficultyAI.HARD;

            $('.hardBtn').addClass('brownButton');
            $('.mediumBtn').removeClass('brownButton');
            $('.easyBtn').removeClass('brownButton');

            //enable block c
            $('.ui-block-c > .headlineMain').removeClass('greyFont');
            $('.ui-block-c > .mainButton').removeClass('greyButton');
            $('.ui-block-c > .mainButton').addClass('blueButton');

            if (inAppPurchaseDone === false) {
                //enable block d (if nothing is bought)
                $('.stdBtn').addClass('brownButton');
                $('.ui-block-d > .headlineMain').removeClass('greyFont');
                $('.ui-block-d > .mainButton').removeClass('greyButton');
                $('.ui-block-d > .mainButton').addClass('brownButton');

//check above if nothing is bought, if not ->
                //enable playButton
                $('.playButtonMain').removeClass('playButtonMainGrey');
            }
        }
    },

    step3_input: function () {
        $('.playButtonMain').removeClass('playButtonMainGrey');
    },


    step3_std: function () {
        if (!$('.stdBtn').hasClass('greyButton')) {

            BATTLESHIP.gameManager.fleet = BATTLESHIP.FleetType.STANDARD;

            $('.stdBtn').addClass('brownButton');

            $('.osoBtn').removeClass('brownButton');
            $('.gfyBtn').removeClass('brownButton');
            $('.bigShipsBtn').removeClass('brownButton');

            $('.ui-block-d > .headlineMain').removeClass('greyFont');
            $('.ui-block-d > .mainButton').removeClass('greyButton').addClass('blueButton');

            //make easy field not possible
            $('.easyFieldBtn').removeClass('blueButton');
            $('.easyFieldBtn').addClass('greyButton');
            $('.easyFieldBtn').removeClass('brownButton');

            if (inAppPurchaseDone === false) {
                $('.stdFieldBtn').addClass('brownButton');
                $('.playButtonMain').removeClass('playButtonMainGrey');
            }
        }
    },
    step3_bigShips: function () {
        if (BATTLESHIP.InAppPurchase.BIGSHIPS === true) {
            if (!$('.bigShipsBtn').hasClass('greyButton')) {
                BATTLESHIP.gameManager.fleet = BATTLESHIP.FleetType.BIGSHIPS;

                $('.bigShipsBtn').addClass('brownButton');

                $('.osoBtn').removeClass('brownButton');
                $('.gfyBtn').removeClass('brownButton');
                $('.stdBtn').removeClass('brownButton');

//unlock next col
                $('.ui-block-d > .headlineMain').removeClass('greyFont');
                $('.ui-block-d > .mainButton').removeClass('greyButton');
                $('.ui-block-d > .mainButton').addClass('blueButton');
                

                //make easy field not possible
                $('.easyFieldBtn').removeClass('blueButton');
                $('.easyFieldBtn').addClass('greyButton');
                $('.easyFieldBtn').removeClass('brownButton');

                //checks the enabling of the play button
                if ($('.ui-block-d > .mainButton').hasClass('brownButton')) {
                    $('.playButtonMain').removeClass('playButtonMainGrey');
                } else {
                    $('.playButtonMain').addClass('playButtonMainGrey');
                }
            }
        } else {
            $('#buyButtonOverlay').show();
            $('#buyButtonOverlay > section').hide();
            $('#bigShipInfo ').show();

            $('#buyButtonOverlay').on("vmouseout", function () {
                $('#buyButtonOverlay').hide();
            });
        }
    },
    step3_gfy: function () {
        if (BATTLESHIP.InAppPurchase.GFY === true) {
            if (!$('.gfyBtn').hasClass('greyButton')) {
            BATTLESHIP.gameManager.fleet = BATTLESHIP.FleetType.SMALLSHIPS;

                $('.gfyBtn').addClass('brownButton');

                $('.bigShipsBtn').removeClass('brownButton');
                $('.osoBtn').removeClass('brownButton');
                $('.stdBtn').removeClass('brownButton');

//unlock next col
                $('.ui-block-d > .headlineMain').removeClass('greyFont');
                $('.ui-block-d > .mainButton').removeClass('greyButton');
                $('.ui-block-d > .mainButton').addClass('blueButton');

                //make easy field not possible
                $('.easyFieldBtn').removeClass('blueButton');
                $('.easyFieldBtn').addClass('greyButton');
                $('.easyFieldBtn').removeClass('brownButton');
               
                //checks the enabling of the play button
                if ($('.ui-block-d > .mainButton').hasClass('brownButton')) {
                    $('.playButtonMain').removeClass('playButtonMainGrey');
                } else {
                    $('.playButtonMain').addClass('playButtonMainGrey');
                }

            }
        } else {

            $('#buyButtonOverlay').show();
            $('#buyButtonOverlay > section').hide();
            $('#gfyInfo ').show();

            $('#buyButtonOverlay').on("vmouseout", function () {
                $('#buyButtonOverlay').hide();
            });
        }
    },
    step3_oso: function () {
        if (BATTLESHIP.InAppPurchase.OSO === true) {
            if (!$('.osoBtn').hasClass('greyButton')) {
                BATTLESHIP.gameManager.fleet = BATTLESHIP.FleetType.ONESHIP;

                $('.osoBtn').addClass('brownButton');

                $('.bigShipsBtn').removeClass('brownButton');
                $('.gfyBtn').removeClass('brownButton');
                $('.stdBtn').removeClass('brownButton');

//unlock next col
                $('.ui-block-d > .headlineMain').removeClass('greyFont');
                $('.ui-block-d > .mainButton').removeClass('greyButton');
                $('.ui-block-d > .mainButton').addClass('blueButton');
            }
        } else {

            $('#buyButtonOverlay').show();
            $('#buyButtonOverlay > section').hide();
            $('#osoInfo').show();

            $('#buyButtonOverlay').on("vmouseout", function () {
                $('#buyButtonOverlay').hide();
            });

        }
    },
    step4_stdField: function () {
        if (!$('.stdFieldBtn').hasClass('greyButton')) {

            BATTLESHIP.gameManager.battlefieldSize = BATTLESHIP.BattlefieldType.STANDARD;

            $('.stdFieldBtn').addClass('brownButton');

            $('.easyFieldBtn').removeClass('brownButton');
            $('.evilFieldBtn').removeClass('brownButton');

            $('.playButtonMain').removeClass('playButtonMainGrey');
        }
    },
    step4_easyField: function () {
        if (BATTLESHIP.InAppPurchase.EASYFIELD === true) {
            if (!$('.easyFieldBtn').hasClass('greyButton')) {

                BATTLESHIP.gameManager.battlefieldSize = BATTLESHIP.BattlefieldType.EASY;
                $('.easyFieldBtn').addClass('brownButton');

                $('.stdFieldBtn').removeClass('brownButton');
                $('.evilFieldBtn').removeClass('brownButton');

                $('.playButtonMain').removeClass('playButtonMainGrey');
            }
        } else {
            $('#buyButtonOverlay').show();
            $('#buyButtonOverlay > section').hide();
            $('#easyFieldInfo ').show();

            $('#buyButtonOverlay').on("vmouseout", function () {
                $('#buyButtonOverlay').hide();
            });

        }
    },
    step4_evilField: function () {
        if (BATTLESHIP.InAppPurchase.EVILFIELD === true) {
            if (!$('.evilFieldBtn').hasClass('greyButton')) {
                BATTLESHIP.gameManager.battlefieldSize = BATTLESHIP.BattlefieldType.HARD;
                $('.evilFieldBtn').addClass('brownButton');

                $('.stdFieldBtn').removeClass('brownButton');
                $('.easyFieldBtn').removeClass('brownButton');

                $('.playButtonMain').removeClass('playButtonMainGrey');
            }
        } else {

            $('#buyButtonOverlay').show();
            $('#buyButtonOverlay > section').hide();
            $('#evilFieldInfo ').show();

            $("#buyButtonOverlay").on("vmouseout", function () {
                $('#buyButtonOverlay').hide();
            });
        }
    },

    playbuttonClicked: function () {
        //check if all modes are selected
        //if playbutton is unlocked, go to placeShips
        if (!$('.playButtonMain').hasClass('playButtonMainGrey')) {
            if ($('.host').hasClass('hide') && $('.join').hasClass('hide')) {
                // SP game
                BATTLESHIP.gameManager.startGame();
                location.href = "#placeships";

            } else if (!$('.host').hasClass('hide')) {
                // Network host
                BATTLESHIP.network.hostGame(BATTLESHIP.gameManager.gameHostedCallback, BATTLESHIP.gameManager.gameStartCallback, BATTLESHIP.gameManager.otherPlayerRequestsConfigCallback, BATTLESHIP.gameManager.otherPlayerPlaceShipsFinishedCallback, BATTLESHIP.gameManager.otherPlayerFieldSelectedCallback, BATTLESHIP.gameManager.otherPlayerFiredCallback, BATTLESHIP.gameManager.otherPlayerFireResultReceivedCallback, BATTLESHIP.gameManager.otherPlayerGameEndedCallback, BATTLESHIP.gameManager.errorCallback);
            } else if (!$('.join').hasClass('hide')) {
                // Network join
                var gameId = $('input').val();
                BATTLESHIP.network.joinGame(gameId, BATTLESHIP.gameManager.gameConfigReceivedCallback, BATTLESHIP.gameManager.gameStartCallback, BATTLESHIP.gameManager.otherPlayerPlaceShipsFinishedCallback, BATTLESHIP.gameManager.otherPlayerFieldSelectedCallback, BATTLESHIP.gameManager.otherPlayerFiredCallback, BATTLESHIP.gameManager.otherPlayerFireResultReceivedCallback, BATTLESHIP.gameManager.otherPlayerGameEndedCallback, BATTLESHIP.gameManager.errorCallback);
            }
        } else {
            //show and hide overlay
            $('#playButtonOverlay').show();
            $('#playButtonOverlay').delay(3000).hide(0);

            $('#playButtonOverlay').on("vmouseout", function () {
                $('#playButtonOverlay').hide();
            });

        }

    },
    inApp: function () {

        $('#inAppOverlay').show();
        $('#inAppOverlay').on("vmouseout", function () {
            $('#inAppOverlay').hide();
        });
    },
    achievements: function () {

        console.log('achievement');

        location.href = "#achievementPage";

    },

    closeOverlay: function () {
        $('.overlay').hide();
    }
};