package services;

import java.util.ArrayList;

import beans.Comment;
import fileRepository.CommentFileRepositroy;

public class CommentService {
	private static CommentFileRepositroy cfr = new CommentFileRepositroy();

	public CommentService() {
	}
	
	public ArrayList<Comment> getAllComments(){
		return cfr.getAllComments();
	}
	
	public Comment saveComment(Comment comment) {
		return cfr.addComment(comment);
	}
	
	public Comment changeComment(Comment comment) {
		return cfr.changeComment(comment);
	}
	
	public ArrayList<Comment> getAllCommentsOfCustomer(String customerId){
		ArrayList<Comment> comments = new ArrayList<Comment>();
		for(Comment comment : this.getAllComments())
			if(comment.getCustomerOfComment().getId().equals(customerId))
				comments.add(comment);
		return comments;
	}
	
	public ArrayList<Comment> getAllCommentsOfRestaurant(String restaurantId){
		ArrayList<Comment> comments = new ArrayList<Comment>();
		for(Comment comment : this.getAllComments()) {
			if (comment != null) {
				if(comment.getRestaurantOfComment().getId().equals(restaurantId))
					comments.add(comment);
			}
		}
		
		return comments;
	}
	
	public double getAvgGradeOfRestaurant(String id) {
		ArrayList<Comment> comments = this.getAllCommentsOfRestaurant(id);
		int numOfComment = 0;
		int sumOfGrade = 0;
		
		if(comments.isEmpty()) {
			return 0;
		}
		
		for(Comment comment : comments) {
			numOfComment++;
			sumOfGrade += comment.getGrade();
		}
		
		return sumOfGrade / numOfComment;
	}
}
