package services;

import java.util.ArrayList;
import java.util.HashMap;

import beans.Customer;
import beans.Order;
import beans.OrderStatus;
import beans.Restaurant;
import fileRepository.ImageFileRepository;
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
		if (restaurant == null) {
			return null;
		}
		restaurant.setItems(itemService.getAllItemsOfRestaurant(restaurant.getId()));
		if(!restaurant.isDeleted())
			return restaurant;
		else
			return null;
	}
	
	public Restaurant getRestaurantWithoutItems(String id) {
		HashMap<String, Restaurant> restaurants = rfr.getAllRestaurants();
		Restaurant restaurant = restaurants.get(id);
		if (restaurant == null) {
			return null;
		}
		restaurant.setAvgGrade(commentService.getAvgGradeOfRestaurant(restaurant.getId()));
		if(!restaurant.isDeleted())
			return restaurant;
		else
			return null;
	}
	
	public Restaurant getRestaurantWithoutItemsAndGrade(String id) {
		HashMap<String, Restaurant> restaurants = rfr.getAllRestaurants();
		Restaurant restaurant = restaurants.get(id);
		if (restaurant == null) {
			return null;
		}
		if(!restaurant.isDeleted())
			return restaurant;
		else
			return null;
	}
	
	public Iterable<Customer> getCustomersOfRestaurant(String restaurantId) {
		OrderService orderService = new OrderService();
		UserService userService = new UserService();
		ArrayList<Order> ordersOfRestaurant = (ArrayList<Order>) orderService.getOrdersOfRestaurant(restaurantId);
		HashMap<String, Customer> customersOfRestaurant = new HashMap<String, Customer>();
		for (Order order : ordersOfRestaurant) {
			if (order.getRestaurantOfOrder().getId().equals(restaurantId) && order.getStatus() == OrderStatus.Dostavljena) {
				Customer customer = userService.getCustomerById(order.getCustomer().getId());
				if (!customersOfRestaurant.containsKey(customer.getId())) {
					customersOfRestaurant.put(customer.getId(), customer);
				}
			}
		}
		return customersOfRestaurant.values();
	}
	
	public Restaurant saveRestaurant(Restaurant restaurant) {
		return rfr.saveRestaurant(restaurant);
	}
	
	public Restaurant deleteRestaurant(String id) {
		UserService userService = new UserService();
		userService.fireManagerOfRestaurant(id);
		return rfr.deleteRestaurant(id);
	}
	
	public Restaurant changeRestaurant(String id, Restaurant newRestaurant) {
		newRestaurant.setDeleted(false);
		Restaurant oldRestaurant = this.findRestaurantById(id);
		if(!newRestaurant.getLogo().equals(oldRestaurant.getLogo())) {
			ImageFileRepository imgFileRepo = new ImageFileRepository();
			String newLogo = imgFileRepo.saveImage(newRestaurant.getLogo());
			newRestaurant.setLogo(newLogo);
		}
		return rfr.changeRestaurant(id, newRestaurant);
	}
}
