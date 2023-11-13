package com.saurabh.ri.model;

import java.util.List;

import org.dcm4che3.data.Attributes;
import org.dcm4che3.io.DicomInputStream;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.saurabh.ri.repo.PatientRepo;

@RestController 
public class Resource {
    
	private PatientService patientService;
	private PatientRepo patientRepo;
	
	
	public Resource(PatientService patientService,PatientRepo patientRepo) {
		this.patientService = patientService;
		this.patientRepo = patientRepo;
	}
	
	@GetMapping("/users/{username}/patients")
	public List<Patient> retriveHospitals(@PathVariable String username) {
		return patientRepo.findByUsername(username); // searching our DB for list of hospitals with help of username
	}
	
	
	@GetMapping("/users/{username}/patients/{id}")
	public Patient retriveHospital(@PathVariable String username,@PathVariable int id) {
		return patientRepo.findById(id).get(); // we are putting get because it returns the optional
	}
	
	
	@DeleteMapping("/users/{username}/patients/{id}")
	public ResponseEntity<Void> deleteHospital(@PathVariable String username,@PathVariable int id) {
		patientRepo.deleteById(id);
		return ResponseEntity.noContent().build();
		 
	}
	
	@PutMapping("/users/{username}/patients/{id}")
	public Patient	 updateHospital(@PathVariable String username,@PathVariable int id,@RequestBody Patient patient) {
		patientRepo.save(patient); // here save checks if the id is null it will create new hospitals but if it exists it will update
		 return patient;
		 
	}
	
	@PostMapping("/users/{username}/patients")
	public Patient createHospital(@PathVariable String username, @RequestBody Patient patient) {
		patient.setUsername(username);
		patient.setId(null); // setting id as null so our repo knows that it is to be added not updated
		return patientRepo.save(patient);	
		
	}
	
	
	@PostMapping("/uploadFile")
    public MetaData uploadFile(@RequestParam("dicomFile") MultipartFile dicomFile, @RequestParam("hospitalId") Integer hospitalId) {
		MetaData extractedInfo = new MetaData();
		 try {
	            DicomInputStream dis = new DicomInputStream(dicomFile.getInputStream());

	            Attributes attrs = dis.readDataset(); 

	            extractedInfo.setPatientName(attrs.getString(org.dcm4che3.data.Tag.PatientName));
	            System.out.println(attrs.getString(org.dcm4che3.data.Tag.PatientName));
	            extractedInfo.setPatientId(attrs.getString(org.dcm4che3.data.Tag.PatientID));
	            extractedInfo.setAge(attrs.getString(org.dcm4che3.data.Tag.PatientAge));
	            extractedInfo.setSex(attrs.getString(org.dcm4che3.data.Tag.PatientSex));
	            extractedInfo.setUploadDate(attrs.getString(org.dcm4che3.data.Tag.StudyDate));
	            dis.close();
	        } catch (Exception e) {
	            e.printStackTrace();
	        }
	        return extractedInfo;
    }
	
}
