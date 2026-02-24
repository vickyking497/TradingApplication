package com.vic.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;
import com.vic.domain.UserRole;

import jakarta.persistence.Column;

import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;


@Entity
@Data
public class User {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	private String fullname;
	
	@Column(unique = true)
	private String email;
	
	@JsonProperty(access = Access.WRITE_ONLY)
	private String password;

	@Embedded
	private TwofactorAuth twoFactorAuth = new TwofactorAuth();
	
	
	private UserRole role = UserRole.RoleCustomer;
	
	
}
