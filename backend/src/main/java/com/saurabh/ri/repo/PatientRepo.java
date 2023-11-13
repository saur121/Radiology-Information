package com.saurabh.ri.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.saurabh.ri.model.Patient;
import java.util.*;

@Repository
public interface PatientRepo extends JpaRepository<Patient, Integer> {
     
	List<Patient> findByUsername(String username);
}
