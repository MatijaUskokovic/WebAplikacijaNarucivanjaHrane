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

import beans.DeliverRequest;

public class DeliverRequestFileRepository {
	private String path = "./files/deliverRequests.txt";
	private HashMap<String, DeliverRequest> deliverRequests = new HashMap<String, DeliverRequest>();
	private Gson g = new Gson();
	
	public DeliverRequestFileRepository() {
		
	}
	
	public Iterable<DeliverRequest> getAllDeliverRequests() {
		readDeliverRequests();
		return deliverRequests.values();
	}
	
	public DeliverRequest getDeliverRequest(String id) {
		readDeliverRequests();
		return deliverRequests.get(id);
	}
	
	public DeliverRequest changeRequest(DeliverRequest changedRequest) {
		readDeliverRequests();
		writeChangedDeliverRequest(changedRequest.getId(), g.toJson(changedRequest));
		return changedRequest;
	}
	
	public void rejectRequest(String id) {
		readDeliverRequests();
		DeliverRequest request = deliverRequests.get(id);
		request.setRejected(true);
		writeChangedDeliverRequest(request.getId(), g.toJson(request));
	}
	
	/*
	 * Metoda sluzi za dodavanje narudzbine kojoj prvo doda id i onda pozove metodu za upisivanje u fajl
	 * koja vraca true ako je uspesno dodato
	 */
	public DeliverRequest addRequest(DeliverRequest request) {
		request.setRejected(false);
		request.setDeleted(false);
		if (writeDeliverRequest(g.toJson(request), true)) {
			return request;
		}
		return null;
	}
	
	private void readDeliverRequests() {
		deliverRequests.clear();
		ArrayList<String> lines = readLines();
		for (String line : lines) {
			DeliverRequest request = g.fromJson(line, DeliverRequest.class);
			if (!request.isDeleted()) {
				deliverRequests.put(request.getId(), request);
			}
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
	 * Metoda sluzi za upisivanje novog zahteva u fajl. Drugi parametar sluzi da kaze da li se
	 * fajl iznova pise ili se dodaje novi red (true kada se dodaje novi red)
	 */
	private boolean writeDeliverRequest(String requestToWrite, boolean append) {
		try (FileWriter f = new FileWriter(path, append);
				BufferedWriter b = new BufferedWriter(f);
				PrintWriter p = new PrintWriter(b);) {
			p.println(requestToWrite);
			return true;
		} catch (IOException i) {
			i.printStackTrace();
			return false;
		}
	}
	
	private void writeChangedDeliverRequest(String idOfChangedRequest, String changedRequest) {
		ArrayList<String> lines = readLines();
		boolean append = false;
		for (String line : lines) {
			DeliverRequest delvierRequest = g.fromJson(line, DeliverRequest.class);
			
			if (delvierRequest.getId().equals(idOfChangedRequest)) {
				writeDeliverRequest(changedRequest, append);
			}else {
				writeDeliverRequest(line, append);
			}
			append = true;
		}
	}
}
