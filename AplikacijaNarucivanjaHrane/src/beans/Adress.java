package beans;

public class Adress {

	private String street;
	private String streetNum;
	private String city;
	private int postalCode;
	
	public Adress() {
		
	}
	
	public Adress(String street, String streetNum, String city, int postalCode) {
		super();
		this.street = street;
		this.streetNum = streetNum;
		this.city = city;
		this.postalCode = postalCode;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getStreet() {
		return street;
	}
	public void setStreet(String street) {
		this.street = street;
	}
	public String getStreetNum() {
		return streetNum;
	}
	public void setStreetNum(String streetNum) {
		this.streetNum = streetNum;
	}
	public int getPostalCode() {
		return postalCode;
	}
	public void setPostalCode(int postalCode) {
		this.postalCode = postalCode;
	}
	
	
}
