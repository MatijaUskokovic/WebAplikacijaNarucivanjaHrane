package services;

import java.util.ArrayList;

import beans.Customer;
import beans.Order;
import fileRepository.OrderFileRepository;

public class OrderService {

	private OrderFileRepository orderRepository= new OrderFileRepository();
	
	public OrderService() {
		
	}
	
	public Iterable<Order> getOrdersWithSpecificStatus(String status){
		ArrayList<Order> orders = new ArrayList<Order>();
		
		for (Order order : orderRepository.getAllOrders()) {
			if(order.getStatus().toString().equals(status)) {
				orders.add(order);
			}
		}
		
		return orders;
	}
	
	public Iterable<Order> getOrdersOfRestaurant(String restaurantId){
		ArrayList<Order> ordersOfRestaurant = new ArrayList<Order>();
		
		for (Order order : orderRepository.getAllOrders()) {
			if (order.getRestaurantOfOrder().getId().equals(restaurantId)) {
				ordersOfRestaurant.add(order);
			}
		}
		
		return ordersOfRestaurant;
	}
	
	public Order getOrder(String id) {
		return orderRepository.getOrder(id);
	}
	
	public Order addOrder(Order newOrder) {
		return orderRepository.addOrder(newOrder);
	}
	
	public Order changeOrder(Order changedOrder) {
		return orderRepository.changeOrder(changedOrder);
	}
	
	public void deleteOrder(String id) {
		orderRepository.deleteOrder(id);
	}
	
	//DODATO ZA BLOKIRANJE KORISNIKA
	public ArrayList<Customer> getAllSuspiciousCustomers(){
		return orderRepository.findAllSuspiciousCustomers();
	}
	
}
