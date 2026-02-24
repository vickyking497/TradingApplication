package com.vic.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vic.domain.WithdrawalStatus;
import com.vic.model.User;
import com.vic.model.Withdrawal;
import com.vic.repositry.WithdrawalRepositry;

@Service
public class WithdrawalServiceImpl implements WithdrawalService {

	@Autowired
	private WithdrawalRepositry withdrawalRepositry;
	
	@Override
	public Withdrawal requestWithdrawal(Long amount, User user) {
		Withdrawal withdrawal = new Withdrawal();
		
		withdrawal.setAmount(amount);
		withdrawal.setUser(user);
		withdrawal.setStatus(WithdrawalStatus.PENDING);
		return withdrawalRepositry.save(withdrawal);
	}

	@Override
	public Withdrawal proceedWithdrawal(Long withdrawalId, boolean accept) throws Exception {
		Optional<Withdrawal>  withdrawal = withdrawalRepositry.findById(withdrawalId);
		if(withdrawal.isEmpty()) {
			throw new Exception("Withdrawal not found");
		}
		
		Withdrawal withdrawal1 = withdrawal.get();
		
		withdrawal1.setDate(LocalDateTime.now());
		
		if(accept) {
			withdrawal1.setStatus(WithdrawalStatus.SUCCESS);
		}
		else {
			withdrawal1.setStatus(WithdrawalStatus.PENDING);
		}
		return withdrawalRepositry.save(withdrawal1);
	}

	@Override
	public List<Withdrawal> getUsersWithdrawalHistory(User user) {
		
		return withdrawalRepositry.findByUserId(user.getId());
	}

	@Override
	public List<Withdrawal> getAllWithdrawalRequest() {
		
		return withdrawalRepositry.findAll();
	}

}
