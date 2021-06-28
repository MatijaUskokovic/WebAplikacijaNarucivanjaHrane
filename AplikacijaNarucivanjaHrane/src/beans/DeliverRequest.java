package beans;

import java.util.UUID;

public class DeliverRequest {

	private String id;
	private Deliverer deliverer;
	private Order order;
	private boolean deleted;
	private boolean rejected;

	public DeliverRequest() {
		this.id = UUID.randomUUID().toString();
		this.deliverer = new Deliverer();
		this.order = new Order();
		this.rejected = false;
	}
	
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public Deliverer getDeliverer() {
		return deliverer;
	}
	public void setDeliverer(Deliverer deliverer) {
		this.deliverer = deliverer;
	}
	public Order getOrder() {
		return order;
	}
	public void setOrder(Order order) {
		this.order = order;
	}
	
	public boolean isRejected() {
		return rejected;
	}

	public void setRejected(boolean rejected) {
		this.rejected = rejected;
	}
	
	public boolean isDeleted() {
		return deleted;
	}

	public void setDeleted(boolean deleted) {
		this.deleted = deleted;
	}
}
