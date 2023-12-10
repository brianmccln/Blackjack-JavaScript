## Blackjack
### Vanilla JavaScript (no jquery, non-OOP)
#### Bet, Deal, Hit Stand
#### One Player vs. The Dealer
- **bet()** function runs when Player chooses a bet amount from select menu.  
    - bet must be placed before the deal begins  
    - chips animate onto the table. 
    - the html options have a **data-chips** attribute which stores stringy numbers used to concatenate the chip file names on a loop  
- **deal()** function runs when Player clicks DEAL button or presses "d" key  
    - deal() function deals 2 cards each to Player and Dealer; 2nd dealer card is dealt face-down  
    - player and dealer hands are stored in array of values, so a hand worth 16, say Queen Six appears is stored in array as [10,6]  
    - if Player and or Dealer are dealt 21 (10 + Ace), **Blackjack** is announced and the winner declared.  
    - Player's money, which starts at $500, is credited or debited according to who won the hand.  
    - **Blackjack pays 3 to 2**, so a $50 bet wins $75 on Blackjack  
- **hit()** if no one is dealt Blackjack, the DEAL button is disabled, and the HIT and STAND buttons are enabled.  
    - the hit() function runs when the player clicks the HIT button (or types the "h" key)
    - hit() deals another card to the player and updates the score.  
    - if player score is over 21, the player is BUSTED, the hand ends and the player's money is deduced by the amount of the bet  
    - if player score is exactly 21, the HIT button becomes disabled and it is the dealer's turn  
    - if player score is less than 21, the option to hit again remains  
- **stand()** function runs when the player has exactly 21, or if the player clicks the STAND button (or types the "s" key)  
    - stand() checks the dealer's score to assess whether or not the dealer gets another card  
    - if dealer score is less than 17, the dealer gets another card  
    - if dealer has **Soft 17** (Ace plus 6), the dealer also gets another card ("Dealer Must Hit on Soft 17")  

**Aces worth 11 or 1** 
Aces are worth 11 or 1, depending on which is more advantagous to the hand.  
    - if an 11 would bust the hand, the Ace must be assigned a value of 1.  
    - the "downgrading" of the Ace value is handled for both newly dealt and existing Aces.  

**timing for game play**  s
    - **setInterval()** and **setTimeout()** are used to slow down the game so all the cards and feedback results aren't just all outputted at once, which would be no fun.
Speaking of fun, enjoy playing this Blackjack game and figuring out how the JS all works!    
**buttons and select menu diabled / enabled** in order to prevent user from clicking on the wrong buttons, such as the deal button while a game is already in progress, or the hit button after the player score reaches 21, the buttons and select menu are enabled/disabled at the optimal times. The bet menu is also disabled once the deal button is clicked, since bets must be placed before the deal begins.  
