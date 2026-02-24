
import { Button } from '@/components/ui/button';
import { fetchMarketChart } from '@/State/Coin/Action';
import React, { useEffect } from 'react'
import ReactApexChart from 'react-apexcharts';
import { useDispatch, useSelector } from 'react-redux';


const timeSeries = [
    {
        keyword: "DIGITAL_CURRENCY_DAILY",
        key : "Time Series (Daily)",
        label :"1 Day",
        value : 1,
    },
    {
        keyword: "DIGITAL_CURRENCY_WEEKLY",
        key : " Weekly Time Series ",
        label :"1 Week",
        value : 7,
    }, 
    {
        keyword: "DIGITAL_CURRENCY_MONTHLY",
        key : " Monthly Time Series ",
        label :"1 Month",
        value : 30,
    },
    {
        keyword: "DIGITAL_CURRENCY_YEARLY",
        key : " Yearly Time Series ",
        label :"1 Year",
        value : 365,
    }
];

const StockChart = ({coinId}) => {

    const dispatch = useDispatch();
    const coin = useSelector((store) => store.coin)

    const [activeLabel, setActiveLabel] = React.useState(timeSeries[2]);
    const series = [
        {
            data: coin.marketChart.data,
        }
    ];
    const options = { 
        chart: {
            id : "area-datetime",
            type: 'area',
            height: 350,
            zoom: { 
                autoScaleYaxis: true
             }
         },
         dataLabels: {
            enabled: false
         },
         xaxis: {
            type: 'datetime',
            tickAmount: 6
         },
         color: ["#f0b90b"],
         markers :{
                color :["#f0b90b"],
                strokeColors : "#f0b90b",
                size: 0,
                strokeWidth : 1,
                style: 'hollow'
         },
            tooltip: {  
                theme : 'dark'
            },
            fill:{
                type : "gradient",
                gradient : { 
                    shadeIntensity : 1,
                    opacityFrom : 0.8,
                    opacityTo : 0.9,
                    stops : [0,100]
                }
            },
            grid: {
                show: true,
                borderColor: '#2b3139',
                strokeDashArray: 4
            }
    }
    const handleActiveLabelChange = (value) => {
        setActiveLabel(value);
    };

    useEffect(()=>{
        if (!coinId) return;
        const days = activeLabel?.value || 30;
        dispatch(fetchMarketChart({coinId,days,jwt:localStorage.getItem("jwt")}))
    },[dispatch,coinId,activeLabel])

  return (
    <div>

        <div className="space-x-3">
            {timeSeries.map((item)=>(
                <Button 
                variant={activeLabel.label==item.label ? "default" : "outline"}
                onClick={()=>handleActiveLabelChange(item)}
                 key={item.label} >
                    {item.label}
                </Button> 
            ))} 
        </div>
        
        <div id="chart-timeline ">
            <ReactApexChart options={options} 
            series={series} 
            height={450}
            type="area"
            />    

        </div>
        
    </div>
  );
};

export default StockChart
