package beans;

import java.util.ArrayList;

public class Customer extends User {
	
	private ArrayList<Order> allOrders;
	private ShoppingCart shoppingCart;
	private int pointsCollected;
	private CustomerType type;
	
	public Customer() {
		super();
		this.allOrders = new ArrayList<Order>();
		this.shoppingCart = new ShoppingCart();
	}

	public Customer(ArrayList<Order> allOrders, ShoppingCart shoppingCart, int pointsCollected, CustomerType type) {
		super();
		this.allOrders = allOrders;
		this.shoppingCart = shoppingCart;
		this.pointsCollected = pointsCollected;
		this.type = type;
	}
	
	public Customer(User user) {
		super(user);
		this.allOrders = new ArrayList<Order>();
		this.shoppingCart = new ShoppingCart();
	}

	public ArrayList<Order> getAllOrders() {
		return allOrders;
	}

	public void setAllOrders(ArrayList<Order> allOrders) {
		this.allOrders = allOrders;
	}

	public ShoppingCart getShoppingCart() {
		return shoppingCart;
	}

	public void setShoppingCart(ShoppingCart shoppingCart) {
		this.shoppingCart = shoppingCart;
	}

	public int getPointsCollected() {
		return pointsCollected;
	}

	public void setPointsCollected(int pointsCollected) {
		this.pointsCollected = pointsCollected;
	}

	public CustomerType getType() {
		return type;
	}

	public void setType(CustomerType type) {
		this.type = type;
	}
}
