package services;

import java.util.Collection;
import java.util.HashMap;

import beans.Item;
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
		newItem.setDeleted(false);
		return ifr.changeItem(id, newItem);
	}
}
