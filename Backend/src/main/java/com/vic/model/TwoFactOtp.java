package com.vic.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;

@Entity
@Data
public class TwoFactOtp {
	
	@Id
	private String id;
	
	private String otp;
	
	@ManyToOne
	@JoinColumn(name = "user_id")
	@JsonProperty(access = Access.WRITE_ONLY)
	private User user;
	
	@JsonProperty(access = Access.WRITE_ONLY)
	private String jwt;
	
	

}
