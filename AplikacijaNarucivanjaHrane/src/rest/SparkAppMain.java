package rest;

import static spark.Spark.delete;
import static spark.Spark.get;
import static spark.Spark.port;
import static spark.Spark.post;
import static spark.Spark.put;
import static spark.Spark.staticFiles;

import java.io.File;
import java.util.Date;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import beans.Administrator;
import beans.Comment;
import beans.Customer;
import beans.DeliverRequest;
import beans.Deliverer;
import beans.Item;
import beans.Manager;
import beans.Order;
import beans.Restaurant;
import beans.ShoppingCartItem;
import beans.User;
import gsonAdapters.DateAdapter;
import services.CommentService;
import services.DeliverRequestService;
import services.ItemService;
import services.OrderService;
import services.RestaurantService;
import services.UserService;
import spark.Session;

public class SparkAppMain {

	private static DateAdapter dateAdapter = new DateAdapter();
	private static Gson g = new GsonBuilder().registerTypeAdapter(Date.class, dateAdapter).create();

	private static UserService userService = new UserService();
	private static ItemService itemService = new ItemService();
	private static RestaurantService restaurantService = new RestaurantService();
	private static CommentService commentService = new CommentService();
	private static OrderService orderService = new OrderService();
	private static DeliverRequestService deliverRequestService = new DeliverRequestService();

	public static void main(String[] args) throws Exception {
		port(8080);

		staticFiles.externalLocation(new File("./static").getCanonicalPath());

		get("rest/test", (req, res) -> {
			return "Works";
		});

		// DOBABLJANJE SVIH KORISNIKA
		get("rest/users", (req, res) -> {
			res.type("application/json");
			return g.toJson(userService.getAllUsers());
		});
		
		// DOBAVLJANJE SVIH MENADZERA
		get("rest/managers", (req, res) -> {
			res.type("application/json");
			return g.toJson(userService.getAllManagers());
		});

		// DOPAVLJANJE ODREDJENOG KORISNIKA
		get("rest/users/:username", (req, res) -> {
			res.type("application/json");
			String username = req.params("username");
			return g.toJson(userService.getUserByUsername(username));
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
			return g.toJson(customer); // ovo je 1 opcija, druga je da vrati objeakt user
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
			Session ss = req.session();
			Object user = ss.attribute("user");
			if (user.getClass() == Customer.class) {
				for (ShoppingCartItem scItem : customer.getShoppingCart().getItems()) {
					scItem.calculateTotalPrice();
				}
				customer.getShoppingCart().CalculateTotalPrice();
				ss.attribute("user", customer);
			}
			return g.toJson(userService.changeCustomer(customer));
		});

		put("rest/managers/:id", (req, res) -> {
			res.type("application/json");
			Manager manager = g.fromJson(req.body(), Manager.class);
			Session ss = req.session();
			Object user = ss.attribute("user");
			if (user.getClass() == Manager.class) {
				ss.attribute("user", manager);
			}
			return g.toJson(userService.changeManager(manager));
		});

		put("rest/deliverers/:id", (req, res) -> {
			res.type("application/json");
			Deliverer deliverer = g.fromJson(req.body(), Deliverer.class);
			Session ss = req.session();
			Object user = ss.attribute("user");
			if (user.getClass() == Deliverer.class) {
				ss.attribute("user", deliverer);
			}
			return g.toJson(userService.changeDeliverer(deliverer));
		});
		
		put("rest/administrators/:id", (req, res) -> {
			res.type("application/json");
			Administrator administrator = g.fromJson(req.body(), Administrator.class);
			Session ss = req.session();
			Object user = ss.attribute("user");
			if (user.getClass() == Administrator.class) {
				ss.attribute("user", administrator);
			}
			return g.toJson(userService.changeAdministrator(administrator));
		});

		// BRISANJE KORISNIKA
		delete("rest/users/:id", (req, res) -> {
			res.type("application/json");
			User user = g.fromJson(req.body(), User.class);
			userService.deleteUser(user.getUsername());
			return "SUCCESS";
		});

		// http://localhost:8080/login
		post("rest/login", (req, res) -> {
			res.type("application/json");
			Session ss = req.session(true);
			User userToLogIn = g.fromJson(req.body(), User.class);
			String username = userToLogIn.getUsername();
			String password = userToLogIn.getPassword();
			Object user = userService.findUser(username, password);
			if (user == null) {
				return null;
			} else {
				ss.attribute("user", user);
			}
			return g.toJson(user);
		});

		get("rest/getLoggedUser", (req, res) -> {
			res.type("application/json");
			Session ss = req.session(true);
			User user = (User) ss.attribute("user");
			if (user == null) {
				return null;
			} else {
				Object retUser = userService.findUser(user.getUsername(), user.getPassword());
				return g.toJson(retUser);
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

		// ITEMS
		post("rest/items", (req, res) -> {
			res.type("application/json");
			Item item = g.fromJson(req.body(), Item.class);
			if (itemService.isNameOfItemFree(item)) {
				return g.toJson(
						restaurantService.findRestaurantById(itemService.saveItem(item).getRestaurant().getId()));
			} else
				return null;
		});

		get("rest/items", (req, res) -> {
			res.type("application/json");
			return g.toJson(itemService.getAllItems());
		});

		delete("rest/items/:id", (req, res) -> {
			res.type("application/json");
			String itemId = req.params(":id");
			Item item = itemService.deleteItem(itemId);
			return g.toJson(restaurantService.findRestaurantById(item.getRestaurant().getId()));
		});

		put("rest/items", (req, res) -> {
			res.type("application/json");
			Item newItem = g.fromJson(req.body(), Item.class);
			String id = newItem.getId();

			if (itemService.isNameOfItemFree(newItem)) {
				return g.toJson(restaurantService
						.findRestaurantById(itemService.changeItem(id, newItem).getRestaurant().getId()));
			} else
				return null;
		});

		// RESTORANTS
		post("rest/restaurants", (req, res) -> {
			res.type("application/json");
			Restaurant restaurant = g.fromJson(req.body(), Restaurant.class);
			return g.toJson(restaurantService.saveRestaurant(restaurant));
		});

		get("rest/restaurants", (req, res) -> {
			res.type("application/json");
			return g.toJson(restaurantService.getAllRestaurants());
		});

		// dodavanje id-a selektovanog restorana na sesiju
		post("rest/selectedRestaurant", (req, res) -> {
			res.type("application/json");
			Restaurant restaurant = g.fromJson(req.body(), Restaurant.class);
			restaurantService.setIdOfSelectedRestaurant(restaurant.getId());
			return g.toJson(restaurant);
		});
		
		// preuzimanje id-a selektovanog restorana sa sesije i slanje tog restorana
		get("rest/selectedRestaurant", (req, res) -> {
			res.type("application/json");
			String id = restaurantService.getIdOfSelectedRestaurant();
			if (id == null) {
				return null;
			}
			return g.toJson(restaurantService.findRestaurantById(id));
		});
		
		// DODAT ZAHTEV
		get("rest/restaurants/:id", (req, res) -> {
			res.type("application/json");
			String id = req.params(":id");
			return g.toJson(restaurantService.findRestaurantById(id));
		});

		delete("rest/restaurants/:id", (req, res) -> {
			res.type("application/json");
			return g.toJson(restaurantService.deleteRestaurant(req.params(":id")));
		});

		put("rest/restaurants", (req, res) -> {
			res.type("application/json");
			Restaurant newRestaurant = g.fromJson(req.body(), Restaurant.class);
			String id = newRestaurant.getId();
			return g.toJson(restaurantService.changeRestaurant(id, newRestaurant));
		});

		// COMMENTS
		get("rest/comments", (req, res) -> {
			res.type("application/json");
			return g.toJson(commentService.getAllComments());
		});

		post("rest/comments", (req, res) -> {
			res.type("application/json");
			Comment comment = g.fromJson(req.body(), Comment.class);
			return g.toJson(commentService.saveComment(comment));
		});

		// PORUDZBINE
		// nova
		post("rest/orders", (req, res) -> {
			res.type("application/json");
			Order newOrder = g.fromJson(req.body(), Order.class);
			Order addedOrder = orderService.addOrder(newOrder);
			if (addedOrder == null) {
				return null;
			}
			return g.toJson(addedOrder);
		});

		// izmena
		put("rest/orders/:id", (req, res) -> {
			res.type("application/json");
			Order order = g.fromJson(req.body(), Order.class);
			return g.toJson(orderService.changeOrder(order));
		});

		// brisanje
		delete("rest/orders/:id", (req, res) -> {
			res.type("application/json");
			Order order = g.fromJson(req.body(), Order.class);
			orderService.deleteOrder(order.getId());
			return "SUCCESS";
		});
		
		// sve porudzbine odredjenog statusa
		get("rest/orders/:status", (req, res) -> {
			res.type("application/json");
			return g.toJson(orderService.getOrdersWithSpecificStatus(req.params(":status")));
		});
		
		// sve porudzbine odredjenog restorana
		get("rest/ordersOfRestaurant/:id", (req, res) -> {
			res.type("application/json");
			return g.toJson(orderService.getOrdersOfRestaurant(req.params(":id")));
		});
		
		// ZAHTEVI ZA PORUDZBINE
		// dobavljanje zahteva za odredjenog menadzera
		get("rest/deliverRequests/:restaurantId", (req, res) -> {
			res.type("application/json");
			return g.toJson(deliverRequestService.getPendingDeliverRequestsForRestaurant(req.params(":restaurantId")));
		
		});
		
		// novi
		post("rest/deliverRequests", (req, res) -> {
			res.type("application/json");
			DeliverRequest newRequest = g.fromJson(req.body(), DeliverRequest.class);
			DeliverRequest addedRequest = deliverRequestService.addDeliverRequest(newRequest);
			if (addedRequest == null) {
				return null;
			}
			return g.toJson(addedRequest);
		});
		
		// izmena
		put("rest/deliverRequests/:id", (req, res) -> {
			res.type("application/json");
			DeliverRequest request = g.fromJson(req.body(), DeliverRequest.class);
			return g.toJson(deliverRequestService.changeDeliverRequest(request));
		});
	}
}
