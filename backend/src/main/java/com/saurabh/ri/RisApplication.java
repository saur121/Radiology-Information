package com.saurabh.ri;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class RisApplication {

	public static void main(String[] args) {
		SpringApplication.run(RisApplication.class, args);
	}
    
	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			
			public void addCorsMappings(CorsRegistry registry) {
				registry.addMapping("/**")
				        .allowedMethods("*")
				        .allowedOriginPatterns("http://localhost:3000");
			}
		};
	}
}
