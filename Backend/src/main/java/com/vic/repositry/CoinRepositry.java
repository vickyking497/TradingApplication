package com.vic.repositry;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vic.model.Coin;

public interface CoinRepositry extends JpaRepository<Coin, String> {
	


}
