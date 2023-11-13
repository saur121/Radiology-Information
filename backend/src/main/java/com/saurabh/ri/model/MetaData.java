package com.saurabh.ri.model;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MetaData {

	 private String patientName;
	 private String patientId;
	 private String age;
	 private String sex;
	 private String uploadDate;

	  // Constructors, getters, and setters

	 public MetaData() {
	 }

	public MetaData(String patientName, String patientId, String age, String sex, String uploadDate) {
		super();
		this.patientName = patientName;
		this.patientId = patientId;
		this.age = age;
		this.sex = sex;
		this.uploadDate = uploadDate;
	}

	  
}
