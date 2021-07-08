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
import beans.ShoppingCart;
import beans.ShoppingCartItem;
import services.ItemService;

public class ShoppingCartFileRepository {

	private String path = "./files/shoppingCarts.txt";
	// kljuc je id korisnika kojem pripada, a vrednost je korpa
	private HashMap<String, ShoppingCart> shoppingCarts= new HashMap<String, ShoppingCart>();
	
	public ShoppingCartFileRepository() {
		
	}
	
	public ShoppingCart getShoppingCartOfUser(String id) {
		readShoppingCarts();
		return shoppingCarts.get(id);
	}
	
	public ShoppingCart changeOrAddShoppingCart(ShoppingCart shoppingCart) {
		readShoppingCarts();
		if (shoppingCarts.containsKey(shoppingCart.getCustomerId())) {
			writeChangedShoppingCart(shoppingCart.getCustomerId(), shoppingCartToText(shoppingCart));
		}
		else {
			addShoppingCart(shoppingCart);
		}
		return shoppingCart;
	}
	
	private void addShoppingCart(ShoppingCart shoppingCart) {
		writeShoppingCart(shoppingCartToText(shoppingCart), true);
	}
	
	private void readShoppingCarts() {
		shoppingCarts.clear();
		ArrayList<String> lines = readLines();
		for (String line : lines) {
			String[] shoppingCartData = line.split(",");
			String customerId = shoppingCartData[0];
			
			// u slucaju da je korpa prazna
			if (shoppingCartData.length == 1) {
				shoppingCarts.put(customerId, new ShoppingCart());
				continue;
			}
			
			ItemService itemService = new ItemService();
			ArrayList<ShoppingCartItem> scItems = new ArrayList<ShoppingCartItem>();
			String[] scItemsString;
			try {
				scItemsString = shoppingCartData[1].split("#");
			}catch(Exception e) {
				String[] scItemsStringCopy = new String[1];
				scItemsStringCopy[0] = shoppingCartData[1];
				scItemsString = scItemsStringCopy;
			}
			for (int i = 0; i < scItemsString.length; i++) {
				String[] data = scItemsString[i].split(";");
				ShoppingCartItem scItem = new ShoppingCartItem();
				Item item = itemService.findItemById(data[0]);
				scItem.setItem(item);
				int count = Integer.parseInt(data[1]);
				scItem.setCount(count);
				scItems.add(scItem);
			}
			
			ShoppingCart shoppingCart = new ShoppingCart();
			shoppingCart.setCustomerId(customerId);
			shoppingCart.setItems(scItems);
			
			shoppingCarts.put(customerId, shoppingCart);
		}
	}
	
	private ArrayList<String> readLines() {
		ArrayList<String> lines = new ArrayList<>();
		BufferedReader in = null;
		try {
			File file = new File(path);
			in = new BufferedReader(new FileReader(file));
			String line;
			
			while ((line = in.readLine()) != null) {
				line = line.trim();
				if (line.equals(""))
					continue;
				
				lines.add(line);
			}
		} catch(Exception e) {
			e.printStackTrace();
		}
		finally {
			if ( in != null ) {
				try {
					in.close();
				}
				catch (Exception e) { }
			}
		}
		return lines;
	}
	
	/*
	 * Metoda sluzi za upisivanje novog shopping cart-a u fajl. Drugi parametar sluzi da kaze da li se
	 * fajl iznova pise ili se dodaje novi red
	 */
	private boolean writeShoppingCart(String scToWrite, boolean append) {
		try (FileWriter f = new FileWriter(path, append);
				BufferedWriter b = new BufferedWriter(f);
				PrintWriter p = new PrintWriter(b);) {
			p.println(scToWrite);
			return true;
		} catch (IOException i) {
			i.printStackTrace();
			return false;
		}
	}
	
	private void writeChangedShoppingCart(String idOfUserShoppingCart, String changedShoppingCart) {
		ArrayList<String> lines = readLines();
		boolean append = false;
		for (String line : lines) {
			String[] data = line.split(",");
			String id = data[0];
			
			if (id.equals(idOfUserShoppingCart)) {
				writeShoppingCart(changedShoppingCart, append);
			}else {
				writeShoppingCart(line, append);
			}
			append = true;
		}
	}
	
	private String shoppingCartToText(ShoppingCart sc) {
		StringBuilder scString = new StringBuilder("");
		scString.append(sc.getCustomerId() + ",");
		for (ShoppingCartItem scItem : sc.getItems()) {
			scString.append(scItem.getItem().getId() + ";" + scItem.getCount());
			scString.append("#");
		}
		scString.deleteCharAt(scString.length() - 1);
		return scString.toString();
	}
}
