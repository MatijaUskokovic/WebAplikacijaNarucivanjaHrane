package beans;

import java.awt.Image;
import java.util.ArrayList;

public class Restaurant {
	private String name;
	private RestaurantType type;
	private ArrayList<Item> items;
	private RestaurantStatus status;
	private Location location;
	private Image logo;
	
	public Restaurant() {
		items = new ArrayList<Item>();
	}

	public Restaurant(String name, RestaurantType type, ArrayList<Item> items, RestaurantStatus status,
			Location location, Image logo) {
		super();
		this.name = name;
		this.type = type;
		this.items = items;
		this.status = status;
		this.location = location;
		this.logo = logo;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public RestaurantType getType() {
		return type;
	}

	public void setType(RestaurantType type) {
		this.type = type;
	}

	public ArrayList<Item> getItems() {
		return items;
	}

	public void setItems(ArrayList<Item> items) {
		this.items = items;
	}

	public RestaurantStatus getStatus() {
		return status;
	}

	public void setStatus(RestaurantStatus status) {
		this.status = status;
	}

	public Location getLocation() {
		return location;
	}

	public void setLocation(Location location) {
		this.location = location;
	}

	public Image getLogo() {
		return logo;
	}

	public void setLogo(Image logo) {
		this.logo = logo;
	}
}
