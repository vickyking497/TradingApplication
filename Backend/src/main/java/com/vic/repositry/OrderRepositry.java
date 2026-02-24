package com.vic.repositry;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vic.model.Order;

public interface OrderRepositry extends JpaRepository<Order, Long> {
	
	List<Order> findByUserId(Long userId);
}
