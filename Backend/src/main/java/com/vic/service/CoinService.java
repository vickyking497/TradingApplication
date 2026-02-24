package com.vic.service;

import java.util.List;

import com.vic.model.Coin;

public interface CoinService {
	
	List<Coin> getCoinList(int page) throws Exception;
	
	String getMarketChart(String coinId,int days) throws Exception;
	
	String getCoinDetails(String coinId) throws Exception;
	
	Coin findById(String coindId) throws Exception;
	
	String searchCoin(String keyword) throws Exception;
	
	String getTop50CoinsByMarketCapRank() throws Exception;
	
	String getTreadingCoins() throws Exception;
	

}
