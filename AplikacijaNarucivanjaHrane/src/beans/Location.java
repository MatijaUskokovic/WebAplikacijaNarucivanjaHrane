package beans;

public class Location {
	private double longitude;
	private double latitude;
	private Adress adress;
	
	public Location() {
		
	}
	
	public Location(double longitude, double latitude, Adress adress) {
		super();
		this.longitude = longitude;
		this.latitude = latitude;
		this.adress = adress;
	}
	public double getLongitude() {
		return longitude;
	}
	public void setLongitude(double longitude) {
		this.longitude = longitude;
	}
	public double getLatitude() {
		return latitude;
	}
	public void setLatitude(double latitude) {
		this.latitude = latitude;
	}
	public Adress getAdress() {
		return adress;
	}
	public void setAdress(Adress adress) {
		this.adress = adress;
	}
}
