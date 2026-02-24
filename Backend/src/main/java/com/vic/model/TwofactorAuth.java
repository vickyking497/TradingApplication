package com.vic.model;


import com.vic.domain.VerificationType;

import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class TwofactorAuth {
	
	private boolean isEnabled = false;
	private VerificationType sendto;
	

}
