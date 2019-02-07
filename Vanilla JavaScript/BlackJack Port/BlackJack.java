import java.util.Scanner;

public class BlackJack {

    public static final int NUM_SUITS = 4;
    public static final double NUM_FACES = 13;
    public static final int BLACK_JACK = 21;
    public static final int MIN_BET = 5;
    public static final int HIT = 1;

    public static void main(String[] args) {

        int playerWallet = 500;

        Scanner in = new Scanner(System.in);

        boolean isGameOver = false;
        while (!isGameOver) {
            int numAces = 0;
            String playerHand = "";
            int playerHandValueLowAce = 0;
            int playerHandValue = 0;

            int numAcesDealer = 0;
            String dealerHand = "";
            int dealerHandValueLowAce = 0;
            int dealerHandValue = 0;

            int currentBet = getValidBet(in, playerWallet);

            String dealerCard = getCard();
            dealerHand = "XX " + dealerCard;
            if (isAce(dealerCard))
                numAcesDealer++;

            dealerHandValueLowAce = updateHandValueLowAce(dealerHandValueLowAce, dealerCard);
            dealerHandValue = updateHandValue(dealerHandValueLowAce, numAcesDealer);

            for (int i = 0; i < 2; i++) {
                String card = getCard();

                playerHand += card + " ";

                if (isAce(card))
                    numAces++;

                playerHandValueLowAce = updateHandValueLowAce(playerHandValueLowAce, card);
                playerHandValue = updateHandValue(playerHandValueLowAce, numAces);
            }

            System.out.println("Dealer: " + dealerHand);
            System.out.println("Player: " + playerHand);

            boolean isPlayerDone = false;

            if (playerHandValue == BLACK_JACK) {
                isPlayerDone = true;
                System.out.println("BLACK JACK!!!");
            }

            while (!isPlayerDone) {
                int playerOption = getPlayerInput(in); // 1 they hit, 2 they stand

                if (playerOption == HIT) {
                    String card = getCard();

                    playerHand += card + " ";

                    System.out.println("Player: " + playerHand);

                    if (isAce(card))
                        numAces++;

                    playerHandValueLowAce = updateHandValueLowAce(playerHandValueLowAce, card);
                    playerHandValue = updateHandValue(playerHandValueLowAce, numAces);

                    if (playerHandValue > BLACK_JACK) {
                        isPlayerDone = true;
                        System.out.println("Player Busts!!!");
                    } else if (playerHandValue == BLACK_JACK) {
                        isPlayerDone = true;
                        System.out.println("BLACK JACK!!!");
                    }

                } else { // They said Stand
                    isPlayerDone = true;
                }

            }

            dealerHand = dealerCard + " ";

            while (dealerHandValue < 17) {
                dealerCard = getCard();

                dealerHand += dealerCard + " ";

                if (isAce(dealerCard))
                    numAcesDealer++;

                dealerHandValueLowAce = updateHandValueLowAce(dealerHandValueLowAce, dealerCard);
                dealerHandValue = updateHandValue(dealerHandValueLowAce, numAcesDealer);
            }

            System.out.println("Player: " + playerHand);
            System.out.println("Dealer: " + dealerHand);
            if (playerHandValue > dealerHandValue && playerHandValue <= BLACK_JACK) {
                playerWallet += currentBet;
                System.out.println("Player Wins!!!");
            } else if (dealerHandValue > BLACK_JACK && playerHandValue <= BLACK_JACK) {
                playerWallet += currentBet;
                System.out.println("Player Wins!!!");
            } else if (playerHandValue == dealerHandValue && playerHandValue <= BLACK_JACK) {
                System.out.println("Push, no money lost!!!");
            } else {
                playerWallet -= currentBet;
                System.out.println("Dealer Wins!!!");
            }

            System.out.println("Player Wallet: " + playerWallet);

            isGameOver = !playAgain(in, playerWallet);
        }
        /*
         * System.out.println(playerHand); System.out.println("Number of Aces: " +
         * numAces); System.out.println("Total with Aces as 1: " +
         * playerHandValueLowAce); System.out.println("Total: " + playerHandValue);
         */
    }

    private static int getPlayerInput(Scanner in) {
        boolean isValidInput = false;
        while (!isValidInput) {
            System.out.print("Hit (1) or Stand (2): ");
            String x = in.nextLine();

            if (x.equals("1") || x.equals("2"))
                return Integer.parseInt(x);
        }
        return 0;
    }

    private static boolean playAgain(Scanner in, int playerWallet) {
        if (playerWallet < MIN_BET)
            return false;

        System.out.print("Play Again? (Y/N): ");

        boolean isValidInput = false;
        while (!isValidInput) {
            String temp = in.nextLine().toLowerCase();
            if (temp.equals("yes") || temp.equals("y"))
                return true;
            else if (temp.equals("no") || temp.equals("n"))
                return false;
            else
                System.out.print("Play Again? (Y/N): ");
        }

        return false;
    }

    public static int getValidBet(Scanner in, int playerWallet) {
        System.out.print("Please enter your bet ($" + MIN_BET + " min): ");

        boolean isValidBet = false;
        while (!isValidBet) {
            try {
                int x = Integer.parseInt(in.nextLine());
                if (x >= MIN_BET && x <= playerWallet)
                    return x;
                else if (x < MIN_BET)
                    System.out.print("Invalid bet ($" + MIN_BET + " min): ");
                else
                    System.out.print("Invalid bet ($" + playerWallet + " max): ");
            } catch (Exception ex) {
                System.out.print("Invalid bet ($" + MIN_BET + " min): ");
            }
        }
        return 0;
    }

    public static int updateHandValue(int playerHandValueLowAce, int numAces) {

        if (numAces > 0 && playerHandValueLowAce <= BLACK_JACK - 10)
            playerHandValueLowAce += 10;

        return playerHandValueLowAce;
    }

    public static String getCard() {
        return getFace() + getSuit();
    }

    public static String getFace() {
        int x = (int) (Math.random() * NUM_FACES) + 2;

        if (x <= 10)
            return "" + x;
        else if (x == 11)
            return "J";
        else if (x == 12)
            return "Q";
        else if (x == 13)
            return "K";
        else
            return "A";

    }

    public static String getSuit() {
        int x = (int) (Math.random() * NUM_SUITS);
        if (x == 0)
            return "S";
        else if (x == 1)
            return "D";
        else if (x == 2)
            return "H";
        else
            return "C";
    }

    public static boolean isAce(String card) {
        return card.indexOf("A") == 0;
    }

    // Treats Aces as a 1
    public static int getCardValue(String card) {
        if (card.length() == 3)
            return 10;

        String face = card.substring(0, 1);

        try {
            return Integer.parseInt(face);
        } catch (Exception ex) {
            if (face.equals("A"))
                return 1;
            else
                return 10;
        }
    }

    public static int updateHandValueLowAce(int playerHandValue, String newCard) {
        return playerHandValue + getCardValue(newCard);
    }

}