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
		return cfr.saveComment(comment);
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
		for(Comment comment : this.getAllComments())
			if(comment.getRestaurantOfComment().getId().equals(restaurantId))
				comments.add(comment);
		return comments;
	}
}
