package services;

import beans.CustomerType;

public class CustomerTypeService {

	private CustomerType bronzani;
	private CustomerType srebrni;
	private CustomerType zlatni;
	
	public CustomerTypeService() {
		createCustomerTypes();
	}
	
	public CustomerType getAppropriateCustomerType(int points) {
		if (points < srebrni.getPointsRequired()) {
			return bronzani;
		}
		else if (points >= srebrni.getPointsRequired() && points < zlatni.getPointsRequired()) {
			return srebrni;
		}
		else {
			return zlatni;
		}
	}
	
	private void createCustomerTypes() {
		bronzani = new CustomerType("bronzani", 0, 0);
		srebrni = new CustomerType("srebrni", 5, 3000);
		zlatni = new CustomerType("zlatni", 10, 5000);
	}
}
