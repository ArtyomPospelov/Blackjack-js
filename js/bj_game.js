//BLACKJACK GAME LOGIC (powered by bj_shared.js code):

//GLOBALS:
var cardDeck;
var playerScore, dealerScore;

//SUBS FOR MAIN GAME LOGIC:
//Take a card from the deck into the player's or dealer's pool.
//The function makes sure to process the end of the game when the deck is emptied:
function takeCardFromDeck(toPlayerPool) {
    if (cardDeck.length == 0) {
        gameOver();
        return false;
    }
    
    var card = cardDeck.pop();
    setCardCountDisplay(cardDeck.length);
    addCardToCardPool(toPlayerPool, card);
    setVisibilityPoolPowerHint(toPlayerPool, true);
    setCardPoolPowerDisplay(toPlayerPool, getCardPoolPower(toPlayerPool));
    return true;
}

//Checking the pools of each side for a win or loss. 
//In fact, the rules for the strength and combination of cards in blackjack are prescribed here:
function checkCardPool(roundEnding = false) {
    var playerPower = getCardPoolPower(true);
    var dealerPower = getCardPoolPower(false);

    var ruleFound = false;

    if (playerPower > 21) {
        onRoundOver(ROUND_OVER_PLAYER_LOSE, POOL_STATE_BUST);
        ruleFound = true;
    } else if (dealerPower > 21) {
        onRoundOver(ROUND_OVER_PLAYER_WIN, POOL_STATE_BUST);
        ruleFound = true;
    } else if (playerPower == 21 && dealerPower == 21) {
        onRoundOver(ROUND_OVER_DRAW, POOL_STATE_DRAW);
        ruleFound = true;
    } else if (playerPower == 21) {
        onRoundOver(ROUND_OVER_PLAYER_WIN, POOL_STATE_BLACKJACK);
        ruleFound = true;
    } else if (dealerPower == 21) {
        onRoundOver(ROUND_OVER_PLAYER_LOSE, POOL_STATE_BLACKJACK);
        ruleFound = true;
    }
        
    if (roundEnding && !ruleFound) {
        if (playerPower == dealerPower)
            onRoundOver(ROUND_OVER_DRAW, POOL_STATE_DRAW);
        else if (playerPower > dealerPower)
            onRoundOver(ROUND_OVER_PLAYER_WIN, POOL_STATE_ADVAN)
        else
            onRoundOver(ROUND_OVER_PLAYER_LOSE, POOL_STATE_ADVAN);
    }
}

//The handler of actions at the beginning of the round, when the dealer deals cards to the player and himself:
function onGameTimeFetch() {
    if (cardDeck.length < 4) {
        gameOver();
        return;
    }

    setEnabledPlayerControls(false);
    clearCardPool(true);
    clearCardPool(false);
    setVisibilityPoolPowerHint(false, false);
    setVisibilityPoolPowerHint(true, false);
    setCardPoolPowerDisplay(false, 0);
    setCardPoolPowerDisplay(true, 0);

    var cardDirs = [true, false, true, false];
    (function placeCard() {
        setTimeout(() => {
            takeCardFromDeck(cardDirs.pop());
            if (cardDirs.length)
                placeCard();
            else {
                if (!cardDeck.length) {
                    gameOver();
                    return;
                }
            
                setEnabledPlayerControls(true);
                checkCardPool();
            }
        }, 500);
    })();
}

//The handler of the final stage of the game when the dealer gets his cards. 
//In this function, you can adjust the rules for stopping the dealer from taking cards when a certain pool strength is reached.
function onDealerTime() {
    (function placeCard() {
        setTimeout(() => {
            if (getCardPoolPower(false) < 17) {
                takeCardFromDeck(false);
                placeCard();
            } else {
                checkCardPool(true);
            }
        }, 500);
    })();
}

//The handler for completing the round. There is always a reason for completion (someone won/ drew). 
//The score of the parties is also updated here.
function onRoundOver(roundOverReason, poolState) {

    const scoreIndicatorDuration = 1500;
    const poolPowerIndicatorDuration = 1500;
    const dlgAwaitDuration = 2000;

    setEnabledPlayerControls(false);
    var dlgTitle, message;
    if (roundOverReason == ROUND_OVER_PLAYER_LOSE) {
        dlgTitle = "Round over: Player lose";
        message = "You have lost a round to the dealer. Don't worry, you'll be lucky in the next round.";
        setScoreDisplay(false, ++dealerScore);
        setIndicateScoreDisplay(false, true);
        setTimeout(() => {
            setIndicateScoreDisplay(false, false);
        }, scoreIndicatorDuration);

        setIndicatePoolPowerHint((poolState == POOL_STATE_ADVAN || poolState == POOL_STATE_BLACKJACK) ? false : true, poolState);
        setTimeout(() => {
            unsetIndicatePoolPowerHint((poolState == POOL_STATE_ADVAN || poolState == POOL_STATE_BLACKJACK) ? false : true);
        }, poolPowerIndicatorDuration);
    }
    else if (roundOverReason == ROUND_OVER_PLAYER_WIN) {
        dlgTitle = "Round over: Player win!";
        message = "You beat the dealer in this round, keep it up!";
        setScoreDisplay(true, ++playerScore);
        setIndicateScoreDisplay(true, true);
        setTimeout(() => {
            setIndicateScoreDisplay(true, false);
        }, scoreIndicatorDuration);

        setIndicatePoolPowerHint((poolState == POOL_STATE_ADVAN || poolState == POOL_STATE_BLACKJACK) ? true : false, poolState);
        setTimeout(() => {
            unsetIndicatePoolPowerHint((poolState == POOL_STATE_ADVAN || poolState == POOL_STATE_BLACKJACK) ? true : false);
        }, poolPowerIndicatorDuration);
    }
    else if (roundOverReason == ROUND_OVER_DRAW) {
        dlgTitle = "Round over: Draw!";
        message = "It's a draw! And it happens too.";

        setIndicatePoolPowerHint(true, poolState);
        setIndicatePoolPowerHint(false, poolState);
        setTimeout(() => {
            unsetIndicatePoolPowerHint(true);
            unsetIndicatePoolPowerHint(false);
        }, poolPowerIndicatorDuration);
    }

    setTimeout(() => {
        showMsgDlg(dlgTitle, message, "Continue", () => {
            closeMsgDlg();
            onGameTimeFetch();
        }, null, null);
    }, dlgAwaitDuration);
}

function onHitButtonClick() {
    takeCardFromDeck(true);
    checkCardPool();
}

function onStandButtonClick() {
    onDealerTime();
    setEnabledPlayerControls(false);
}

function gameOver() {
    setIndicateCardsDisplay(true);

    const isPlayerWinner = playerScore > dealerScore;
    const isTotalDraw = playerScore == dealerScore;
    showMsgDlg(`Game over with ${isTotalDraw ? "draw" : isPlayerWinner ? "player's victory" : "dealer's victory"}`, 
        `Score is: Player: ${playerScore}; Dealer: ${dealerScore}. If you want to start a new game, click the start button`,
    "Start new game", () => {
        closeMsgDlg();
        startNewGame();
    })
}

//NEW GAME INITER:
function startNewGame() {
    cardDeck = createCardDeck(54);
    playerScore = dealerScore = 0;

    setIndicateCardsDisplay(false);
    setEnabledPlayerControls(false);
    setVisibilityPoolPowerHint(true, false);
    setVisibilityPoolPowerHint(false, false);
    clearCardPool(true);
    clearCardPool(false);
    setCardCountDisplay(cardDeck.length);
    setScoreDisplay(true, playerScore);
    setScoreDisplay(false, dealerScore);
    setCardPoolPowerDisplay(true, getCardPoolPower(true));
    setCardPoolPowerDisplay(false, getCardPoolPower(false));

    onGameTimeFetch();
}

//FIRST INIT:
ELEM_BUTTON_HIT.onclick = onHitButtonClick;
ELEM_BUTTON_STAND.onclick = onStandButtonClick;
setEnabledPlayerControls(false);
setVisibilityPoolPowerHint(true, false);
setVisibilityPoolPowerHint(false, false);
setScoreDisplay(true, 0);
setScoreDisplay(false, 0);
setCardCountDisplay(0);
clearCardPool(true);
clearCardPool(false);

//The initial greeting dialog is shown here. Which briefly describes the rules of the game.
showMsgDlg("Blackjack", "The rules of the game: The goal of the game is to beat the dealer. The value of the points of each card: \
    1) From 2 to 10 = from 2 to 10 points accordingly; 2) Ace = 11 points; 3) King, queen, jack = 10 points. \
    To win a round, you need to score as close to 21 as possible (taking risks or being careful). \
    As a result, whoever has more points wins (but no more than 21). \
    If both sides score the same number of points in the end, it is a draw. \
    If either side scores 21 points at once, then that side wins immediately. \
    If any side scores more than 21 points, it immediately loses. \
    If the deck runs out of cards, then the game is considered completed. The round points are being counted. \
    Whichever side has the advantage, that side wins the game. Notes for the current implementation of the game: \
    1) There are no bids. The winning measure is the points of the round; \
    2) The deck of cards may contain duplicate cards, may have different sizes (configurable in the code); \
    3) The cards of each side are always visible; \
    4) The dealer's point limit is set at 17 points.", "Start new game", () => {
    closeMsgDlg();
    startNewGame();
}, null, null);