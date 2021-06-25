package fileRepository;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;

import beans.Item;
import beans.ItemType;
import beans.Restaurant;

/**
 * Klasa koja vrsi manipulaciju rada sa datotekom restaurants.txt <br>
 * NACIN PISANJA U DATOTECI:
 * id,deleted,name,price,type,restaurant,quantity,description,image
 * 
 * @author bojan
 */
// TODO: image je null treba ispraviti
public class ItemsFileRepository {
	private static String fileLocation = "files/items.txt";

	public ItemsFileRepository() {
	}

	/**
	 * Metoda vrsi citanje iz datoteke i podatke smesta u mapu. Kljuc mape je id
	 * proizvoda
	 */
	public HashMap<String, Item> getAllItems() {
		HashMap<String, Item> items = new HashMap<String, Item>();
		BufferedReader in = null;
		String line;
		try {
			in = new BufferedReader(new FileReader(new File(fileLocation)));
			while ((line = in.readLine()) != null) {
				Item item = makeItemFromLine(line.trim());
				items.put(item.getId(), item);
			}
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (in != null) {
				try {
					in.close();
				} catch (Exception e) {
				}
			}
		}
		return items;
	}

	/**
	 * Metoda dodaje novi "item" u datoteku
	 * 
	 * */
	public Item saveItem(Item item) {
		try (FileWriter f = new FileWriter(fileLocation, true);
				BufferedWriter b = new BufferedWriter(f);
				PrintWriter p = new PrintWriter(b);) {
			p.println(getStringFromItem(item));
			return item;
		} catch (IOException i) {
			i.printStackTrace();
			return null;
		}
	}
	
	/**
	 * Metoda vrsi logicko brisanje itema ciji je id prosledjen
	 * 
	 * */
	public Item deleteItem(String id) {
		HashMap<String, Item> items = this.getAllItems();
		
		Item itemForDeleting = items.get(id);
		itemForDeleting.setDeleted(true);
		
		writeAllItemsInFile(items);
		
		return itemForDeleting;
	}
	
	public Item changeItem(String id, Item newItem) {
		HashMap <String, Item> items = this.getAllItems();
		
		Item oldItem = items.get(id);
		items.replace(id, oldItem, newItem);
		
		writeAllItemsInFile(items);
		
		return newItem;
	}
	
	private void writeAllItemsInFile(HashMap<String, Item> items) {
		FileWriter fileWriter = null;
		ArrayList<String> itemsForWritting = getAllItemsForWriting(items);
		try {
			fileWriter = new FileWriter(fileLocation);
			for(String item : itemsForWritting) {
				fileWriter.write(item);
				fileWriter.write("\n");
			}
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if(fileWriter != null) {
				try {
					fileWriter.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
	}

	private ArrayList<String> getAllItemsForWriting(HashMap<String, Item> items) {
		ArrayList<String> itemsForWriting = new ArrayList<String>();
		
		for(Item item : items.values()) {
			itemsForWriting.add(this.getStringFromItem(item));
		}
		
		return itemsForWriting;
	}

	private String getStringFromItem(Item item) {
		return item.getId() + "," + Boolean.toString(item.isDeleted()) + "," + item.getName() + ","
				+ Double.toString(item.getPrice()) + "," + getStringFromItemType(item) + ","
				+ item.getRestaurant().getId() + "," + Double.toString(item.getQuantity()) + "," + item.getDescription()
				+ "," + "slika";
	}

	private String getStringFromItemType(Item item) {
		if (item.getType().equals(ItemType.jelo))
			return "jelo";
		else
			return "pice";
	}

	private Item makeItemFromLine(String line) {
		String[] lineItems = line.split(",");

		String id = lineItems[0];
		boolean deleted = Boolean.parseBoolean(lineItems[1]);
		String name = lineItems[2];
		double price = Double.parseDouble(lineItems[3]);
		ItemType type = this.getItemTypeFromString(lineItems[4]);
		Restaurant restaurant = new Restaurant();
		restaurant.setId(lineItems[5]);
		double quantity = Double.parseDouble(lineItems[6]);
		String description = lineItems[7];
		//Image image = this.getImageFromString(lineItems[8]);

		return new Item(id, deleted, name, price, type, restaurant, quantity, description, null);
	}

	private ItemType getItemTypeFromString(String type) {
		if (type.equals("jelo"))
			return ItemType.jelo;
		else
			return ItemType.pice;
	}

}
