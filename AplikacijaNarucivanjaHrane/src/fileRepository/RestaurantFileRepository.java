package fileRepository;

import java.awt.Image;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;

import javax.swing.ImageIcon;

import beans.Item;
import beans.Location;
import beans.Restaurant;
import beans.RestaurantStatus;
import beans.RestaurantType;
import services.ItemService;

/**
 * Klasa koja vrsi manipulaciju rada sa datotekom restaurants.txt <br>
 * NACIN PISANJA U DATOTECI:
 * id,deleted,name,type,status,location(longitude,latitude,address),logo(relative
 * address)
 * 
 * @author bojan
 */

//TODO: logo je null treba ispraviti
public class RestaurantFileRepository {
	private static String fileLocation = "files/restaurants.txt";

	public RestaurantFileRepository() {
	}

	/**
	 * Cita restorane iz datoteke i smesta ih u mapu. Kljuc je id proizvoda.
	 * 
	 */
	public HashMap<String, Restaurant> getAllRestaurants() {
		HashMap<String, Restaurant> restaurants = new HashMap<String, Restaurant>();
		BufferedReader in = null;
		String line;
		try {
			in = new BufferedReader(new FileReader(new File(fileLocation)));
			while ((line = in.readLine()) != null) {
				Restaurant restaurant = makeRestaurantFromLine(line);
				restaurants.put(restaurant.getId(), restaurant);
			}
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (in != null) {
				try {
					in.close();
				} catch (Exception e) {
				}
			}
		}
		return restaurants;
	}
	
	/**
	 * Metoda upisuje novi restoran u fajl
	 * 
	 * */
	public Restaurant saveRestaurant(Restaurant restaurant) {
		try (FileWriter f = new FileWriter(fileLocation, true);
				BufferedWriter b = new BufferedWriter(f);
				PrintWriter p = new PrintWriter(b);) {
			p.println(getStringFromRestaurant(restaurant));
			return restaurant;
		} catch (IOException i) {
			i.printStackTrace();
			return null;
		}
	}
	
	/**
	 * Metoda vrsi izmenu restorana sa prosledjenim id-jem
	 * 
	 * */
	public Restaurant changeRestaurant(String id, Restaurant newRestaurant) {
		HashMap<String, Restaurant> restaurants = this.getAllRestaurants();
		
		Restaurant oldRestaurant = restaurants.get(id);
		restaurants.replace(id, oldRestaurant, newRestaurant);
		writteAllRestaurantsInFile(restaurants);
		
		return newRestaurant;
	} 
	
	/**
	 * Metoda vrsi logicko brisanje restorana ciji je id prosledjen
	 * 
	 * */
	public Restaurant deleteRestaurant(String id) {
		HashMap<String, Restaurant> restaurants = this.getAllRestaurants();
		
		Restaurant restaurantForDeleting = restaurants.get(id);
		restaurantForDeleting.setDeleted(true);
		
		writteAllRestaurantsInFile(restaurants);
		
		return restaurantForDeleting;
	}
	
	private void writteAllRestaurantsInFile(HashMap<String, Restaurant> restaurants) {
		FileWriter fileWriter = null;
		ArrayList<String> restaurantsForWritting = getAllRestaurantsForWriting(restaurants);
		try {
			fileWriter = new FileWriter(fileLocation);
			for(String restaurant : restaurantsForWritting) {
				fileWriter.write(restaurant);
				fileWriter.write("\n");
			}
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if(fileWriter != null) {
				try {
					fileWriter.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
	}

	private ArrayList<String> getAllRestaurantsForWriting(HashMap<String, Restaurant> restaurants) {
		ArrayList<String> restaurantsForWriting = new ArrayList<String>();
		
		for(Restaurant restaurant : restaurants.values()) {
			restaurantsForWriting.add(this.getStringFromRestaurant(restaurant));
		}
		
		return restaurantsForWriting;
	}
	
	private String getStringFromRestaurant(Restaurant restaurant) {
		return restaurant.getId() + "," + Boolean.toString(restaurant.isDeleted()) + "," + restaurant.getName() + ","
				+ restaurant.getType().toString() + "," + restaurant.getStatus().toString() + ","
				+ getStringFromLocation(restaurant.getLocation()) + "," + "logo";
	}

	private String getStringFromLocation(Location location) {
		return Double.toString(location.getLongitude()) + "," + Double.toString(location.getLatitude()) + ","
				+ location.getAdress();
	}
	
	private Restaurant makeRestaurantFromLine(String line) {
		String[] lineItems = line.split(",");
		
		String id = lineItems[0];
		boolean deleted = Boolean.parseBoolean(lineItems[1]);
		String name = lineItems[2];
		RestaurantType type = this.getRestaurantTypeFromString(lineItems[3]);
		RestaurantStatus status = this.getRestaurantStatusFromString(lineItems[4]);
		Location location = new Location(Double.parseDouble(lineItems[5]), Double.parseDouble(lineItems[6]),
				lineItems[7]);
		//Image logo = this.getImageFromString(lineItems[8]);
		ArrayList<Item> items = addAllItemsInRestaurant(id);
		
		return new Restaurant(id, deleted, name, type, items, status, location, null);
	}
	
	private ArrayList<Item> addAllItemsInRestaurant(String restaurantId){
		ItemService is = new ItemService();
		
		ArrayList<Item> items = new ArrayList<Item>();
		for(Item item : is.getAllItems()) {
			if(restaurantId.equals(item.getRestaurant().getId()))
				items.add(item);
		}
		
		return items;
	}

//	private Image getImageFromString(String imagePath) {
//		ImageIcon icon = new ImageIcon(imagePath);
//		return icon.getImage();
//	}

	private RestaurantType getRestaurantTypeFromString(String type) {
		if (type.equals("Italijanski"))
			return RestaurantType.Italijanski;
		else if (type.equals("Kineski"))
			return RestaurantType.Kineski;
		else if (type.equals("Rostilj"))
			return RestaurantType.Rostilj;
		else
			return RestaurantType.Meksicki;
	}

	private RestaurantStatus getRestaurantStatusFromString(String status) {
		if (status.equals("Radi"))
			return RestaurantStatus.Radi;
		else
			return RestaurantStatus.Ne_radi;
	}
}