package com.vic.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.vic.model.Asset;
import com.vic.model.Coin;
import com.vic.model.User;
import com.vic.repositry.AssetRepositry;

@Service
public class AssetServiceImpl implements AssetService {

	@Autowired
	private AssetRepositry assetRepositry;
	
	@Override
	public Asset createAsset(User user, Coin coin, double quantity) {
		Asset asset = new Asset();
		asset.setUser(user);
		asset.setCoin(coin);
		asset.setQuantity(quantity);
		asset.setBuyPrice(coin.getCurrentPrice());
		return assetRepositry.save(asset);
	}

	@Override
	public Asset getAssetByid(Long assetId) throws Exception {
		
		return assetRepositry.findById(assetId).orElseThrow(()-> new Exception("asset not found"));
	}

	@Override
	public Asset getAssetByUserId(Long userId, Long assetId) {
		
		return null;
	}

	@Override
	public List<Asset> getUserAssets(Long userId) {
		
		return assetRepositry.findByUserId(userId);
	}

	@Override
	public Asset updateAsset(Long assetId, double quantity) throws Exception {
		Asset oldAsset = getAssetByid(assetId);
		oldAsset.setQuantity(quantity);
		return assetRepositry.save(oldAsset);
	}

	@Override
	public Asset findAssetByUserIdAndCoinId(Long userId, String coinId) {
		
		return assetRepositry.findByUserIdAndCoinId(userId, coinId);
	}

	@Override
	public void deleteAsset(Long assetId) {
		assetRepositry.deleteById(assetId);
		
	}

}
