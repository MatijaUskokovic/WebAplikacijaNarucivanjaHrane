package services;

import java.util.Collection;

import beans.Item;
import fileRepository.ItemsFileRepository;

public class ItemService {
	private static ItemsFileRepository ifr = new ItemsFileRepository();
	
	public ItemService() {
	}
	
	public Collection<Item> getAllItems(){
		return ifr.getAllItems().values();
	}
	
	public boolean saveItem(Item item) {
		return ifr.saveItem(item);
	}
	
}
