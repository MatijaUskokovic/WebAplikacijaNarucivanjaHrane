package beans;

import java.util.ArrayList;

public class Deliverer extends User {

	private ArrayList<Order> ordersToDeliver;
	
	public Deliverer() {
		super();
		this.ordersToDeliver = new ArrayList<Order>();
	}
	
	public Deliverer(User user) {
		super(user);
		this.ordersToDeliver = new ArrayList<Order>();
	}

	public ArrayList<Order> getOrdersToDeliver() {
		return ordersToDeliver;
	}

	public void setOrdersToDeliver(ArrayList<Order> ordersToDeliver) {
		this.ordersToDeliver = ordersToDeliver;
	}
}
