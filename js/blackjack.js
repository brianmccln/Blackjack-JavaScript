// Blackjack from Scatch in Vanilla JS (no jquery, no OOP)
// deal(), hit(), stand(), evalWinner(), resetBtns() and updateMoney() functions
// deal(), hit() and stand() run when user clicks DEAL, HIT and STAND buts 
// deal(), hit() and stand() also run or on "d", "s" and "h" key press
// bet() function externalized to bet-chips.js file since game can be 
// played with no chips / betting

// get the necessary DOM elements:
const playerCardsDiv = document.getElementById('player-cards-div');
const dealerCardsDiv = document.getElementById('dealer-cards-div');
const playerScoreSpan = document.getElementById('player-score-span');
const dealerScoreSpan = document.getElementById('dealer-score-span');
const h2 = document.querySelector('h2');

// get the 3 buttons:
const dealBtn = document.getElementById('deal-btn');
dealBtn.addEventListener('click', deal); // have deal button call deal function:
const hitBtn = document.getElementById('hit-btn');
hitBtn.addEventListener('click', hit);
const standBtn = document.getElementById('stand-btn');
standBtn.addEventListener('click', stand);

let i = 1;
// declare arrays to store the hands of the dealer and player
let playerHand = [];
let dealerHand = [];
// declare number vars for dealer and player scores
let playerScore = dealerScore = standCount = standTime = 0;
let holeCard = ""; // for saving dealer's 2nd card, which starts off hidden but is later revealed

// make a deck of 52 cards:
// refer to previous lesson(s) for how to do this
// you can copy-paste the necessary starter arrays
// make array called deck, containing 52 objects:
const deck = [];
const kinds = ['2','3','4','5','6','7','8','9','10','Jack','Queen','King', 'Ace'];
const suits = ['Diamonds', 'Hearts', 'Spades', 'Clubs'];

// YOUR CODE will be a NESTED LOOP to iterate the kinds and suits arrays
// Bonus: use forEach instead of a for loop
// With each iteration, make a new car object and push it into the deck

// kinds.forEach(k => {
//     suits.forEach(s => {
for(let k of kinds) { // compact for loop may be even better than forEach
    // cuz why do we need to run a callback function just to iterate
    for(let s of suits) { 
        const card = { kind: k, suit: s,
            valu: k == 'Ace' ? 11 : k.length > 3 ? 10 : Number(k),
            name: `${k} of ${s}`, file: `${k}-of-${s}.png` };
        deck.push(card);
    } // close inner suits loop
} // close outer kinds loop
//     }); // end inner suits.forEach
// }); // end outer kinds.forEach

// make a 6-deck shoe of shuffled cards for game play:

// 1.) shuffle the deck using the sort() callback algo w Math.random() :
deck.sort(() => Math.random() - 0.5);
deck.sort(() => 0.5 - Math.random()); // shuffle again, "backwards"

// 2.) check the result to see if it really shuffled it or only kind of half-shuffled it:
// console.log(deck); // 52 card objects: 
// { kind:"Queen", suit:"Diamonds", valu:10, name:"Queen of Diamonds" file:"Queen-of-Diamonds.png"}

// 3.) make a 6-deck shoe, that is an new array called shoe of length 52 x 6 = 312
const shoe = [...deck, ...deck, ...deck, ...deck, ...deck, ...deck];
shoe.sort(() => Math.random() - 0.5);
shoe.sort(() => 0.5 - Math.random());
console.log(shoe); 

// 4.) DEAL the cards when player clicks the DEAL button
// deal() function will deal 2 cards each to player and dealer, starting w player
// w cards going in their respective boxes (player gets the first card)

// define the deal function
// refactor the deal function so that it deals all 4 cards:
// click deal button to get 2 cards in each box, alternating:
// the sequence is: player-dealer-player-dealer
// HINT: %
// for starters, just get all 4 cards to appear in player's box
// now that we have 4 cards going into player box, can we slow it down
// for more realistic gameplay.. refactor: replace for loop w setInterval
// that runs 4 times. you still need some kind of counter, like i, 
// to know when to clear the interval

document.addEventListener('keydown', evt => {
    if(evt.key == "h" && !hitBtn.disabled) {
        hit();
    } else if(evt.key == "s" && !standBtn.disabled) {
        stand();
    } else if(evt.key == "d" && !dealBtn.disabled) {
        deal();
    } else {
        return;
    }
});

function deal() {
    betMenu.disabled = true;
    betMenu.style.opacity = 0.3;
    i = 1; // for keeping count of cars
    standTime = 0;
    // clear away any old cards that may be on the table from previous hand:
    playerCardsDiv.innerHTML = "";
    dealerCardsDiv.innerHTML = "";
    // reset the player and dealer hands and scores:
    playerHand = [];
    dealerHand = [];
    playerScore = 0;
    dealerScore = 0;

    let dealInterval = setInterval(() => {

        // take a card from the shoe
        const card = shoe.pop(); // 
        // to test all Aces scenario: turn of line above, turn on line below
        // make an img
        const pic = new Image();
        pic.className = 'card-img';
        pic.src = `images/cards350px/${card.file}`;
        
        if(i % 2 == 1) { // odd cards go to player

            // if this is player's 2nd Ace, value is 1:
            if(i == 3 && card.kind == "Ace" && playerHand[0] == 11) card.valu = 1;
            playerHand.push(card.valu);
            playerScore += card.valu;
            playerScoreSpan.textContent = `Player Score: ${playerScore}`;
            playerCardsDiv.appendChild(pic);

        } else { // even cards go to dealer

            // if this is dealer's 2nd card, AND if it is an Ace, AND if 1st card is also an Ace:
            if(i == 4 && card.kind == "Ace" && dealerHand[0] == 11) card.valu = 1; 
            // if all that is true, dealer has 2 Aces, so 2nd Ace value is 1 -- NOT 11
            dealerHand.push(card.valu);
            dealerScore += card.valu;
            if(dealerHand[0] == 11) {
                dealerScoreSpan.innerHTML = `Dealer Shows Ace`;
            } else {
                dealerScoreSpan.innerHTML = `Dealer Shows: ${dealerHand[0]}`;
            }
            dealerCardsDiv.appendChild(pic);
        }

        // stop interval once i gets to 4 cuz deal is done, both have 2 cards
        if(i == 4) {

            // save the hole card file:
            holeCard = card.file;
            // if this is last card (dealer's 2nd card), deal it face down
            pic.src = `images/cards350px/0-Back-of-Card-Red.png`; 
            // dealerScore = 21; // test dealer / player blackjack
            // playerScore = 21;
            // deal is done, so check for blackjack: that is, player and/or dealer having 21
            // in which case game is immediately over (Hit and Stand btns stay deactivated)
            if(dealerScore == 21 && playerScore == 21) {
                
                setTimeout(() => h2.textContent = "Both gave Blackjack! It's a PUSH!", 1250);
                // on the DOM, child elements exist in a children array, so children[0]
                // is the first child elem in the parent elem
                // in the dealerCardsDiv, the hidden card is the 2nd card which is children[1]
                // reveal dealer's hidden card on a delay so we first see the back of the hidden card
                setTimeout(() => dealerCardsDiv.children[1].src = `images/cards350px/${holeCard}`, 2500);
            
            } else if(dealerScore == 21) {

                setTimeout(() => {
                    h2.textContent = "Dealer has Blackjack! You LOSE!";
                    money -= betAmt;
                    resetBtns();
                }, 1250);
                setTimeout(() => dealerCardsDiv.children[1].src = `images/cards350px/${holeCard}`, 2500);
            
            } else if(playerScore == 21) {

                setTimeout(() => {
                    h2.textContent = "You have Blackjack! You WIN!";
                    money += (betAmt * 1.5);
                    resetBtns();
                }, 1250);
            
            } else { // no one has blackjack, so prompt user to go..

                h2.textContent = "Hit or Stand..?";
                // game on, so enable Hit/Stand
                hitBtn.classList.remove('disabled-btn');
                hitBtn.disabled = false;
                standBtn.classList.remove('disabled-btn');
                standBtn.disabled = false;
                // deactivate deal button until game is over:
                dealBtn.classList.add('disabled-btn');
                dealBtn.disabled = true;
            }
            clearInterval(dealInterval);

        } // end if i == 4
        i++;

    }, 1000);

    console.log('Player Hand:\n', playerHand);
    console.log('Dealer Hand:\n', dealerHand);

} // end func deal()

function hit() {

    setTimeout(() => {

        // give player card and update score; handle any Aces:
        const card = shoe.pop();
        if(card.kind == "Ace" && playerScore > 10) {
            card.valu = 1;
        } else { // card is not Ace
            if(playerHand.includes(11) && (playerScore + card.valu > 21)) {
                playerHand[playerHand.indexOf(11)] = 1;
                playerScore -= 10;
            }
        }

        playerHand.push(card.valu);
        playerScore += card.valu;
        playerScoreSpan.textContent = `Player Score: ${playerScore}`;
        const pic = new Image();
        pic.src = `images/cards350px/${card.file}`; 
        playerCardsDiv.appendChild(pic);

    }, 550);

    // now assess score: >21: Busted, =21: done, <21: Hit or Stand..?

    setTimeout(() => {

        if(playerScore > 21) {
            h2.textContent = "BUSTED! You LOSE!";
            money -= betAmt;
            resetBtns();
        } else if(playerScore == 21) {
            h2.textContent = "You have 21! Dealer's turn!";
            stand();
        } else { // player score less than 21
            h2.textContent = "Hit or stand..?";
        }

    }, 1000);

} // end hit()

// runs on standBtn click and automatically when playerScore is 21 exactly
function stand() {

    h2.textContent = ``;
    standTime = 1;

    if(standTime == 1) {

        standTime = 2;
        setTimeout(() => {
            hitBtn.classList.add('disabled-btn');
            hitBtn.disabled = true;
            standBtn.classList.add('disabled-btn');
            standBtn.disabled = true;
            dealerCardsDiv.children[1].src = `images/cards350px/${holeCard}`;
        }, 600);

    }

    setTimeout(() => {

        dealerScoreSpan.textContent = `Dealer Score: ${dealerScore}`;

        if(dealerScore == 17) {
            if(dealerHand.includes(11)) {
                dealerHand[dealerHand.indexOf(11)] = 1;
                dealerScore -= 10;
                h2.textContent = `Dealer must hit on Soft 17..`;
            }
        }

        if(dealerScore <= 16) { // dealer hits on 16

            const card = shoe.pop();

            if(card.kind == "Ace" && dealerScore > 10) {
                card.valu = 1;
            } else { // card is not Ace
                if(dealerHand.includes(11) && (dealerScore + card.valu > 21)) {
                    dealerHand[dealerHand.indexOf(11)] = 1;
                    dealerScore -= 10;
                }
            }

            dealerHand.push(card.valu);
            dealerScore += card.valu;
            dealerScoreSpan.textContent = `Dealer Score: ${dealerScore}`;
            const pic = new Image();
            pic.src = `images/cards350px/${card.file}`; 
            dealerCardsDiv.appendChild(pic);

        }
    
        dealerScoreSpan.textContent = `Dealer Score: ${dealerScore}`;
        // reassess to see if dealer gets another card
        if(dealerScore > 21) {
            
            h2.textContent = "Dealer BUSTED! You WIN!", 500;
            money += betAmt;
            resetBtns();

        } else if(dealerScore > 16) {

            if(dealerScore == 17) {
                if(dealerHand.includes(11)) {
                    dealerHand[dealerHand.indexOf(11)] = 1;
                    dealerScore -= 10;
                    h2.textContent = `Dealer must hit on Soft 17..`;
                    stand();
                }
            }

            setTimeout(() => { // dealer score 17-20 but not soft 17
                h2.textContent = `Dealer stands on ${dealerScore}..`;
                evalWinner();
            }, 500);

        } else { // dealer score 16 or less
            h2.textContent = `Dealer hits on ${dealerScore}..`;
            stand();
        }

    }, 800 * (standTime+0.5));

} // end stand()

function evalWinner() {

    setTimeout(() => {

        if(playerScore > dealerScore) {
            h2.textContent = `You WIN!`;
            money += betAmt;
        } else if(playerScore < dealerScore) {
            h2.textContent = `You LOSE!`;
            money -= betAmt;
        } else {
            h2.textContent = `It's a PUSH!`;
        }

        setTimeout(() => resetBtns(), 500);

    }, 1000);

} // end evalWinner()

function resetBtns() {

    // game is over, winner has been declared, so reset buttons:
    setTimeout(() => {

        hitBtn.classList.add('disabled-btn');
        hitBtn.disabled = true;
        standBtn.classList.add('disabled-btn');
        standBtn.disabled = true;
        dealBtn.classList.remove('disabled-btn');
        dealBtn.disabled = false;
        updateMoney();
        standTime = 0;
        i = 1;
        betMenu.disabled = false;
        betMenu.style.opacity = 1;

    }, 500);

}

function updateMoney() {
    setTimeout(() => moneySpan.textContent = `$${money}`, 1000);
}