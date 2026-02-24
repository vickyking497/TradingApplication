package com.vic.controller;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.vic.model.Coin;
import com.vic.model.User;
import com.vic.model.Watchlist;
import com.vic.service.CoinService;
import com.vic.service.UserService;
import com.vic.service.WatchlistService;

@RestController
@RequestMapping("/api/watchlist")
public class WatchlistController {
	
	@Autowired
	private WatchlistService watchlistService;
	
	@Autowired
	private UserService userService;
	
	@Autowired
	private CoinService coinService;
	
	@GetMapping("/user")
	public ResponseEntity<Watchlist> getUserWatchlist(@RequestHeader("Authorization") String jwt) throws Exception{
		User user = userService.findUserProfileByJwt(jwt);
		Watchlist watchlist = watchlistService.findUserWatchlist(user.getId());
		
		return ResponseEntity.ok(watchlist);
	}
	
	@GetMapping("/{watchlistId}")
	public ResponseEntity<Watchlist> getWatchlistById(@PathVariable Long watchlistId) throws Exception{
		
		Watchlist watchlist = watchlistService.findById(watchlistId);
		
		return ResponseEntity.ok(watchlist);
	}
	
	@PatchMapping("/add/coin/{coinId}")
	public ResponseEntity<Coin> addItemToWatchList(@RequestHeader("Authorization") String jwt,@PathVariable String coinId) throws Exception{
	
		User user= userService.findUserProfileByJwt(jwt);
		
		Coin coin = coinService.findById(coinId);
		Coin addCoin = watchlistService.addItemToWatchlist(coin, user);
		
		return ResponseEntity.ok(addCoin);
		
	}
	
	
}
