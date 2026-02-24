import { existInWatchlist } from '@/Utils/existInWatchlist';
import * as type from './ActionType';

const initialState={
    watchlist:{},
    loading:false,
    error:null,
    items:[],
};


const watchlistReducer = (state = initialState,action)=>{
    switch(action.type){
        case type.GET_USER_WATCHLIST_REQUEST:
        case type.ADD_COIN_TO_WATCHLIST_REQUEST:
        
            return{
                ...state,
                loading:true,
                error:null,
    };

    case type.GET_USER_WATCHLIST_SUCCESS:
          return{
                ...state,
                watchlist:action.payload,
                items: action.payload.coins,
                loading:false,
                error:null,
    };

    case type.ADD_COIN_TO_WATCHLIST_SUCCESS:

    const payloadId = action.payload?.id || action.payload?.coin?.id;
    let updatedItems = existInWatchlist(state.items,action.payload)
    ? state.items.filter((item)=>(item?.id || item?.coin?.id) !== payloadId)
    :[action.payload,...state.items]
   
          return{
                ...state,
                items:updatedItems,
                loading:false,
                error:null,
    };
   
    case type.GET_USER_WATCHLIST_FAILURE:
    case type.ADD_COIN_TO_WATCHLIST_FAILURE:
    
            return{
                ...state,
                loading:false,
                error:action.error,
    };

    default:
        return state;
}
};

export default watchlistReducer;
