package beans;

import java.util.ArrayList;
import java.util.UUID;

public class Restaurant {
	private String id;
	private boolean deleted;
	private String name;
	private RestaurantType type;
	private ArrayList<Item> items;
	private RestaurantStatus status;
	private Location location;
	private String logo;
	private double avgGrade;
	
	public Restaurant() {
		items = new ArrayList<Item>();
		this.setId(UUID.randomUUID().toString());
		this.setDeleted(false);
	}

	public Restaurant(String id, boolean deleted, String name, RestaurantType type, ArrayList<Item> items,
			RestaurantStatus status, Location location, String logo) {
		super();
		this.setId(id);
		this.deleted = deleted;
		this.name = name;
		this.type = type;
		this.items = items;
		this.status = status;
		this.location = location;
		this.logo = logo;
	}

	public Restaurant(String name, RestaurantType type, ArrayList<Item> items, RestaurantStatus status,
			Location location, String logo) {
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

	public String getLogo() {
		return logo;
	}

	public void setLogo(String logo) {
		this.logo = logo;
	}

	public boolean isDeleted() {
		return deleted;
	}

	public void setDeleted(boolean deleted) {
		this.deleted = deleted;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public double getAvgGrade() {
		return avgGrade;
	}

	public void setAvgGrade(double avgGrade) {
		this.avgGrade = avgGrade;
	}
}
