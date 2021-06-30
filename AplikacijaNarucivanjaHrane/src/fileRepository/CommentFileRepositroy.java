package fileRepository;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;

import com.google.gson.Gson;

import beans.Comment;

/**
 * Klasa koja vrsi manipulaciju rada sa datotekom comments.txt <br>

 * @author bojan
 */
public class CommentFileRepositroy {

	private static String path = "files/comments.txt";
	private HashMap<String, Comment> comments = new HashMap<String, Comment>();
	private Gson g = new Gson();
	
	public CommentFileRepositroy() {
	}
	
	public ArrayList<Comment> getAllComments(){
		readComments();
		return new ArrayList<Comment>(comments.values());
	}
	
	public Comment changeComment(Comment comment) {
		readComments();
		writeChangedComment(comment.getId(), g.toJson(comment));
		return comment;
	}
	
	/**
	 *Metoda vrsi upis komentara u datoteku 
	 * */
	public Comment addComment(Comment comment) {
		comment.setProcessed(false);
		comment.setApproved(false);
		if (writeComment(g.toJson(comment), true)) {
			return comment;
		}
		return null;
	}
	
	private void readComments() {
		comments.clear();
		ArrayList<String> lines = readLines();
		for (String line : lines) {
			Comment comment = g.fromJson(line, Comment.class);
			comments.put(comment.getId(), comment);
		}
	}
	
	private ArrayList<String> readLines() {
		ArrayList<String> lines = new ArrayList<>();
		BufferedReader in = null;
		try {
			File file = new File(path);
			in = new BufferedReader(new FileReader(file));
			String line;
			
			while ((line = in.readLine()) != null) {
				line = line.trim();
				if (line.equals(""))
					continue;
				
				lines.add(line);
			}
		} catch(Exception e) {
			e.printStackTrace();
		}
		finally {
			if ( in != null ) {
				try {
					in.close();
				}
				catch (Exception e) { }
			}
		}
		return lines;
	}
	
	/*
	 * Metoda sluzi za upisivanje novog komentara u fajl. Drugi parametar sluzi da kaze da li se
	 * fajl iznova pise ili se dodaje novi red (true kada se dodaje novi red)
	 */
	private boolean writeComment(String commentToWrite, boolean append) {
		try (FileWriter f = new FileWriter(path, append);
				BufferedWriter b = new BufferedWriter(f);
				PrintWriter p = new PrintWriter(b);) {
			p.println(commentToWrite);
			return true;
		} catch (IOException i) {
			i.printStackTrace();
			return false;
		}
	}
	
	private void writeChangedComment(String idOfChangedComment, String changedComment) {
		ArrayList<String> lines = readLines();
		boolean append = false;
		for (String line : lines) {
			Comment comment= g.fromJson(line, Comment.class);
			
			if (comment.getId().equals(idOfChangedComment)) {
				writeComment(changedComment, append);
			}else {
				writeComment(line, append);
			}
			append = true;
		}
	}
}
