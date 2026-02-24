package com.vic.repositry;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vic.model.Withdrawal;

public interface WithdrawalRepositry extends JpaRepository<Withdrawal, Long> {

	List<Withdrawal> findByUserId(Long userId);
}
