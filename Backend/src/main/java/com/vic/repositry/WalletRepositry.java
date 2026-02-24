package com.vic.repositry;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vic.model.Wallet;

public interface WalletRepositry extends JpaRepository<Wallet, Long> {

	Wallet findByUserId(Long userId);
	
}
