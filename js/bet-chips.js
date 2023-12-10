// First thing user does is place bet,
// by choosing from bet-menu, 
// so start by making chips appear
// when user chooses bet amount:
// when user chooses from bet menu, run show chips func:
const chipsDiv = document.getElementById('chips-div');
const betMenu = document.getElementById('bet-menu');
betMenu.addEventListener('change', showChips);
const moneySpan = document.getElementById('money');
let betAmt = 15;
money = 5000;

// show chips function needs to:
function showChips() {

    // a.) clear chipsDiv and get value of bet:
    chipsDiv.innerHTML = "";
    betAmt = Number(betMenu.value); // 250

    // b.) get the data-chips value, which is a string:
    let index = betMenu.selectedIndex; // save selected index to var
    let optin = betMenu.options[index]; // get selected option by index
    let chips = optin.dataset.chips; // lookup the dataset of index
    console.log('chips:', chips); // "100&100&50" 
    
    // c.) make an array from the chips data string:
    //     example: "100&100&50" becomes ["100","100","50"]
    const chipsArr = chips.split('&'); // split on & which goes away
    console.log('chipsArr:', chipsArr); // ["100","100","50"]

    // d.) declare a var for setting left position of chips:
    let leftPos = -70;
    // e.) run setInterval once per chipsArr item:
    let chipInterval = setInterval(() => {
        // f.) make img for chip and assign class:
        const chipImg = new Image();
        chipImg.className = 'chipper';
        // g.) use shift() to remove chip from beginning of array:
        let chipNum = chipsArr.shift(); // "100"
        // h.) concat the chip image path using chipNum
        chipImg.src = `images/chips/chip-${chipNum}.png`;
        // i.) offset left prop so chips half-overlap
        chipImg.style.left = leftPos + "px";
        // j.) output chipImg to chipsDiv
        chipsDiv.appendChild(chipImg);
        // k.) set a counter var for animating the chips
        let i = 0;
        // l.) animate movement of chip.. slides into position
        let animateChip = setInterval(() => {
            i++;
            leftPos += 4;
            chipImg.style.left = leftPos + "px"; // move the chip 3x to the right
            if(i >= 20) clearInterval(animateChip); // after 25 moves, stop
        }, 25); // run chip animation every 25ms (40fps)
        // m.) stop outputting chips to the table once chipsArr is empty:
        if(!chipsArr.length) {
            clearInterval(chipInterval);
            console.log('chips all out on table!');
        }
    }, 500); // output one chip every 750ms (3/4 of a sec)

} // showChips()

// output $15 chips automatically if user doesn't bet
// also activate DEAL btn
setTimeout(() => {
    showChips();
    dealBtn.classList.remove('disabled-btn');
    dealBtn.disabled = false;
}, 2000);