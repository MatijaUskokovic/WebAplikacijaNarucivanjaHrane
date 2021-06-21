package services;

import beans.Customer;
import beans.Deliverer;
import beans.Manager;
import beans.User;
import fileRepository.UserFileRepository;

public class UserService {

	private UserFileRepository userRepository = new UserFileRepository();
	
	public UserService() {
		
	}
	
	public User findUser(String username, String password) {
		User user = userRepository.getUser(username);
		if (user == null || !user.getPassword().equals(password)) {
			return null;
		}
		return user;
	}
	
	// REGISTRACIJA KORISNIKA
	public Customer registerCustomer(User user) {
		return userRepository.registerCustomer(user);
	}
	
	public Manager registerManager(Manager manager) {
		return userRepository.registerManager(manager);
	}
	
	public Deliverer registerDeliverer(Deliverer deliverer) {
		return userRepository.registerDeliverer(deliverer);
	}
	
	// IZMENA KORISNIKA
	public Customer changeCustomer(Customer customer) {
		return userRepository.changeCustomer(customer);
	}
	
	public Manager changeManager(Manager manager) {
		return userRepository.changeManager(manager);
	}
	
	public Deliverer changeDeliverer(Deliverer deliverer) {
		return userRepository.changeDeliverer(deliverer);
	}
	
	// BRISANJE KORISNIKA
	public void deleteUser(String username) {
		userRepository.deleteUser(username);
	}
}
