package fileRepository;

import java.awt.Image;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;

import javax.swing.ImageIcon;

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
				if(!item.isDeleted())
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
	public boolean saveItem(Item item) {
		try (FileWriter f = new FileWriter(fileLocation, true);
				BufferedWriter b = new BufferedWriter(f);
				PrintWriter p = new PrintWriter(b);) {
			p.println(getStringFromItem(item));
			return true;
		} catch (IOException i) {
			i.printStackTrace();
			return false;
		}
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

//	private Image getImageFromString(String imagePath) {
//		ImageIcon icon = new ImageIcon(imagePath);
//		return icon.getImage();
//	}
}
