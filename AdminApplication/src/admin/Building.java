package admin;

public class Building {
	private String id;
	private String name;
	private String latitude;
	private String longitude;
	
	
	Building() {
		super();
	}

	Building(String id, String name, String latitude, String longitude) {
		super();
		this.id = id;
		this.name = name;
		this.latitude = latitude;
		this.longitude = longitude;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		Building other = (Building) obj;
		if (id != other.id)
			return false;
		return true;
	}


	public String getId() {
		return id;
	}


	public void setId(String id) {
		this.id = id;
	}


	public String getName() {
		return name;
	}


	public void setName(String name) {
		this.name = name;
	}


	public String getLatitude() {
		return latitude;
	}


	public void setLatitude(String latitude) {
		this.latitude = latitude;
	}


	public String getLongitude() {
		return longitude;
	}


	public void setLongitude(String longitude) {
		this.longitude = longitude;
	}

	@Override
	public String toString() {
		return "id=" + id + ", name=" + name + ", latitude=" + latitude + ", longitude=" + longitude + "";
	}
	
	
	
}
