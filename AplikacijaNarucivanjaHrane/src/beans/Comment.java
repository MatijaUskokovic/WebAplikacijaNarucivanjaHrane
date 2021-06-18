package beans;

public class Comment {
	private Customer customerOfComment;
	private Restaurant restaurantOfComment;
	private String text;
	private int grade;
	
	public Comment() {
		
	}

	public Comment(Customer customerOfComment, Restaurant restaurantOfComment, String text, int grade) {
		super();
		this.customerOfComment = customerOfComment;
		this.restaurantOfComment = restaurantOfComment;
		this.text = text;
		this.grade = grade;
	}

	public Customer getCustomerOfComment() {
		return customerOfComment;
	}

	public void setCustomerOfComment(Customer customerOfComment) {
		this.customerOfComment = customerOfComment;
	}

	public Restaurant getRestaurantOfComment() {
		return restaurantOfComment;
	}

	public void setRestaurantOfComment(Restaurant restaurantOfComment) {
		this.restaurantOfComment = restaurantOfComment;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public int getGrade() {
		return grade;
	}

	public void setGrade(int grade) {
		this.grade = grade;
	}
}
