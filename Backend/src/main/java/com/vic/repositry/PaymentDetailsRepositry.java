package com.vic.repositry;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vic.model.PaymentDetails;

public interface PaymentDetailsRepositry  extends JpaRepository<PaymentDetails, Long>{

	PaymentDetails findByuserId(Long userId);
}
