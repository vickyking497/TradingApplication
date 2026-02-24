package com.vic.repositry;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vic.model.Watchlist;

public interface WatchlistRepositry extends JpaRepository<Watchlist, Long> {

	Watchlist findByUserId(Long userId);
}
