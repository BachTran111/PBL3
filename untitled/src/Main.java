import hashtable.HashTable;

public class Main {
    public static void main(String[] args) {
        HashTable ht = new HashTable();
        ht.put("abc", "Value 1");
        ht.put("xyz", "Value 2");
        ht.put("cab", "Value 3");
        ht.put("bac", "Value 4");
        ht.put("abc", "Updated Value");

        System.out.println("abc = " + ht.get("abc")); // Output: Updated Value
        ht.printTable(); // Quan sát các va chạm
    }
}