package com.saurabh.ri.model;

import jakarta.persistence.*;
import lombok.*;


@Getter
@Setter
@Entity
public class Patient {
	
	public Patient() {
		
	}
    
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id; 

	public Patient(Integer id, String username, String patientName, String gender, String dateOfBirth,
			String contactNumber, String email, String symptoms) {
		super();
		this.id = id;
		this.username = username;
		this.patientName = patientName;
		this.gender = gender;
		this.dateOfBirth = dateOfBirth;
		this.contactNumber = contactNumber;
		this.email = email;
		this.symptoms = symptoms;
	}
	
	
	private String username;
	
	private String patientName;
	private String gender;
	private String dateOfBirth;
	private String contactNumber;
	private String email;
	private String symptoms;
    

	

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

} 
