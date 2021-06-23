package services;

import beans.Order;
import fileRepository.OrderFileRepository;

public class OrderService {

	private OrderFileRepository orderRepository= new OrderFileRepository();
	
	public OrderService() {
		
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
}
