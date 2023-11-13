package com.saurabh.ri.config;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class JwtController {
     
    private final JwtService jwtService;
    
    private final AuthenticationManager authenticationManager;

    public JwtController(JwtService tokenService, 
            AuthenticationManager authenticationManager) {
        this.jwtService = tokenService;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/authenticate")
    public ResponseEntity<JwtResponse> generateToken( // ResponseEntity is used to represent HTTP response in more flexible way and customizable way compared to the traditional way
            @RequestBody JwtRequest jwtTokenRequest) {
        
        var authenticationToken = 
                new UsernamePasswordAuthenticationToken(
                        jwtTokenRequest.username(), 
                        jwtTokenRequest.password());
        
        var authentication = 
                authenticationManager.authenticate(authenticationToken); // if the credinatials are incorrect Am will throw BadCredentialsException exception
        
        var token = jwtService.generateToken(authentication); // will genert
        
        return ResponseEntity.ok(new JwtResponse(token));
    }
	
}
