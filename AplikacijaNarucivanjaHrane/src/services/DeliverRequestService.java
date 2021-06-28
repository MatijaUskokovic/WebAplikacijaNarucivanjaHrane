package services;

import java.util.ArrayList;

import beans.DeliverRequest;
import fileRepository.DeliverRequestFileRepository;

public class DeliverRequestService {

	private DeliverRequestFileRepository requestRepository= new DeliverRequestFileRepository();
	
	public DeliverRequestService() {
		
	}
	
	public Iterable<DeliverRequest> getPendingDeliverRequestsForRestaurant(String resId){
		ArrayList<DeliverRequest> requests = new ArrayList<DeliverRequest>();
		
		for (DeliverRequest request : requestRepository.getAllDeliverRequests()) {
			if (!request.isRejected() && request.getOrder().getRestaurantOfOrder().getId().equals(resId)) {
				requests.add(request);
			}
		}
		return requests;
	}
	
	public DeliverRequest addDeliverRequest(DeliverRequest request) {
		return requestRepository.addRequest(request);
	}
	
	public DeliverRequest changeDeliverRequest(DeliverRequest request) {
		return requestRepository.changeRequest(request);
	}
}
