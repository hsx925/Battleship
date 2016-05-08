var BATTLESHIP = BATTLESHIP || {};
var inAppPurchaseDone = false; //checks if any item was bought in-app

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

        $('#easyBtn').click(this.step2_easy);
        $('#mediumBtn').click(this.step2_med);
        $('#hardBtn').click(this.step2_hard);

        $('#stdBtn').click(this.step3_std);
        $('#bigShipsBtn').click(this.step3_bigShips);
        $('#gfyBtn').click(this.step3_gfy);
        $('#osoBtn').click(this.step3_oso);

        $('#stdFieldBtn').click(this.step4_stdField);
        $('#easyFieldBtn').click(this.step4_easyField);
        $('#evilFieldBtn').click(this.step4_evilField);

        $('.playButtonMain').click(this.playbuttonClicked);
        $('#achievements').click(this.achievements);
        $('#inApp').click(this.inApp);
        $('.X').click(this.closeOverlay);

    },
    onPageBeforeShow: function () {
        console.log('main-menu pagebeforeshow');
        BATTLESHIP.gameManager = new BATTLESHIP.GameManager(); //create new game on loading menu page

    },
    onPageShow: function () {
        console.log('main-menu pageshow');

    },
    //add listener functions for all buttons on main menu

    beforeStart: function () {

        //edits buttons of the menu if in app purchases have been done
        if (BATTLESHIP.InAppPurchase.BIGSHIPS === true) {
            inAppPurchaseDone = true; //if minimum one item is bought, set this to true
            console.log(inAppPurchaseDone);
            $('#bigShipsBtn').removeClass('greyButtonBuy');
            $('#bigShipsBtn').addClass('greyButton');
        }
        if (BATTLESHIP.InAppPurchase.GFY === true) {
            inAppPurchaseDone = true;
            $('#gfyBtn').removeClass('greyButtonBuy');
            $('#gfyBtn').addClass('greyButton');
        }
        if (BATTLESHIP.InAppPurchase.OSO === true) {
            inAppPurchaseDone = true;
            $('#osoBtn').removeClass('greyButtonBuy');
            $('#osoBtn').addClass('greyButton');
        }
        if (BATTLESHIP.InAppPurchase.EASYFIELD === true) {
            inAppPurchaseDone = true;
            $('#easyFieldBtn').removeClass('greyButtonBuy');
            $('#easyFieldBtn').addClass('greyButton');
        }
        if (BATTLESHIP.InAppPurchase.EVILFIELD === true) {
            inAppPurchaseDone = true;
            $('#evilFieldBtn').removeClass('greyButtonBuy');
            $('#evilFieldBtn').addClass('greyButton');
        }

    },
    step1_single: function () {
        $('#singleBtn').addClass('brownButton');
        $('#networkBtn').removeClass('brownButton');
        $('.ui-block-b > .headlineMain').removeClass('greyFont');
        $('.ui-block-b > .mainButton').removeClass('greyButton');
        $('.ui-block-b > .mainButton').addClass('blueButton');

        $('.ui-block-b').removeClass('hide');
        $('.ui-block-c').removeClass('hide');
        $('.ui-block-d').removeClass('hide');


    },
    step1_network: function () {
        $('#networkBtn').addClass('brownButton');
        $('#singleBtn').removeClass('brownButton');

        $('.ui-grid-c > .ui-block-b').addClass('hide');
        $('.ui-grid-c > .ui-block-c').addClass('hide');
        $('.ui-grid-c > .ui-block-d').addClass('hide');

        $('.ui-block-b > .headlineMain').addClass('greyFont');
        $('.ui-block-b > .mainButton').addClass('greyButton');
        $('.ui-block-b > .mainButton').removeClass('blueButton');

        //disable playButton
        $('.playButtonMain').addClass('playButtonMainGrey');

    },
    step2_easy: function () {
        if (!$('#easyBtn').hasClass('greyButton')) {

            BATTLESHIP.DifficultyAI = "easy";

            $('#easyBtn').addClass('brownButton');
            $('#mediumBtn').removeClass('brownButton');
            $('#hardBtn').removeClass('brownButton');

            $('.ui-block-c > .headlineMain').removeClass('greyFont');
            $('.ui-block-c > .mainButton').removeClass('greyButton');
            $('.ui-block-c > .mainButton').addClass('blueButton');

            if (inAppPurchaseDone === false) {
                console.log('here');
                $('#stdBtn').addClass('brownButton');
                $('.ui-block-d > .headlineMain').removeClass('greyFont');
                $('.ui-block-d > .mainButton').removeClass('greyButton');
                $('.ui-block-d > .mainButton').addClass('brownButton');

                //enable playButton
                $('.playButtonMain').removeClass('playButtonMainGrey');
            }
        }
    },
    step2_med: function () {

        if (!$('#mediumBtn').hasClass('greyButton')) {

            BATTLESHIP.DifficultyAI = "normal";
            $('#mediumBtn').addClass('brownButton');
            $('#easyBtn').removeClass('brownButton');
            $('#hardBtn').removeClass('brownButton');

            //enable block c
            $('.ui-block-c > .headlineMain').removeClass('greyFont');
            $('.ui-block-c > .mainButton').removeClass('greyButton');
            $('.ui-block-c > .mainButton').addClass('blueButton');



            if (inAppPurchaseDone === false) {
                $('#stdBtn').addClass('brownButton');
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

        if (!$('#hardBtn').hasClass('greyButton')) {

            BATTLESHIP.DifficultyAI = "hard";

            $('#hardBtn').addClass('brownButton');
            $('#mediumBtn').removeClass('brownButton');
            $('#easyBtn').removeClass('brownButton');

            //enable block c
            $('.ui-block-c > .headlineMain').removeClass('greyFont');
            $('.ui-block-c > .mainButton').removeClass('greyButton');
            $('.ui-block-c > .mainButton').addClass('blueButton');

            if (inAppPurchaseDone === false) {
                //enable block d (if nothing is bought)
                $('#stdBtn').addClass('brownButton');
                $('.ui-block-d > .headlineMain').removeClass('greyFont');
                $('.ui-block-d > .mainButton').removeClass('greyButton');
                $('.ui-block-d > .mainButton').addClass('brownButton');

//check above if nothing is bought, if not ->
                //enable playButton
                $('.playButtonMain').removeClass('playButtonMainGrey');
            }
        }
    },
    step3_std: function () {
        if (!$('#stdBtn').hasClass('greyButton')) {

            BATTLESHIP.FleetType = "standard";

            $('#stdBtn').addClass('brownButton');

            $('#osoBtn').removeClass('brownButton');
            $('#gfyBtn').removeClass('brownButton');
            $('#bigShipsBtn').removeClass('brownButton');

            $('.ui-block-d > .headlineMain').removeClass('greyFont');
            $('.ui-block-d > .mainButton').removeClass('greyButton');
            $('.ui-block-d > .mainButton').addClass('blueButton');

            if (BATTLESHIP.InAppPurchase.MINONEBOUGHT === false) {
                $('.playButtonMain').removeClass('playButtonMainGrey');
            }
        }
    },
    step3_bigShips: function () {
        if (BATTLESHIP.InAppPurchase.BIGSHIPS === true) {
            if (!$('#bigShipsBtn').hasClass('greyButton')) {
                BATTLESHIP.FleetType = "bigships";

                $('#bigShipsBtn').addClass('brownButton');

                $('#osoBtn').removeClass('brownButton');
                $('#gfyBtn').removeClass('brownButton');
                $('#stdBtn').removeClass('brownButton');

//unlock next col
                $('.ui-block-d > .headlineMain').removeClass('greyFont');
                $('.ui-block-d > .mainButton').removeClass('greyButton');
                $('.ui-block-d > .mainButton').addClass('blueButton');
            }
        } else {
            $('#buyButtonOverlay').show();
            $('#buyButtonOverlay > section').hide();
            $('#bigShipInfo ').show();

            $('#buyButtonOverlay').on("mouseout", function () {
                $('#buyButtonOverlay').hide();
            });
        }
    },
    step3_gfy: function () {
        if (BATTLESHIP.InAppPurchase.GFY === true) {
            if (!$('#gfyBtn').hasClass('greyButton')) {
                BATTLESHIP.FleetType = "goodforyou";

                $('#gfyBtn').addClass('brownButton');

                $('#bigShipsBtn').removeClass('brownButton');
                $('#osoBtn').removeClass('brownButton');
                $('#stdBtn').removeClass('brownButton');

//unlock next col
                $('.ui-block-d > .headlineMain').removeClass('greyFont');
                $('.ui-block-d > .mainButton').removeClass('greyButton');
                $('.ui-block-d > .mainButton').addClass('blueButton');
            }
        } else {

            $('#buyButtonOverlay').show();
            $('#buyButtonOverlay > section').hide();
            $('#gfyInfo ').show();

            $('#buyButtonOverlay').on("mouseout", function () {
                $('#buyButtonOverlay').hide();
            });
        }
    },
    step3_oso: function () {
        if (BATTLESHIP.InAppPurchase.OSO === true) {
            if (!$('#osoBtn').hasClass('greyButton')) {
                BATTLESHIP.FleetType = "goodforyou";

                $('#osoBtn').addClass('brownButton');

                $('#bigShipsBtn').removeClass('brownButton');
                $('#gfyBtn').removeClass('brownButton');
                $('#stdBtn').removeClass('brownButton');

//unlock next col
                $('.ui-block-d > .headlineMain').removeClass('greyFont');
                $('.ui-block-d > .mainButton').removeClass('greyButton');
                $('.ui-block-d > .mainButton').addClass('blueButton');
            }
        } else {

            $('#buyButtonOverlay').show();
            $('#buyButtonOverlay > section').hide();
            $('#osoInfo').show();

            $('#buyButtonOverlay').on("mouseout", function () {
                $('#buyButtonOverlay').hide();
            });

        }
    },
    step4_stdField: function () {
        if (!$('#stdFieldBtn').hasClass('greyButton')) {

            BATTLESHIP.BattlefieldType = 10;

            $('#stdFieldBtn').addClass('brownButton');

            $('#easyFieldBtn').removeClass('brownButton');
            $('#evilFieldBtn').removeClass('brownButton');

            $('.playButtonMain').removeClass('playButtonMainGrey');
        }
    },
    step4_easyField: function () {
        if (BATTLESHIP.InAppPurchase.EASYFIELD === true) {
            if (!$('#easyFieldBtn').hasClass('greyButton')) {

                BATTLESHIP.BattlefieldType = 5;
                $('#easyFieldBtn').addClass('brownButton');

                $('#stdFieldBtn').removeClass('brownButton');
                $('#evilFieldBtn').removeClass('brownButton');

                $('.playButtonMain').removeClass('playButtonMainGrey');
            }
        } else {
            $('#buyButtonOverlay').show();
            $('#buyButtonOverlay > section').hide();
            $('#easyFieldInfo ').show();

            $('#buyButtonOverlay').on("mouseout", function () {
                $('#buyButtonOverlay').hide();
            });

        }
    },
    step4_evilField: function () {
        if (BATTLESHIP.InAppPurchase.EVILFIELD === true) {
            if (!$('#evilFieldBtn').hasClass('greyButton')) {
                BATTLESHIP.BattlefieldType = 20;
                $('#evilFieldBtn').addClass('brownButton');

                $('#stdFieldBtn').removeClass('brownButton');
                $('#easyFieldBtn').removeClass('brownButton');

                $('.playButtonMain').removeClass('playButtonMainGrey');
            }
        } else {

            $('#buyButtonOverlay').show();
            $('#buyButtonOverlay > section').hide();
            $('#evilFieldInfo ').show();

            $('#buyButtonOverlay').on("mouseout", function () {
                $('#buyButtonOverlay').hide();
            });
        }
    },
    playbuttonClicked: function () {
        //check if all modes are selected
        //if playbutton is unlocked, go to placeShips
        if (!$('.playButtonMain').hasClass('playButtonMainGrey')) {
            location.href = "#placeships";

        } else {
            //show and hide overlay
            $('#playButtonOverlay').show();
            $('#playButtonOverlay').delay(2000).hide(0);

            $('#playButtonOverlay').on("mouseout", function () {
                $('#playButtonOverlay').hide();
            });

        }

    },
    inApp: function () {

        $('#inAppOverlay').show();
        $('#inAppOverlay').on("mouseout", function () {
            $('#inAppOverlay').hide();
        });
    },
    achievements: function () {

        $('#achievementOverlay').show();
        $('#achievementOverlay').on("mouseout", function () {
            $('#achievementOverlay').hide();
        });

    },
    closeOverlay: function () {
        $('.overlay').hide();
    }

};