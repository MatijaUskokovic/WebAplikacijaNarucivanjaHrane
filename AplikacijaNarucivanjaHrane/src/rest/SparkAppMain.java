package rest;

import static spark.Spark.get;
import static spark.Spark.port;
import static spark.Spark.post;
import static spark.Spark.put;
import static spark.Spark.delete;
import static spark.Spark.staticFiles;

import java.io.File;
import java.util.Date;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import beans.Customer;
import beans.Deliverer;
import beans.Item;
import beans.Manager;
import beans.Restaurant;
import beans.User;
import gsonAdapters.DateAdapter;
import services.ItemService;
import services.RestaurantService;
import services.UserService;
import spark.Session;

public class SparkAppMain {

	private static DateAdapter dateAdapter = new DateAdapter();
	private static Gson g = new GsonBuilder().registerTypeAdapter(Date.class, dateAdapter).create();
	
	private static UserService userService = new UserService();
	private static ItemService itemService = new ItemService();
	private static RestaurantService restaurantService = new RestaurantService();
	
	public static void main(String[] args) throws Exception {
		port(8080);

		staticFiles.externalLocation(new File("./static").getCanonicalPath());
		
		get("rest/test", (req, res) -> {
			return "Works";
		});
		
		// REGISTRACIJA KORISNIKA
		post("rest/customers", (req, res) -> {
			res.type("application/json");
			String registrationParams = req.body();
			User userToReg = g.fromJson(registrationParams, User.class);
			Customer customer = userService.registerCustomer(userToReg);
			if (customer == null) {
				return null;
			}
			return g.toJson(customer);	// ovo je 1 opcija, druga je da vrati objeakt user
		});
		
		post("rest/managers", (req, res) -> {
			res.type("application/json");
			String registrationParams = req.body();
			Manager managerToReg = g.fromJson(registrationParams, Manager.class);
			Manager manager = userService.registerManager(managerToReg);
			if (manager == null) {
				return null;
			}
			return g.toJson(manager);
		});
		
		post("rest/deliverers", (req, res) -> {
			res.type("application/json");
			String registrationParams = req.body();
			Deliverer delivererToReg = g.fromJson(registrationParams, Deliverer.class);
			Deliverer deliverer = userService.registerDeliverer(delivererToReg);
			if (deliverer == null) {
				return null;
			}
			return g.toJson(deliverer);
		});
		
		// IZMENA KORISNIKA
		put("rest/customers/:id", (req, res) -> {
			res.type("application/json");
			Customer customer = g.fromJson(req.body(), Customer.class);
			return g.toJson(userService.changeCustomer(customer));
		});
		
		put("rest/managers/:id", (req, res) -> {
			res.type("application/json");
			Manager manager = g.fromJson(req.body(), Manager.class);
			return g.toJson(userService.changeManager(manager));
		});
		
		put("rest/deliverers/:id", (req, res) -> {
			res.type("application/json");
			Deliverer deliverer = g.fromJson(req.body(), Deliverer.class);
			return g.toJson( userService.changeDeliverer(deliverer));
		});
		
		// BRISANJE KORISNIKA
		delete("rest/users/:id", (req, res) -> {
			res.type("application/json");
			User user = g.fromJson(req.body(), User.class);
			userService.deleteUser(user.getUsername());
			return "SUCCESS";
		});
		
		//http://localhost:8080/login
		post("rest/login", (req, res) -> {
			res.type("application/json");
			Session ss = req.session(true);
			String loginParameters = req.body();
			User userToLogIn = g.fromJson(loginParameters, User.class);
			String username = userToLogIn.getUsername();
			String password = userToLogIn.getPassword();
			User user = userService.findUser(username, password);			
			if (user == null) {
				return null;
			}
			else {
				ss.attribute("user", user);
			}
			return g.toJson(user);
		});
		
		get("rest/testlogin", (req, res) -> {
			res.type("application/json");
			Session ss = req.session(true);
			User user = ss.attribute("user");
			
			if (user == null) {
				return null;  
			} else {
				return g.toJson(user);
			}
		});
		
		get("rest/logout", (req, res) -> {
			res.type("application/json");
			Session ss = req.session(true);
			User user = ss.attribute("user");
			
			if (user != null) {
				ss.invalidate();
			}
			return true;
		});
		
		//ITEMS
		post("rest/item", (req, res) -> {
			res.type("application/json");
			Item item = g.fromJson(req.body(), Item.class);
			boolean save = itemService.saveItem(item);
			if(save)
				return "Uspeh";
			else
				return null;
		});
		
		get("rest/items", (req, res) -> {
			return g.toJson(itemService.getAllItems());
		});
		
		//RESTORANTS
		post("rest/restaurant", (req, res) -> {
			res.type("application/json");
			Restaurant restaurant = g.fromJson(req.body(), Restaurant.class);
			boolean save = restaurantService.saveRestaurant(restaurant);
			if(save)
				return "uspeh";
			else
				return null;
		});
		
		get("rest/restaurants", (req, res) -> {
			return g.toJson(restaurantService.getAllRestaurants());
		});
	}
}
