package com.vic.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vic.model.Coin;
import com.vic.model.User;
import com.vic.model.Watchlist;
import com.vic.repositry.WatchlistRepositry;

@Service
public class WatchlistServiceImpl implements WatchlistService{

	@Autowired
	private WatchlistRepositry watchlistRepositry;
	
	@Override
	public Watchlist findUserWatchlist(long userId) throws Exception {
		Watchlist watchlist = watchlistRepositry.findByUserId(userId);
		if(watchlist==null) {
			throw new Exception("watchlist not found");
			
		}
		return watchlist;
	}

	@Override
	public Watchlist createWatchList(User user) {
		Watchlist watchlist = new Watchlist();
		watchlist.setUser(user);
		return watchlistRepositry.save(watchlist);
	}

	@Override
	public Watchlist findById(Long Id) throws Exception {
		Optional<Watchlist> watchlistOptional = watchlistRepositry.findById(Id);
		if(watchlistOptional.isEmpty()) {
			throw new Exception("Watchlist not found");
		}
		return watchlistOptional.get();
	}

	@Override
	public Coin addItemToWatchlist(Coin coin, User user) throws Exception {
		Watchlist watchlist = findUserWatchlist(user.getId());
		if(watchlist.getCoins().contains(coin)) {
			
		}
		else 
			watchlist.getCoins().add(coin);
		watchlistRepositry.save(watchlist);
		
		
		return coin;
	}
	

}
