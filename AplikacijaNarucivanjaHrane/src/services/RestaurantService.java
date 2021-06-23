package services;

import java.util.Collection;
import java.util.HashMap;

import beans.Restaurant;
import fileRepository.RestaurantFileRepository;

public class RestaurantService {
	private static RestaurantFileRepository rfr = new RestaurantFileRepository();
	
	public RestaurantService() {
	}
	
	public Iterable<Restaurant> getAllRestaurants(){
		HashMap<String, Restaurant> validRestaurants = new HashMap<String, Restaurant>();
		for(Restaurant restaurant : rfr.getAllRestaurants().values()) {
			if(!restaurant.isDeleted())
				validRestaurants.put(restaurant.getId(), restaurant);
		}
		return validRestaurants.values();
	}
	
	public Restaurant findRestaurantById(String id) {
		HashMap<String, Restaurant> restaurants = rfr.getAllRestaurants();
		Restaurant restaurant = restaurants.get(id);
		if(!restaurant.isDeleted())
			return restaurant;
		else
			return null;
	}
	
	public Restaurant saveRestaurant(Restaurant restaurant) {
		return rfr.saveRestaurant(restaurant);
	}
	
	public Restaurant deleteRestaurant(String id) {
		return rfr.deleteRestaurant(id);
	}
	
	public Restaurant changeRestaurant(String id, Restaurant newRestaurant) {
		newRestaurant.setDeleted(false);
		return rfr.changeRestaurant(id, newRestaurant);
	}
}
