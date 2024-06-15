//ACTIVE GAME HTML ELEMENTS:
const ELEM_TABLE = document.getElementById("table");
const ELEM_MSG_BOX = document.getElementById("msgBox");
const ELEM_MSG_ACCEPT_BTN = document.getElementById("msgBoxAcceptBtn");
const ELEM_MSG_REJECT_BTN = document.getElementById("msgBoxRejectBtn");
const ELEM_DEALER_INFO = document.getElementById("dealerInfo");
const ELEM_DEALER_SCORE = document.getElementById("dealerScore");
const ELEM_CARDS_COUNT = document.getElementById("cardsCount");
const ELEM_DEALER_POOL = document.getElementById("dealerPool");
const ELEM_DEALER_POOL_POWER = document.getElementById("dealerPoolPower");
const ELEM_DEALER_CARDS = document.getElementById("dealerCards");
const ELEM_PLAYER_POOL = document.getElementById("playerPool");
const ELEM_PLAYER_POOL_POWER = document.getElementById("playerPoolPower");
const ELEM_PLAYER_CARDS = document.getElementById("playerCards");
const ELEM_PULT = document.getElementById("pult");
const ELEM_PLAYER_SCORE = document.getElementById("playerScore");
const ELEM_BUTTON_HIT = document.getElementById("btnHit");
const ELEM_BUTTON_STAND = document.getElementById("btnStand");

//CARD DESCRIPTION CONSTANTS::
const CARD_SUIT_CLUBS = 0;
const CARD_SUIT_DIAMONDS = 1;
const CARD_SUIT_HEARTS = 2;
const CARD_SUIT_SPADES = 3;

const CARD_SUIT_IMG_DICT = new Map([
    [CARD_SUIT_CLUBS, "img/clubs.png"],
    [CARD_SUIT_DIAMONDS, "img/diamonds.png"],
    [CARD_SUIT_HEARTS, "img/hearts.png"],
    [CARD_SUIT_SPADES, "img/spades.png"],
]);

const CARD_POWER_ACE = 0;
const CARD_POWER_TWO = 1;
const CARD_POWER_THREE = 2;
const CARD_POWER_FOUR = 3;
const CARD_POWER_FIVE = 4;
const CARD_POWER_SIX = 5;
const CARD_POWER_SEVEN = 6;
const CARD_POWER_EIGHT = 7;
const CARD_POWER_NINE = 8;
const CARD_POWER_TEN = 9;
const CARD_POWER_JACK = 10;
const CARD_POWER_QUEEN = 11;
const CARD_POWER_KING = 12;

const CARD_POWER_DICT = new Map([
    [CARD_POWER_ACE, 11],
    [CARD_POWER_TWO, 2],
    [CARD_POWER_THREE, 3],
    [CARD_POWER_FOUR, 4],
    [CARD_POWER_FIVE, 5],
    [CARD_POWER_SIX, 6],
    [CARD_POWER_SEVEN, 7],
    [CARD_POWER_EIGHT, 8],
    [CARD_POWER_NINE, 9],
    [CARD_POWER_TEN, 10],
    [CARD_POWER_JACK, 10],
    [CARD_POWER_QUEEN, 11],
    [CARD_POWER_KING, 12],
]);

const CARD_POWER_SIGN = new Map([
    [CARD_POWER_ACE, "A"],
    [CARD_POWER_TWO, "2"],
    [CARD_POWER_THREE, "3"],
    [CARD_POWER_FOUR, "4"],
    [CARD_POWER_FIVE, "5"],
    [CARD_POWER_SIX, "6"],
    [CARD_POWER_SEVEN, "7"],
    [CARD_POWER_EIGHT, "8"],
    [CARD_POWER_NINE, "9"],
    [CARD_POWER_TEN, "10"],
    [CARD_POWER_JACK, "J"],
    [CARD_POWER_QUEEN, "Q"],
    [CARD_POWER_KING, "K"],
])

//ROUND OVER REASONS:
ROUND_OVER_PLAYER_LOSE = 0;
ROUND_OVER_PLAYER_WIN = 1;
ROUND_OVER_DRAW = 2;

//POOL STATE:
POOL_STATE_BUST = 0;
POOL_STATE_BLACKJACK = 1;
POOL_STATE_DRAW = 2;
POOL_STATE_ADVAN = 3;

//UTILS:
//Generate random number between min inluded and max included
function getRandomNum(mini, maxi) {
    return Math.floor(Math.random() * (maxi - mini + 1) + mini);
}

//CARD FUNCTIONS:
//Сreates a deck of cards. 
//The cards are randomly generated in the deck and can be repeated.
function createCardDeck(count) {
    var suits = [
        CARD_SUIT_CLUBS, 
        CARD_SUIT_DIAMONDS, 
        CARD_SUIT_HEARTS, 
        CARD_SUIT_SPADES,
    ];
    var powers = [
        CARD_POWER_ACE, 
        CARD_POWER_TWO, 
        CARD_POWER_THREE, 
        CARD_POWER_FOUR, 
        CARD_POWER_FIVE, 
        CARD_POWER_SIX, 
        CARD_POWER_SEVEN, 
        CARD_POWER_EIGHT, 
        CARD_POWER_NINE,
        CARD_POWER_TEN, 
        CARD_POWER_JACK, 
        CARD_POWER_QUEEN, 
        CARD_POWER_KING,
    ];

    var deck = [];

    for (let i = 0; i < count; ++i) {
        deck.push(instanceCard(
            powers[getRandomNum(0, powers.length - 1)], 
            suits[getRandomNum(0, suits.length - 1)]
        ));
    }

    return deck;
}

//Creates card class div of the specified suit and strength. 
//Returns card div object.
function instanceCard(power, suit) {
    if (!CARD_SUIT_IMG_DICT.has(suit) || !CARD_POWER_DICT.has(power) || !CARD_POWER_SIGN.has(power))
        return null;

    var card = document.createElement("div");
    card.className = "card";
    card.power = CARD_POWER_DICT.get(power);
    var pTop = document.createElement("p");
    pTop.innerText = CARD_POWER_SIGN.get(power);
    var imgTop = document.createElement("img");
    imgTop.src = CARD_SUIT_IMG_DICT.get(suit);
    pTop.appendChild(imgTop);
    var imgMain = document.createElement("img");
    imgMain.src = CARD_SUIT_IMG_DICT.get(suit);
    card.appendChild(pTop);
    card.appendChild(imgMain);

    return card;
}

//Сreates and adds a card to the player's or dealer's card pool.
function addToCardPool(isPlayerPool, power, suit) {
    var card = instanceCard(power, suit);
    if (!card)
        return false;

    addCardToCardPool(isPlayerPool, card);
    return true;
}

//Add card div object to the player's or dealer's card pool.
function addCardToCardPool(isPlayerPool, cardDiv) {
    var li = document.createElement("li");
    li.appendChild(cardDiv);

    if (isPlayerPool)
        ELEM_PLAYER_CARDS.appendChild(li);
    else
        ELEM_DEALER_CARDS.appendChild(li);
}

//Clears the card pool.
function clearCardPool(isPlayerPool) {
    var pool = isPlayerPool ? ELEM_PLAYER_CARDS : ELEM_DEALER_CARDS;
    while (pool.children.length)
        pool.removeChild(pool.children[0]);
}

//Get the current power of the card pool.
function getCardPoolPower(isPlayerPool) {
    var pool = isPlayerPool ? ELEM_PLAYER_CARDS : ELEM_DEALER_CARDS;
    var power = 0;
    for (let li of pool.children)
        power += li.children[0].power;
    return power;
}

//DISPLAY FUNCTIONS:
//Set value of score display.
function setScoreDisplay(isPlayerScore, value) {
    if (isPlayerScore)
        ELEM_PLAYER_SCORE.innerText = `Score: ${value}`;
    else
        ELEM_DEALER_SCORE.innerText = `Score: ${value}`;
}

//Set value of card count display.
function setCardCountDisplay(value) {
    ELEM_CARDS_COUNT.innerText = `Card count: ${value}`;
}

//Set display value of pool power.
function setCardPoolPowerDisplay(isPlayerPool, value) {
    if (isPlayerPool)
        ELEM_PLAYER_POOL_POWER.innerText = value;
    else
        ELEM_DEALER_POOL_POWER.innerText = value;
}

//CONTROLS FUNCTIONS:
//Set enabled (unblock) or disabled (block) player's controls.
function setEnabledPlayerControls(isEnabled) {
    ELEM_BUTTON_HIT.disabled = !isEnabled;
    ELEM_BUTTON_STAND.disabled = !isEnabled;
}

//Sets the visibility of the pool capacity hint area of a particular party.
function setVisibilityPoolPowerHint(isPlayerPool, isVisible) {
    if (isPlayerPool)
        ELEM_PLAYER_POOL_POWER.style.display = isVisible ? "inline" : "none";
    else
        ELEM_DEALER_POOL_POWER.style.display = isVisible ? "inline" : "none";
}

//Sets indication state of player power hint
function setIndicatePoolPowerHint(isPlayerPool, poolState) {
    const elem = isPlayerPool ? ELEM_PLAYER_POOL_POWER : ELEM_DEALER_POOL_POWER;
    if (poolState == POOL_STATE_BUST)
        elem.classList.add("bust");
    else if (poolState == POOL_STATE_BLACKJACK)
        elem.classList.add("bj");
    else if (poolState == POOL_STATE_DRAW)
        elem.classList.add("draw");
    else if (poolState == POOL_STATE_ADVAN)
        elem.classList.add("advan");
}

//Unset indication state (any to default) of player power hint.
function unsetIndicatePoolPowerHint(isPlayerPool) {
    const elem = isPlayerPool ? ELEM_PLAYER_POOL_POWER : ELEM_DEALER_POOL_POWER;
    elem.classList.remove("bust", "bj", "draw", "advan");
}

//Sets the indication on the score display.
function setIndicateScoreDisplay(isPlayerScore, isSet) {    
    const elem = isPlayerScore ? ELEM_PLAYER_SCORE: ELEM_DEALER_SCORE;
    if (isSet)
        elem.classList.add("indicate");
    else
        elem.classList.remove("indicate");
}

function setIndicateCardsDisplay(isSet) {
    if (isSet)
        ELEM_CARDS_COUNT.classList.add("indicate-red");
    else
        ELEM_CARDS_COUNT.classList.remove("indicate-red");
}

//Show message box dlg. The dialogue can be flexibly adjusted to any game situation.
function showMsgDlg(title, message, btnAcceptText, btnAcceptFoo, btnRejectText, btnRejectFoo) {
    var dlgTitleElem = ELEM_MSG_BOX.querySelector("h2");
    var dlgMessageElem = ELEM_MSG_BOX.querySelector("p");
    var dlgBtnAccept = ELEM_MSG_BOX.querySelector("div #msgBoxAcceptBtn");
    var dlgBtnReject = ELEM_MSG_BOX.querySelector("div #msgBoxRejectBtn");
    dlgTitleElem.innerText = title;
    dlgMessageElem.innerText = message;

    if (btnAcceptText == null || btnAcceptFoo == null)
        dlgBtnAccept.style.display = "none";
    else {
        dlgBtnAccept.style.display = "inline";
        dlgBtnAccept.innerText = btnAcceptText;
        dlgBtnAccept.onclick = btnAcceptFoo;
    }

    if (btnRejectText == null || btnRejectFoo == null)
        dlgBtnReject.style.display = "none";
    else {
        dlgBtnReject.style.display = "inline";
        dlgBtnReject.innerText = btnRejectText;
        dlgBtnReject.onclick = btnRejectFoo;
    }

    ELEM_MSG_BOX.style.display = "block";
}

function closeMsgDlg() {
    ELEM_MSG_BOX.style.display = "none";
}