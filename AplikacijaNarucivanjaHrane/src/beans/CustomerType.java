package beans;

public class CustomerType {
	private String typeName;
	private int discountPercent;
	private int pointsRequired;
	
	public CustomerType () {
		
	}

	public CustomerType(String typeName, int discountPercent, int pointsRequired) {
		super();
		this.typeName = typeName;
		this.discountPercent = discountPercent;
		this.pointsRequired = pointsRequired;
	}

	public String getTypeName() {
		return typeName;
	}

	public void setTypeName(String typeName) {
		this.typeName = typeName;
	}

	public int getDiscountPercent() {
		return discountPercent;
	}

	public void setDiscountPercent(int discountPercent) {
		this.discountPercent = discountPercent;
	}

	public int getPointsRequired() {
		return pointsRequired;
	}

	public void setPointsRequired(int pointsRequired) {
		this.pointsRequired = pointsRequired;
	}
}
