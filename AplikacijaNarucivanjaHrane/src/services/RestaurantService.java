package services;

import java.util.Collection;

import beans.Restaurant;
import fileRepository.RestaurantFileRepository;

public class RestaurantService {
	private static RestaurantFileRepository rfr = new RestaurantFileRepository();
	
	public RestaurantService() {
	}
	
	public Collection<Restaurant> getAllRestaurants(){
		return rfr.getAllRestaurants().values();
	}
	
	public boolean saveRestaurant(Restaurant restaurant) {
		return rfr.saveRestaurant(restaurant);
	}
}
