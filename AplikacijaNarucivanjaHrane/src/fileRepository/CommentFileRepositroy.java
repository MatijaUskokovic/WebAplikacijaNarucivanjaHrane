package fileRepository;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;

import beans.Comment;
import beans.Customer;
import beans.Restaurant;
import services.RestaurantService;

/**
 * Klasa koja vrsi manipulaciju rada sa datotekom comments.txt <br>
 * NACIN PISANJA U DATOTECI: user id; restaurant id; text of comment; grade
 * 
 * NAPOMENA: ZBOG CESTOG KORISCENJA ZAREZA TOKOM PISANJA TEKSTA KOMENTARA
 * SEPARATOR U DATOTECI JE KARAKTER ";"
 * 
 * @author bojan
 */
public class CommentFileRepositroy {

	private static String fileLocation = "files/comments.txt";
	private static RestaurantService restaurantService = new RestaurantService();

	public CommentFileRepositroy() {
	}
	
	/**
	 * Metoda vrsi citanje svih komentara u datoteci i upisuje ih u listu
	 * */
	public ArrayList<Comment> getAllComments() {
		ArrayList<Comment> comments = new ArrayList<Comment>();
		BufferedReader in = null;
		String line;
		try {
			in = new BufferedReader(new FileReader(new File(fileLocation)));
			while ((line = in.readLine()) != null) {
				Comment comment = makeCommentFromLine(line);
				comments.add(comment);
			}
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (in != null) {
				try {
					in.close();
				} catch (Exception e) {
				}
			}
		}
		return comments;
	}
	
	/**
	 *Metoda vrsi upis komentara u datoteku 
	 * */
	public Comment saveComment(Comment comment) {
		try (FileWriter f = new FileWriter(fileLocation, true);
				BufferedWriter b = new BufferedWriter(f);
				PrintWriter p = new PrintWriter(b);) {
			p.println(getStringFromComment(comment));
			return comment;
		} catch (IOException i) {
			i.printStackTrace();
			return null;
		}
	}

	private String getStringFromComment(Comment comment) {
		return comment.getCustomerOfComment().getId() + ";" + comment.getRestaurantOfComment().getId() + ";"
				+ comment.getText() + ";" + Integer.toString(comment.getGrade());
	}
	
	//TODO: find user by Id
	private Comment makeCommentFromLine(String line) {
		String[] lineItems = line.split(";");
		Customer customer = new Customer();
		Restaurant restaurant = restaurantService.getRestaurantWithoutItemsAndGrade(lineItems[1]);

		customer.setId(lineItems[0]);

		String text = lineItems[2];
		int grade = Integer.parseInt(lineItems[3]);
		return new Comment(customer, restaurant, text, grade);
	}
}
