package com.vic.repositry;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vic.model.Asset;

public interface AssetRepositry extends JpaRepository<Asset, Long> {

	List<Asset> findByUserId(Long userId);
	
	Asset findByUserIdAndCoinId(Long userId,String coinId);
	
}
