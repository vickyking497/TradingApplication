package com.vic.service;

import java.util.List;

import com.vic.model.Asset;
import com.vic.model.Coin;
import com.vic.model.User;

public interface AssetService {
	
	Asset createAsset(User user,Coin coin,double quantity);
	
	Asset getAssetByid(Long assetId) throws Exception;
	
	Asset getAssetByUserId(Long userId,Long assetId);
	
	List<Asset> getUserAssets(Long userId);
	
	Asset updateAsset(Long assetId,double quantity) throws Exception;
	
	Asset findAssetByUserIdAndCoinId(Long userId,String coinId);
	
	void deleteAsset(Long assetId);

}
