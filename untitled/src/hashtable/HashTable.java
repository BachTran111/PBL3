package hashtable;

import java.util.LinkedList;

public class HashTable {
    private static class Entry {
        String key;
        String value;

        public Entry(String key, String value) {
            this.value = value;
            this.key = key;
        }
    }

    private final int SIZE = 5;
    private LinkedList<Entry>[] table;

    @SuppressWarnings("unchecked")
    public HashTable() {
        table = new LinkedList[SIZE];
        for (int i = 0; i < SIZE; i++) {
            table[i] = new LinkedList<>();
        }
    }

    private int hash(String key) {
        return Math.abs(key.hashCode()) % SIZE;
    }

    public void put(String key, String value) {
        int index = hash(key);
        for (Entry entry: table[index]) {
            if (entry.key.equals(key)) {
                entry.value = value;
                return;
            }
        }
        table[index].add(new Entry(key, value));
    }

    public String get(String key) {
        int index = hash(key);
        for (Entry entry: table[index]) {
            if (entry.key.equals(key)) {
                return entry.value;
            }
        }
        return null;
    }

    public void printTable(){
        for (int i = 0; i < SIZE; i++) {
            System.out.print("Index" + i + ":");
            for (Entry entry: table[i]) {
                System.out.print("[" + entry.key + " -> " + entry.value + "] ");
            }
            System.out.println();
        }
    }
}
