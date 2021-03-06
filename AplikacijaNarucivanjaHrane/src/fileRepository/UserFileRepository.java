package fileRepository;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;

import beans.Administrator;
import beans.Customer;
import beans.Deliverer;
import beans.Gender;
import beans.Manager;
import beans.Order;
import beans.Restaurant;
import beans.ShoppingCart;
import beans.User;
import beans.UserRole;
import services.CustomerTypeService;
import services.OrderService;
import services.RestaurantService;
import services.ShoppingCartService;

/**
 * Klasa koja služi da interaguje sa trajnim skladištem za korisnike.
 */
public class UserFileRepository {

	private String path = "./files/users.txt";
	private HashMap<String, User> users = new HashMap<String, User>();
	private HashMap<String, Customer> customers = new HashMap<String, Customer>();
	private HashMap<String, Administrator> administrators = new HashMap<String, Administrator>();
	private HashMap<String, Deliverer> deliverers = new HashMap<String, Deliverer>();
	private HashMap<String, Manager> managers = new HashMap<String, Manager>();
	
	public UserFileRepository() {
		
	}
	
	public Iterable<Object> getUsers(){
		readUsers();
		ArrayList<Object> users = new ArrayList<Object>();
		users.addAll(administrators.values());
		users.addAll(customers.values());
		users.addAll(deliverers.values());
		users.addAll(managers.values());
		return users;
	}
	
	public Iterable<Manager> getManagers(){
		readUsers();
		return managers.values();
	}
	
	public Iterable<Customer> getCustomers() {
		readUsers();
		return customers.values();
	}
	
	public User getUser(String username) {
		readUsers();
		return users.get(username);
	}
	
	//**********Ne radi se ponovno ucitavanje podataka jer se ovo uvek poziva odmah nakog getUser//
	public Customer getCustomer(String username) {
		return customers.get(username);
	}
	
	public Manager getManager(String username) {
		return managers.get(username);
	}
	
	public Deliverer getDeliverer(String username) {
		return deliverers.get(username);
	}
	
	public Administrator getAdministrator(String username) {
		return administrators.get(username);
	}
	//**********//
	
	public void deleteUser(String username) {
		readUsers();
		User userToDelete = users.get(username);
		UserRole role = userToDelete.getRole();
		if (role == UserRole.Kupac) {
			Customer customer = customers.get(username);
			customer.setDeleted(true);
			writeChangedUser(customer.getId(), customerToText(customer));
			return;
		}else if (role == UserRole.Dostavljac) {
			Deliverer deliverer = deliverers.get(username);
			deliverer.setDeleted(true);
			writeChangedUser(deliverer.getId(), delivererToText(deliverer));
			return;
		}else if (role == UserRole.Menadzer) {
			Manager manager = managers.get(username);
			manager.setDeleted(true);
			writeChangedUser(manager.getId(), managerToText(manager));
			return;
		}
	}
	
	/*
	 * Metoda ce prvo proveriti da li je zauzet prosledjeni username i ukoliko nije cuva novog korisnika
	 */
	public Customer registerCustomer(User user) {
		readUsers();
		if (users.containsKey(user.getUsername())) {
			Customer c = new Customer();
			c.setUsername("-1");	// ako je username zauzet vrati -1 u tom polju
			return c;
		}
		Customer newCustomer = new Customer(user);
		newCustomer.setRole(UserRole.Kupac);
		if (writeUser(customerToText(newCustomer), true)) {
			return newCustomer;
		}
		return null;
	}
	
	public Manager registerManager(Manager manager) {
		readUsers();
		manager.setRole(UserRole.Menadzer);
		if (users.containsKey(manager.getUsername())){
			Manager m = new Manager();
			m.setUsername("-1");
			return m;
		}
		if (writeUser(managerToText(manager), true)) {
			return manager;
		}
		return null;
	}
	
	public Deliverer registerDeliverer(Deliverer deliverer) {
		readUsers();
		deliverer.setRole(UserRole.Dostavljac);
		if (users.containsKey(deliverer.getUsername())) {
			Deliverer d = new Deliverer();
			d.setUsername("-1");
			return d;
		}
		if (writeUser(delivererToText(deliverer), true)) {
			return deliverer;
		}
		return null;
	}
	
	/*
	 * Metoda sluzi za izmenu korisnika u fajlu
	 */
	public Customer changeCustomer(Customer customer) {
		readUsers();
		String id = customer.getId();
		User user = users.get(customer.getUsername());
		
		// provera da li je korisnicko ime vec zauzeto a da to nije taj isti korisnik
		if (user != null && users.containsKey(customer.getUsername()) && !id.equals(user.getId())) {
			customer.setUsername("-1");	// ako je username zauzet vrati -1 u tom polju
			return customer;
		}
		writeChangedUser(customer.getId(), customerToText(customer));
		return customer;
	}
	
	public Manager changeManager(Manager manager) {
		readUsers();
		String id = manager.getId();
		User user = users.get(manager.getUsername());
		
		// provera da li je korisnicko ime vec zauzeto a da to nije taj isti korisnik
		if (user != null && users.containsKey(manager.getUsername()) && !id.equals(user.getId())) {
			manager.setUsername("-1");	// ako je username zauzet vrati -1 u tom polju
			return manager;
		}
		writeChangedUser(manager.getId(), managerToText(manager));
		return manager;
	}
	
	public Deliverer changeDeliverer(Deliverer deliverer) {
		readUsers();
		String id = deliverer.getId();
		User user = users.get(deliverer.getUsername());
		
		// provera da li je korisnicko ime vec zauzeto a da to nije taj isti korisnik
		if (user != null && users.containsKey(deliverer.getUsername()) && !id.equals(user.getId())) {
			deliverer.setUsername("-1");	// ako je username zauzet vrati -1 u tom polju
			return deliverer;
		}
		writeChangedUser(deliverer.getId(), delivererToText(deliverer));
		return deliverer;
	}
	
	public Administrator changeAdministrator(Administrator administrator) {
		readUsers();
		String id = administrator.getId();
		User user = users.get(administrator.getUsername());
		
		// provera da li je korisnicko ime vec zauzeto a da to nije taj isti korisnik
		if (user != null && users.containsKey(administrator.getUsername()) && !id.equals(user.getId())) {
			administrator.setUsername("-1");	// ako je username zauzet vrati -1 u tom polju
			return administrator;
		}
		writeChangedUser(administrator.getId(), administratorToText(administrator));
		return administrator;
	}
	
	/*
	 * Metoda sluzi za ucitavanje svih entiteta iz txt fajla
	 */
	public void readUsers() {
		clearHashMaps();
		ArrayList<String> lines = readLines();
		for (String line : lines) {
			String[] data = line.split(",");
			String id = data[0];
			boolean deleted = Boolean.parseBoolean(data[1]);
			boolean blocked = Boolean.parseBoolean(data[2]);
			String username = data[3];
			String password = data[4];
			String name = data[5];
			String surname = data[6];
			Gender gender = Gender.valueOf(data[7]);
			Date dateOfBirth = new Date(Long.parseLong(data[8]));
			UserRole role = UserRole.valueOf(data[9]);
			
			// ukolko je korisnik logicki obrisan
			if (deleted) {
				continue;
			}
			
			User user = new User(id, deleted, blocked, username, password, name, surname, gender, dateOfBirth, role);
			users.put(user.getUsername(), user);
			
			// formiranje konkretnih korisnika
			if (role == UserRole.Administrator) {
				Administrator a = new Administrator(user);
				administrators.put(a.getUsername(), a);
			}
			else if (role == UserRole.Kupac) {
				int pointsCollected = Integer.parseInt(data[10]);
				String ordersText = "";
				Customer c = new Customer(user);
				try {
					ordersText = data[11];
					if (ordersText != null && ordersText != "") {
						String[] idsOfOrders = ordersText.split(";");
						OrderService os = new OrderService();
						for (String orderId : idsOfOrders) {
							c.getAllOrders().add(os.getOrder(orderId));
						}
					}
				} catch(Exception e) {
					
				}
				ShoppingCartService scService = new ShoppingCartService();
				ShoppingCart sc = scService.getShoppingCartOfUser(id);
				if (sc == null) {
					sc = new ShoppingCart();
					sc.setCustomerId(id);
				}
				c.setShoppingCart(sc);
				c.setPointsCollected(pointsCollected);
				CustomerTypeService typeService = new CustomerTypeService();
				c.setType(typeService.getAppropriateCustomerType(pointsCollected));
				
				customers.put(c.getUsername(), c);
			}
			else if (role == UserRole.Menadzer) {
				String restaurantId = data[10];
				Manager m = new Manager(user);
				if (restaurantId.equals("-1")) {
					m.setRestaurant(new Restaurant());
					m.getRestaurant().setId(restaurantId);
				} else {
					RestaurantService rs = new RestaurantService();
					m.setRestaurant(rs.findRestaurantById(restaurantId));
				}
				managers.put(m.getUsername(), m);
			}
			else if (role == UserRole.Dostavljac) {
				String ordersText = "";
				Deliverer d = new Deliverer(user);
				try {
					ordersText = data[10];
					if (ordersText != null && ordersText != "") {
						String[] idsOfOrders = ordersText.split(";");
						OrderService os = new OrderService();
						for (String orderId : idsOfOrders) {
							d.getOrdersToDeliver().add(os.getOrder(orderId));
						}
					}
				} catch(Exception e) {
					
				}
				
				deliverers.put(d.getUsername(), d);
			}
		}
	}
	
	private void clearHashMaps() {
		users.clear();
		customers.clear();
		administrators.clear();
		deliverers.clear();
		managers.clear();
	}
	
	private ArrayList<String> readLines() {
		ArrayList<String> lines = new ArrayList<>();
		BufferedReader in = null;
		try {
			File file = new File(path);
			in = new BufferedReader(new FileReader(file));
			String line;
			
			while ((line = in.readLine()) != null) {
				line = line.trim();
				if (line.equals(""))
					continue;
				
				lines.add(line);
			}
		} catch(Exception e) {
			e.printStackTrace();
		}
		finally {
			if ( in != null ) {
				try {
					in.close();
				}
				catch (Exception e) { }
			}
		}
		return lines;
	}
	
	/*
	 * Metoda sluzi za upisivanje novog korisnika u fajl. Drugi parametar sluzi da kaze da li se
	 * fajl iznova pise ili se dodaje novi red
	 */
	private boolean writeUser(String userToWrite, boolean append) {
		try (FileWriter f = new FileWriter(path, append);
				BufferedWriter b = new BufferedWriter(f);
				PrintWriter p = new PrintWriter(b);) {
			p.println(userToWrite);
			return true;
		} catch (IOException i) {
			i.printStackTrace();
			return false;
		}
	}
	
	private void writeChangedUser(String idOfChangedUser, String changedUser) {
		ArrayList<String> lines = readLines();
		boolean append = false;
		for (String line : lines) {
			String[] data = line.split(",");
			String id = data[0];
			
			if (id.equals(idOfChangedUser)) {
				writeUser(changedUser, append);
			}else {
				writeUser(line, append);
			}
			append = true;
		}
	}

	/*
	 * Sve ispod metode sluze za formirane stringa od korisnika za upis u txt fajl 
	 */
	private String customerToText(Customer customer) {
		StringBuilder customerString = new StringBuilder("");
		customerString.append(customer.getId() + "," + customer.isDeleted() + "," + customer.isBlocked() + ","
				+ customer.getUsername() + "," 
				+ customer.getPassword() + "," + customer.getName() + "," + customer.getSurname() + "," 
				+ customer.getGender() + "," + customer.getDateOfBirth().getTime() + "," 
				+ customer.getRole() + "," + customer.getPointsCollected() + ",");
		
		for (Order order : customer.getAllOrders()) {
			customerString.append(order.getId());
			customerString.append(";");
		}
		customerString.deleteCharAt(customerString.length() - 1);
		
		return customerString.toString();
	}
	
	private String managerToText(Manager manager) {
		StringBuilder managerString = new StringBuilder("");
		managerString.append(manager.getId() + "," + manager.isDeleted() + "," + manager.isBlocked() + ","
				+ manager.getUsername() + "," 
				+ manager.getPassword() + "," + manager.getName() + "," + manager.getSurname() + "," 
				+ manager.getGender() + "," + manager.getDateOfBirth().getTime() + "," 
				+ manager.getRole() + ",");
		if (manager.getRestaurant() == null) {
			managerString.append("-1");
		}else {
			managerString.append(manager.getRestaurant().getId());
		}
		return managerString.toString();
	}
	
	private String delivererToText(Deliverer deliverer) {
		StringBuilder delivererString = new StringBuilder("");
		delivererString.append(deliverer.getId() + "," + deliverer.isDeleted() + "," + deliverer.isBlocked() + ","
				+ deliverer.getUsername() + "," 
				+ deliverer.getPassword() + "," + deliverer.getName() + "," + deliverer.getSurname() + "," 
				+ deliverer.getGender() + "," + deliverer.getDateOfBirth().getTime() + "," 
				+ deliverer.getRole() + ",");
		for (Order o : deliverer.getOrdersToDeliver()) {
			delivererString.append(o.getId());
			delivererString.append(";");
		}
		delivererString.deleteCharAt(delivererString.length() - 1);
		
		return delivererString.toString();
	}
	
	private String administratorToText(Administrator administrator) {
		return administrator.getId() + "," + administrator.isDeleted() + "," + administrator.isBlocked() + ","
				+ administrator.getUsername() + "," 
				+ administrator.getPassword() + "," + administrator.getName() + "," + administrator.getSurname() + "," 
				+ administrator.getGender() + "," + administrator.getDateOfBirth().getTime() + "," 
				+ administrator.getRole();
	}
}
