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
import beans.UserRole;
import beans.ShoppingCart;
import beans.User;

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
		readUsers();
	}
	
	public ArrayList<User> getUsers(){
		return (ArrayList<User>) users.values();
	}
	
	public User getUser(String username) {
		return users.get(username);
	}
	
	/*
	 * Metoda ce prvo proveriti da li je zauzet prosledjeni username i ukoliko nije cuva novog korisnika
	 */
	public Customer registerCustomer(User user) {
		if (users.containsKey(user.getUsername())) {
			return null;
		}
		Customer newCustomer = new Customer(user);
		newCustomer.setRole(UserRole.Kupac);
		return writeCustomer(newCustomer);
	}
	
	/*
	 * Metoda sluzi za ucitavanje svih entiteta iz txt fajla
	 */
	public void readUsers() {
		BufferedReader in = null;
		try {
			File file = new File(path);
			in = new BufferedReader(new FileReader(file));
			String line;
			
			while ((line = in.readLine()) != null) {
				line = line.trim();
				if (line.equals(""))
					continue;
				
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
					// TODO: KADA SE RAZRADI LOGIKA ZA CUSTOMER TYPE ODRADITI
					//c.setCustomerType(new CustomerType());
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
	}
	
	/*
	 * Metoda sluzi za upisivanje novog kupca u fajl
	 */
	private Customer writeCustomer(Customer customer) {
		try (FileWriter f = new FileWriter(path, true);
				BufferedWriter b = new BufferedWriter(f);
				PrintWriter p = new PrintWriter(b);) {
			p.println(customerToText(customer));
			return customer;
		} catch (IOException i) {
			i.printStackTrace();
			return null;
		}
	}
	
	private String customerToText(Customer customer) {
		return customer.getId() + "," + customer.isDeleted() + "," + customer.getUsername() + "," 
				+ customer.getPassword() + "," + customer.getName() + "," + customer.getSurname() + "," 
				+ customer.getGender() + "," + customer.getDateOfBirth().getTime() + "," 
				+ customer.getRole() + "," + customer.getPointsCollected();
	}
}
