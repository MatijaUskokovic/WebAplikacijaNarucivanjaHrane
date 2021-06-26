package beans;

/*
 * Reprezentuje jednu stavku u korpi. Stavku cine proizvod i kolicina
 */
public class ShoppingCartItem {
	private Item item;
	private int count;
	private double totalPrice;
	
	public ShoppingCartItem() {
		
	}
	
	public ShoppingCartItem(Item item, int count) {
		super();
		this.item = item;
		this.count = count;
		calculateTotalPrice();
	}
	
	private void calculateTotalPrice() {
		this.totalPrice = this.item.getPrice() * this.count;
	}
	
	public Item getItem() {
		return item;
	}
	public void setItem(Item item) {
		this.item = item;
		calculateTotalPrice();
	}
	public int getCount() {
		return count;
	}
	public void setCount(int count) {
		this.count = count;
		calculateTotalPrice();
	}
	public double getTotalPrice() {
		return totalPrice;
	}
	public void setTotalPrice(double totalPrice) {
		this.totalPrice = totalPrice;
	}
}
