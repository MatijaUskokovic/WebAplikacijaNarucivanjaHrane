package beans;

import java.util.ArrayList;

/*
 * Reprezentuje korpu za kupovinu
 */
public class ShoppingCart {
	private ArrayList<ShoppingCartItem> items;
	private String customerId;
	private double totalPrice;
	
	public ShoppingCart() {
		this.items = new ArrayList<ShoppingCartItem>();
		this.totalPrice = 0;
	}

	public void addItem(Item item, int count) {
		items.add(new ShoppingCartItem(item, count));
		CalculateTotalPrice();
	}
	
	public ArrayList<ShoppingCartItem> getItems() {
		return items;
	}
	
	public void setItems(ArrayList<ShoppingCartItem> items) {
		this.items = items;
		CalculateTotalPrice();
	}

	public String getCustomerId() {
		return customerId;
	}

	public void setCustomerId(String customerId) {
		this.customerId = customerId;
	}

	public double getTotalPrice() {
		return totalPrice;
	}

	public void CalculateTotalPrice() {
		double total = 0;
		for (ShoppingCartItem item : items) {
			total += item.getTotalPrice();
		}
		this.totalPrice = total;
	}
}
