package com.vic.repositry;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vic.model.User;

public interface UserRepositry extends JpaRepository<User, Long>{
	
	User findByEmail(String email);

}
