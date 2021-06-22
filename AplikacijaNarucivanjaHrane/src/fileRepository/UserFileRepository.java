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
import beans.ShoppingCart;
import beans.User;
import beans.UserRole;
import services.CustomerTypeService;

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
	
	public ArrayList<User> getUsers(){
		readUsers();
		return (ArrayList<User>) users.values();
	}
	
	public User getUser(String username) {
		readUsers();
		return users.get(username);
	}
	
	//**********	Ne radi se ponovno ucitavanje podataka jer se ovo uvek poziva odmah nakog getUser//
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
			return null;
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
			return null;
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
			return null;
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
		writeChangedUser(customer.getId(), customerToText(customer));
		return customer;
	}
	
	public Manager changeManager(Manager manager) {
		readUsers();
		writeChangedUser(manager.getId(), managerToText(manager));
		return manager;
	}
	
	public Deliverer changeDeliverer(Deliverer deliverer) {
		readUsers();
		writeChangedUser(deliverer.getId(), delivererToText(deliverer));
		return deliverer;
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
			String username = data[2];
			String password = data[3];
			String name = data[4];
			String surname = data[5];
			Gender gender = Gender.valueOf(data[6]);
			Date dateOfBirth = new Date(Long.parseLong(data[7]));
			UserRole role = UserRole.valueOf(data[8]);
			
			// ukolko je korisnik logicki obrisan
			if (deleted) {
				continue;
			}
			
			User user = new User(id, deleted, username, password, name, surname, gender, dateOfBirth, role);
			users.put(user.getUsername(), user);
			
			// formiranje konkretnih korisnika
			if (role == UserRole.Administrator) {
				Administrator a = new Administrator(user);
				administrators.put(a.getUsername(), a);
			}
			else if (role == UserRole.Kupac) {
				int pointsCollected = Integer.parseInt(data[9]);
				Customer c = new Customer(user);
				// TODO: KADA SE NAPRAVI BAZA ZA PORUDZBINE
				//c.setAllOrders(new ArrayList<Order>);
				c.setShoppingCart(new ShoppingCart());
				c.setPointsCollected(pointsCollected);
				CustomerTypeService typeService = new CustomerTypeService();
				c.setType(typeService.getAppropriateCustomerType(pointsCollected));
				customers.put(c.getUsername(), c);
			}
			else if (role == UserRole.Menadzer) {
				//String restaurantId = data[9];
				Manager m = new Manager(user);
				// TODO : KADA SE NAPRAVI BAZA ZA RESTORANE ODRADITI
				//m.setRestaurant(null);
				managers.put(m.getUsername(), m);
			}
			else if (role == UserRole.Dostavljac) {
				Deliverer d = new Deliverer(user);
				// TODO : KADA SE NAPRAVI BAZA ZA ISPORUKE UCITATI KOJE ISPORUKE TREBA DA ISPORUCI
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
		return customer.getId() + "," + customer.isDeleted() + "," + customer.getUsername() + "," 
				+ customer.getPassword() + "," + customer.getName() + "," + customer.getSurname() + "," 
				+ customer.getGender() + "," + customer.getDateOfBirth().getTime() + "," 
				+ customer.getRole() + "," + customer.getPointsCollected();
	}
	
	private String managerToText(Manager manager) {
		StringBuilder managerString = new StringBuilder("");
		managerString.append(manager.getId() + "," + manager.isDeleted() + "," + manager.getUsername() + "," 
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
		delivererString.append(deliverer.getId() + "," + deliverer.isDeleted() + "," + deliverer.getUsername() + "," 
				+ deliverer.getPassword() + "," + deliverer.getName() + "," + deliverer.getSurname() + "," 
				+ deliverer.getGender() + "," + deliverer.getDateOfBirth().getTime() + "," 
				+ deliverer.getRole() + ",");
		for (Order o : deliverer.getOrdersToDeliver()) {
			delivererString.append(o.getId());
			delivererString.append(";");
		}
		return delivererString.toString();
	}
}
