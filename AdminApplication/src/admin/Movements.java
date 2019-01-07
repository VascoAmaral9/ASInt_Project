package admin;

public class Movements {
	
	private String user_id;
	private String buildingA;
	private String buildingB;
	private String dateTime;
	
	

	public String getUser_id() {
		return user_id;
	}



	public void setUser_id(String user_id) {
		this.user_id = user_id;
	}



	public String getBuildingA() {
		return buildingA;
	}



	public void setBuildingA(String buildingA) {
		this.buildingA = buildingA;
	}



	public String getBuildingB() {
		return buildingB;
	}



	public void setBuildingB(String buildingB) {
		this.buildingB = buildingB;
	}



	public String getDateTime() {
		return dateTime;
	}



	public void setDateTime(String dateTime) {
		this.dateTime = dateTime;
	}



	public Movements() {
		// TODO Auto-generated constructor stub
	}



	Movements(String user_id, String buildingA, String buildingB, String dateTime) {
		super();
		this.user_id = user_id;
		this.buildingA = buildingA;
		this.buildingB = buildingB;
		this.dateTime = dateTime;
	}



	@Override
	public String toString() {
		return "User ID: " + user_id + ", " + buildingA + "-->>" + buildingB + ", Timestamp:"
				+ dateTime;
	}
	
	

}
