package services;

import beans.Administrator;
import beans.Customer;
import beans.Deliverer;
import beans.Manager;
import beans.User;
import beans.UserRole;
import fileRepository.UserFileRepository;

public class UserService {

	private UserFileRepository userRepository = new UserFileRepository();
	
	public UserService() {
		
	}
	
	public Iterable<Object> getAllUsers(){
		return userRepository.getUsers();
	}
	
	public Iterable<Manager> getAllManagers(){
		return userRepository.getManagers();
	}
	
	public Object getUserByUsername(String username) {
		User user = userRepository.getUser(username);
		if (user == null) {
			return null;
		}
		if (user.getRole() == UserRole.Kupac) {
			return userRepository.getCustomer(username);
		}
		if (user.getRole() == UserRole.Menadzer) {
			return userRepository.getManager(username);
		}
		if (user.getRole() == UserRole.Dostavljac) {
			return userRepository.getDeliverer(username);
		}
		if (user.getRole() == UserRole.Administrator) {
			return userRepository.getAdministrator(username);
		}
		return user;
	}
	
	public Object findUser(String username, String password) {
		User user = userRepository.getUser(username);
		if (user == null || !user.getPassword().equals(password)) {
			return null;
		}
		if (user.getRole() == UserRole.Kupac) {
			return userRepository.getCustomer(username);
		}
		if (user.getRole() == UserRole.Menadzer) {
			return userRepository.getManager(username);
		}
		if (user.getRole() == UserRole.Dostavljac) {
			return userRepository.getDeliverer(username);
		}
		if (user.getRole() == UserRole.Administrator) {
			return userRepository.getAdministrator(username);
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
	
	public Administrator changeAdministrator(Administrator administrator) {
		return userRepository.changeAdministrator(administrator);
	}
	
	// BRISANJE KORISNIKA
	public void deleteUser(String username) {
		userRepository.deleteUser(username);
	}
}
