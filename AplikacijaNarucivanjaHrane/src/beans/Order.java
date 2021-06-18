package beans;

import java.time.LocalDate;
import java.util.ArrayList;

public class Order {
	private String id;
	private ArrayList<Item> orderedItems;
	private Restaurant restaurantOfOrder;
	private LocalDate dateOfOrder;
	private double price;
	private Customer customer;
	private OrderStatus status;
	
	public Order() {
		orderedItems = new ArrayList<Item>();
	}

	public Order(String id, ArrayList<Item> orderedItems, Restaurant restaurantOfOrder, LocalDate dateOfOrder,
			double price, Customer customer, OrderStatus status) {
		super();
		this.id = id;
		this.orderedItems = orderedItems;
		this.restaurantOfOrder = restaurantOfOrder;
		this.dateOfOrder = dateOfOrder;
		this.price = price;
		this.customer = customer;
		this.status = status;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public ArrayList<Item> getOrderedItems() {
		return orderedItems;
	}

	public void setOrderedItems(ArrayList<Item> orderedItems) {
		this.orderedItems = orderedItems;
	}

	public Restaurant getRestaurantOfOrder() {
		return restaurantOfOrder;
	}

	public void setRestaurantOfOrder(Restaurant restaurantOfOrder) {
		this.restaurantOfOrder = restaurantOfOrder;
	}

	public LocalDate getDateOfOrder() {
		return dateOfOrder;
	}

	public void setDateOfOrder(LocalDate dateOfOrder) {
		this.dateOfOrder = dateOfOrder;
	}

	public double getPrice() {
		return price;
	}

	public void setPrice(double price) {
		this.price = price;
	}

	public Customer getCustomer() {
		return customer;
	}

	public void setCustomer(Customer customer) {
		this.customer = customer;
	}

	public OrderStatus getStatus() {
		return status;
	}

	public void setStatus(OrderStatus status) {
		this.status = status;
	}
}
