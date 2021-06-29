package services;

import beans.ShoppingCart;
import beans.ShoppingCartItem;
import fileRepository.ShoppingCartFileRepository;

public class ShoppingCartService {

	private ShoppingCartFileRepository scRepository = new ShoppingCartFileRepository();
	
	public ShoppingCartService() {
		
	}
	
	public ShoppingCart getShoppingCartOfUser(String userId) {
		return scRepository.getShoppingCartOfUser(userId);
	}
	
	public ShoppingCart changeOrAddShoppingCart(ShoppingCart sc) {
		ShoppingCart changedSc = scRepository.changeOrAddShoppingCart(sc);
		for (ShoppingCartItem scItem : changedSc.getItems()) {
			scItem.calculateTotalPrice();
		}
		changedSc.CalculateTotalPrice();
		return changedSc;
	}
}
