package services;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;

import beans.Item;
import fileRepository.ImageFileRepository;
import fileRepository.ItemsFileRepository;

public class ItemService {
	private static ItemsFileRepository ifr = new ItemsFileRepository();
	
	public ItemService() {
	}
	
	public Collection<Item> getAllItems(){
		HashMap<String, Item> validItems = new HashMap<String, Item>(); 
		for(Item item : ifr.getAllItems().values()) {
			if(!item.isDeleted())
				validItems.put(item.getId(), item);
		}
		return validItems.values();
	}
	
	public Item findItemById(String id) {
		HashMap<String, Item> items = ifr.getAllItems();
		Item item = items.get(id);
		if(!item.isDeleted())
			return item;
		else
			return null;
	}
	
	public Item saveItem(Item item) {
		return ifr.saveItem(item);
	}
	
	public Item deleteItem(String id) {
		return ifr.deleteItem(id);
	}
	
	public Item changeItem(String id, Item newItem) {
		//LOGIKA ZA CUVANJE SLIKE UKOLIKO SE PROMENI
		Item oldItem = this.findItemById(id);
		if(!newItem.getImage().equals(oldItem.getImage())) {
			ImageFileRepository imgFileRepo = new ImageFileRepository();
			String newImage = imgFileRepo.saveImage(newItem.getImage());
			newItem.setImage(newImage);
		}
		return ifr.changeItem(id, newItem);
	}
	
	public ArrayList<Item> getAllItemsOfRestaurant(String restaurantId){
		ArrayList<Item> items = new ArrayList<Item>();
		
		for(Item item : this.getAllItems()) {
			if(item.getRestaurant().getId().equals(restaurantId))
				items.add(item);
		}
		
		return items;
	}
	
	public boolean isNameOfItemFree(Item item) {
		for(Item i : this.getAllItemsOfRestaurant(item.getRestaurant().getId())) {
			if(i.getName().equals(item.getName()) && !i.getId().equals(item.getId()))
				return false;
		}
		return true;
	}
}
