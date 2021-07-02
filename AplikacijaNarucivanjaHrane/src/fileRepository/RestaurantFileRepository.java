package fileRepository;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;

import beans.Adress;
import beans.Item;
import beans.Location;
import beans.Restaurant;
import beans.RestaurantStatus;
import beans.RestaurantType;

/**
 * Klasa koja vrsi manipulaciju rada sa datotekom restaurants.txt <br>
 * NACIN PISANJA U DATOTECI:
 * id,deleted,name,type,status,location(longitude,latitude,street,streetNum,postalCode),logo(relative
 * address)
 * 
 * @author bojan
 */

public class RestaurantFileRepository {
	private static String fileLocation = "files/restaurants.txt";
	private static ImageFileRepository imgfr = new ImageFileRepository();

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
			p.println(getStringFromRestaurantForSaving(restaurant));
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
			restaurantsForWriting.add(this.getStringFromRestaurantForDeletingAndChanging(restaurant));
		}
		
		return restaurantsForWriting;
	}
	
	private String getStringFromRestaurantForSaving(Restaurant restaurant) {
		String logo = imgfr.saveImage(restaurant.getLogo());
		
		return restaurant.getId() + "," + Boolean.toString(restaurant.isDeleted()) + "," + restaurant.getName() + ","
				+ restaurant.getType().toString() + "," + restaurant.getStatus().toString() + ","
				+ getStringFromLocation(restaurant.getLocation()) + "," + logo;
	}
	
	private String getStringFromRestaurantForDeletingAndChanging(Restaurant restaurant) {
		return restaurant.getId() + "," + Boolean.toString(restaurant.isDeleted()) + "," + restaurant.getName() + ","
				+ restaurant.getType().toString() + "," + restaurant.getStatus().toString() + ","
				+ getStringFromLocation(restaurant.getLocation()) + "," + restaurant.getLogo();
	}

	private String getStringFromLocation(Location location) {
		return Double.toString(location.getLongitude()) + "," + Double.toString(location.getLatitude()) + ","
				+ location.getAdress().getStreet() + "," + location.getAdress().getStreetNum() + ","
				+ location.getAdress().getCity() + "," + location.getAdress().getPostalCode();
	}
	
	private Restaurant makeRestaurantFromLine(String line) {
		String[] lineItems = line.split(",");
		
		String id = lineItems[0];
		boolean deleted = Boolean.parseBoolean(lineItems[1]);
		String name = lineItems[2];
		RestaurantType type = this.getRestaurantTypeFromString(lineItems[3]);
		RestaurantStatus status = this.getRestaurantStatusFromString(lineItems[4]);
		Location location = new Location(Double.parseDouble(lineItems[5]), Double.parseDouble(lineItems[6]),
				new Adress(lineItems[7], lineItems[8], lineItems[9], Integer.parseInt(lineItems[10])));
		String logo = lineItems[11];
		ArrayList<Item> items = new ArrayList<Item>();
		
		return new Restaurant(id, deleted, name, type, items, status, location, logo);
	}

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
