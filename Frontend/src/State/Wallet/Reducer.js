import * as type from './ActionType';

const initialState={
    userWallet:{},
    loading:false,
    error:null,
    transactions:[],
};

const walletReducer = (state = initialState,action)=>{
    switch(action.type){
        case type.GET_USER_WALLET_REQUEST:
        case type.GET_WALLET_TRANSACTION_REQUEST:
        case type.DEPOSIT_MONEY_REQUEST:
        case type.TRANSFER_MONEY_REQUEST:
            return{
                ...state,
                loading:true,
                error:null,
    };

    case type.GET_WALLET_TRANSACTION_SUCCESS:
          return{
                ...state,
                transactions:action.payload,
                loading:false,
                error:null,
    };

    case type.GET_USER_WALLET_SUCCESS:
    case type.TRANSFER_MONEY_SUCCESS:
          return{
                ...state,
                userWallet:action.payload,
                loading:false,
                error:null,
    };
    case type.DEPOSIT_MONEY_SUCCESS:
            return{
                ...state,
                userWallet:action.payload,
                loading:false,
                error:null,
    };
    case type.GET_USER_WALLET_FAILURE:
    case type.GET_WALLET_TRANSACTION_FAILURE:
    case type.DEPOSIT_MONEY_FAILURE:
    case type.TRANSFER_MONEY_FAILURE:
            return{
                ...state,
                loading:false,
                error:action.error,
    };

    default:
        return state;
}
};


export default walletReducer;
