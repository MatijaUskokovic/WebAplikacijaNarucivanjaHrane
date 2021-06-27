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
import java.util.Random;

import com.google.gson.Gson;

import beans.Order;

/**
 * Klasa koja služi da interaguje sa trajnim skladištem za narudžbine.
 */
public class OrderFileRepository {

	private String path = "./files/orders.txt";
	private HashMap<String, Order> orders = new HashMap<String, Order>();
	private Gson g = new Gson();
	
	public OrderFileRepository() {
		
	}
	
	public Order getOrder(String id) {
		readOrders();
		return orders.get(id);
	}
	
	public Order changeOrder(Order changedOrder) {
		readOrders();
		writeChangedOrder(changedOrder.getId(), g.toJson(changedOrder));
		return changedOrder;
	}
	
	public void deleteOrder(String id) {
		readOrders();
		Order order = orders.get(id);
		order.setDeleted(true);
		writeChangedOrder(order.getId(), g.toJson(order));
	}
	
	/*
	 * Metoda sluzi za dodavanje narudzbine kojoj prvo doda id i onda pozove metodu za upisivanje u fajl
	 * koja vraca true ako je uspesno dodato
	 */
	public Order addOrder(Order order) {
		order.setId(assignId());
		order.setDeleted(false);
		if (writeOrder(g.toJson(order), true)) {
			return order;
		}
		return null;
	}
	
	private String assignId() {
		String id;
		do {
			Random rand = new Random();
			String allowedChars = "0123456789";
			char[] idChars = new char[10];
			for (int i = 0; i < 10; i++) {
				idChars[i] = allowedChars.charAt(rand.nextInt(allowedChars.length()));
			}
			id = new String(idChars);
		} while(orders.containsKey(id));
		return id;
	}
	
	private void readOrders() {
		orders.clear();
		ArrayList<String> lines = readLines();
		for (String line : lines) {
			Order order = g.fromJson(line, Order.class);
			orders.put(order.getId(), order);
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
	 * Metoda sluzi za upisivanje nove porudzbine u fajl. Drugi parametar sluzi da kaze da li se
	 * fajl iznova pise ili se dodaje novi red (true kada se dodaje novi red)
	 */
	private boolean writeOrder(String orderToWrite, boolean append) {
		try (FileWriter f = new FileWriter(path, append);
				BufferedWriter b = new BufferedWriter(f);
				PrintWriter p = new PrintWriter(b);) {
			p.println(orderToWrite);
			return true;
		} catch (IOException i) {
			i.printStackTrace();
			return false;
		}
	}
	
	private void writeChangedOrder(String idOfChangedOrder, String changedOrder) {
		ArrayList<String> lines = readLines();
		boolean append = false;
		for (String line : lines) {
			Order order = g.fromJson(line, Order.class);
			
			if (order.getId().equals(idOfChangedOrder)) {
				writeOrder(changedOrder, append);
			}else {
				writeOrder(line, append);
			}
			append = true;
		}
	}
}
