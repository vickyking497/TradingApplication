package com.vic.repositry;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vic.model.PaymentOrder;

public interface PaymentOrderRepositry extends JpaRepository<PaymentOrder, Long> {

}
