package beans;

import java.util.ArrayList;

public class SuspiciousCustomerDTO {
	private ArrayList<Customer> customers;

	public SuspiciousCustomerDTO() {
		this.customers = new ArrayList<Customer>();
	}

	public ArrayList<Customer> getCustomers() {
		return customers;
	}

	public void setCustomers(ArrayList<Customer> customers) {
		this.customers = customers;
	}
}
