package beans;

import java.util.ArrayList;

/*
 * Reprezentuje korpu za kupovinu
 */
public class ShoppingCart {
	private ArrayList<ShoppingCartItem> items;
	private Customer customer;
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
	
	public Customer getCustomer() {
		return customer;
	}

	public void setCustomer(Customer customer) {
		this.customer = customer;
	}

	public double getTotalPrice() {
		return totalPrice;
	}

	private void CalculateTotalPrice() {
		double total = 0;
		for (ShoppingCartItem item : items) {
			total += item.getTotalPrice();
		}
		this.totalPrice = total;
	}
}
