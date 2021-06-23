package beans;

import java.util.ArrayList;
import java.util.Date;

public class Order {
	private String id;	// logika za dodeljivanje id-a od 10 karaktera se nalazi u "OrderFileRepository"
	private boolean deleted;
	private ArrayList<Item> orderedItems;
	private Restaurant restaurantOfOrder;
	private Date dateOfOrder;
	private double price;
	private Customer customer;
	private OrderStatus status;
	
	public Order() {
		orderedItems = new ArrayList<Item>();
		this.deleted = false;
	}

	public Order(String id, boolean deleted, ArrayList<Item> orderedItems, Restaurant restaurantOfOrder, Date dateOfOrder,
			double price, Customer customer, OrderStatus status) {
		super();
		this.id = id;
		this.deleted = deleted;
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

	public Date getDateOfOrder() {
		return dateOfOrder;
	}

	public void setDateOfOrder(Date dateOfOrder) {
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

	public boolean isDeleted() {
		return deleted;
	}

	public void setDeleted(boolean deleted) {
		this.deleted = deleted;
	}
}
