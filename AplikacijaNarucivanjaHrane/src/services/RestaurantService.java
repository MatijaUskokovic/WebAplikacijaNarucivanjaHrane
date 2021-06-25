package services;

import java.util.HashMap;

import beans.Restaurant;
import fileRepository.RestaurantFileRepository;

public class RestaurantService {
	private static RestaurantFileRepository rfr = new RestaurantFileRepository();
	private static CommentService commentService = new CommentService();
	private static ItemService itemService = new ItemService();
	
	public RestaurantService() {
	}
	
	public Iterable<Restaurant> getAllRestaurants(){
		HashMap<String, Restaurant> validRestaurants = new HashMap<String, Restaurant>();
		
		for(Restaurant restaurant : rfr.getAllRestaurants().values()) {
			restaurant.setAvgGrade(commentService.getAvgGradeOfRestaurant(restaurant.getId()));
			restaurant.setItems(itemService.getAllItemsOfRestaurant(restaurant.getId()));
			if(!restaurant.isDeleted())
				validRestaurants.put(restaurant.getId(), restaurant);
		}
		
		return validRestaurants.values();
	}
	
	public Restaurant findRestaurantById(String id) {
		HashMap<String, Restaurant> restaurants = rfr.getAllRestaurants();
		Restaurant restaurant = restaurants.get(id);
		restaurant.setItems(itemService.getAllItemsOfRestaurant(restaurant.getId()));
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
