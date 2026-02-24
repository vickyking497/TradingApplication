package com.vic.service;

import com.vic.model.Coin;
import com.vic.model.User;
import com.vic.model.Watchlist;

public interface WatchlistService {
	
	
	Watchlist findUserWatchlist(long userId) throws Exception;
	
	Watchlist createWatchList(User user);
	
	Watchlist findById(Long Id) throws Exception;
	
	Coin addItemToWatchlist(Coin coin,User user) throws Exception;

}
