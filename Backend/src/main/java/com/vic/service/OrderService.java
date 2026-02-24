package com.vic.service;

import java.util.List;

import com.vic.domain.OrderType;
import com.vic.model.Coin;
import com.vic.model.Order;
import com.vic.model.OrderItem;
import com.vic.model.User;

public interface OrderService {
	
	Order createOrder(User user,OrderItem orderItem, OrderType orderType);
	
	Order getOrderById(Long orderId) throws Exception;
	
	List<Order> getAllOrdersOfUsers(Long userId,OrderType orderType,String assetSymbol);
	
	Order processOrder(Coin coin,double quantity ,OrderType orderType,User user) throws Exception;
	

}
