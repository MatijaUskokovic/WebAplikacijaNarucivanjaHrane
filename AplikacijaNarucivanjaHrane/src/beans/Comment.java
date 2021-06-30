package beans;

import java.util.UUID;

public class Comment {
	private String id;
	private String text;
	private int grade;
	private boolean processed;
	private boolean approved;
	private Customer customerOfComment;
	private Restaurant restaurantOfComment;
	
	public Comment() {
		this.id = UUID.randomUUID().toString();
		this.processed = false;
		this.approved = false;
	}

	public Comment(Customer customerOfComment, Restaurant restaurantOfComment, String text, int grade) {
		super();
		this.customerOfComment = customerOfComment;
		this.restaurantOfComment = restaurantOfComment;
		this.text = text;
		this.grade = grade;
	}

	public Comment(Customer customerOfComment, Restaurant restaurantOfComment, String text, int grade,
			boolean processed, boolean approved) {
		super();
		this.customerOfComment = customerOfComment;
		this.restaurantOfComment = restaurantOfComment;
		this.text = text;
		this.grade = grade;
		this.processed = processed;
		this.approved = approved;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public boolean isProcessed() {
		return processed;
	}

	public void setProcessed(boolean processed) {
		this.processed = processed;
	}

	public boolean isApproved() {
		return approved;
	}

	public void setApproved(boolean approved) {
		this.approved = approved;
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
