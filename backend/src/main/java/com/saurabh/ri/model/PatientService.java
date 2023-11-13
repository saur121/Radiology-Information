
package com.saurabh.ri.model;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Predicate;

import org.springframework.stereotype.Service;


@Service
public class PatientService {
     
	private static List<Patient> patients = new ArrayList<>();
	
	private static int cnt = 0;
	

	public List<Patient> findByUsername(String username){
		Predicate<? super Patient> predicate = 
				hospital -> hospital.getUsername().equalsIgnoreCase(username);
		return patients.stream().filter(predicate).toList(); 
	}
	
	public Patient addHospital(String username, String patientName, String gender, String dateOfBirth,
			String contactNumber, String email, String symptoms) {
	        Patient hospital = new Patient(++cnt,username,patientName, gender , dateOfBirth , contactNumber , email, symptoms);
		patients.add(hospital);
		return hospital;
	}
	
	public void deleteById(int id) { 
		Predicate<? super Patient> predicate = hospital -> hospital.getId() == id;
		patients.removeIf(predicate);
	}

	public Patient findById(int id) {
		Predicate<? super Patient> predicate = hospital -> hospital.getId() == id;
		Patient hospital = patients.stream().filter(predicate).findFirst().get();
		return hospital;
	}

	public void updateHospital(Patient hospital) { // to update the hospital 
		deleteById(hospital.getId());
		patients.add(hospital);
	}
}
  
