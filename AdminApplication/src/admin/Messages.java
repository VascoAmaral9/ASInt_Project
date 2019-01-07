package admin;

public class Messages {
	
	private String user_id;
	private String receiver;
	private String dateTime;
	private String message;
	private String type;
	
	

	public String getType() {
		return type;
	}



	public void setType(String type) {
		this.type = type;
	}



	public String getUser_id() {
		return user_id;
	}



	public void setUser_id(String user_id) {
		this.user_id = user_id;
	}



	public String getReceiver() {
		return receiver;
	}



	public void setReceiver(String receiver) {
		this.receiver = receiver;
	}



	public String getDateTime() {
		return dateTime;
	}



	public void setDateTime(String dateTime) {
		this.dateTime = dateTime;
	}



	public String getMessage() {
		return message;
	}



	public void setMessage(String message) {
		this.message = message;
	}



	public Messages() {
		// TODO Auto-generated constructor stub
	}



	Messages(String user_id, String receiver, String dateTime, String message, String type) {
		super();
		this.user_id = user_id;
		this.receiver = receiver;
		this.dateTime = dateTime;
		this.message = message;
		this.type = type;
	}



	@Override
	public String toString() {
		return "Messages [user_id=" + user_id + ", receiver=" + receiver + ", dateTime=" + dateTime + ", message="
				+ message + ", type=" + type + "]";
	}
	
	
	

}
