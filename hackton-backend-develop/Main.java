import java.util.Scanner;

public class Main {

    // Iterative method to calculate factorial
    public static long factorialIterative(int n) {
        long result = 1;
        for (int i = 1; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    // Recursive method to calculate factorial
    public static long factorialRecursive(int n) {
        if (n == 0) {
            return 1;
        }
        return n * factorialRecursive(n - 1);
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("Enter a number: ");
        int number = scanner.nextInt();

        // Calculate factorial using iterative method
        long iterativeResult = factorialIterative(number);
        System.out.println("Factorial (Iterative) of " + number + " is: " + iterativeResult);

        // Calculate factorial using recursive method
        long recursiveResult = factorialRecursive(number);
        System.out.println("Factorial (Recursive) of " + number + " is: " + recursiveResult);

        scanner.close();
    }
}
