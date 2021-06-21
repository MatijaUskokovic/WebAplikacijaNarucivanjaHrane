package beans;

public class Manager extends User {

	private Restaurant restaurant;
	
	public Manager() {
		super();
		//this.restaurant = new Restaurant();
	}
	
	public Manager(User user) {
		super(user);
		this.restaurant = new Restaurant();
	}

	public Restaurant getRestaurant() {
		return restaurant;
	}

	public void setRestaurant(Restaurant restaurant) {
		this.restaurant = restaurant;
	}
}
