import { useEffect, useState, useMemo, useRef } from 'react';
import { NavLink as Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const useMap = () => {
    const [map, setMap] = useState(new Map());

    const actions = useMemo(
      () => ({
        set: (key, value) =>
          setMap(prevMap => {
            const nextMap = new Map(prevMap);
            nextMap.set(key, value);
            return nextMap;
          }),
        remove: (key) =>
          setMap(prevMap => {
            const nextMap = new Map(prevMap);
            nextMap.delete(key);
            return nextMap;
          }),
        clear: () => setMap(new Map()),
      }),
      [setMap]
    );
  
    return [map, actions];
  };

function Home () {
    const [blockData, { set, remove, clear }] = useMap();
    const[latestBlock, setLatestBlock] = useState(0)
    const[validatorData, setValidatorData] = useState({})
    const blockIs = useRef(0);
    const fetchBlock = 10;
    const navigate = useNavigate();

    const getBlockData = async () => {
        if(parseInt(blockIs.current) > 0) {
            const response = await fetch(process.env.REACT_APP_INDEXER_ENDPOINT + "/block/last");
            const _blockData = await response.json();
            const _latestBlock = _blockData["header"]["height"]
            if(_latestBlock !== blockIs.current) {
                let index = 0
                const currBlock = parseInt(blockIs.current)
                for(let i = currBlock + 1; i <= _latestBlock; i++) {
                    remove((currBlock - fetchBlock + 1 + index).toString())
                    const int_response = await fetch(process.env.REACT_APP_INDEXER_ENDPOINT + "/block/height/" + i);
                    const int_blockData = await int_response.json();
                    if(int_blockData !== null) {
                        set(int_blockData["header"]["height"], {
                            "block_time": int_blockData["header"]["time"],
                            "block_height": int_blockData["header"]["height"],
                            "block_hash": int_blockData["header"]["last_block_id"]["hash"],
                            "txn_hash": int_blockData["tx_hashes"],
                            "txn_size": int_blockData["tx_hashes"].length,
                            "proposer": int_blockData["header"]["proposer_address"]
                        })
                        index++;
                        setLatestBlock(_blockData["header"]) 
                        blockIs.current = _latestBlock
                    }
                }
            }
        }
    }

    useEffect(() => {
        (async () => {
            const _response = await axios.get(process.env.REACT_APP_RPC_ENDPOINT + "/validators")
            console.log(_response)
            setValidatorData(_response["data"]["result"])

            const response = await fetch(process.env.REACT_APP_INDEXER_ENDPOINT + "/block/last");
            const _blockData = await response.json();
            const _latestBlock = _blockData["header"]["height"]
            if(_blockData !== null && _blockData["header"] != null && _blockData["header"]["height"] !== null && _blockData["header"]["height"] >= 5) {
                for(let i = _latestBlock; i > _latestBlock - fetchBlock; i--) {
                    const int_response = await fetch(process.env.REACT_APP_INDEXER_ENDPOINT + "/block/height/" + i);
                    const int_blockData = await int_response.json();
                    set(int_blockData["header"]["height"], {
                        "block_time": int_blockData["header"]["time"],
                        "block_height": int_blockData["header"]["height"],
                        "block_hash": int_blockData["header"]["last_block_id"]["hash"],
                        "txn_hash": int_blockData["tx_hashes"],
                        "txn_size": int_blockData["tx_hashes"].length,
                        "proposer": int_blockData["header"]["proposer_address"]
                    })
                }
                setLatestBlock(_blockData["header"]) 
                blockIs.current = _latestBlock
            }
            
        })();

        const interval = setInterval(() => {
            getBlockData();
        }, 5000);
      
        return () => clearInterval(interval);
    },[])

    function BlockPane ({ blockId }) {
        const _blockData = blockData.get(blockId)
        const timeDiff = new Date() - new Date(_blockData["block_time"]);
        let timeAgo = ""
        if(timeDiff < 1000) {
            timeAgo = timeDiff + " millisecs ago"
        } else if((timeDiff/1000) < 60) {
            timeAgo = parseInt((timeDiff/1000)) + " secs ago"
        } else if((timeDiff/60000) < 60) {
            timeAgo = parseInt((timeDiff/60000)) + " mins ago"
        } else if((timeDiff/360000) < 24){
            timeAgo = parseInt((timeDiff/3600000)) + " hours ago"
        } else {
            timeAgo = parseInt((timeDiff/86400000)) + " days ago"
        }
        return (
            <div className='flex items-center justify-between w-full border border-[#636363] py-4 px-4 space-x-4'>
                <div className='flex space-x-2'>
                    <div className='py-1 flex flex-col justify-between'>
                        <Link to={`/search/${_blockData["block_height"]}`}><button className='text-sm font-semibold underline'>{_blockData["block_height"]}</button></Link>
                    </div>
                </div>
                <div className='text-[14px] truncate'>{_blockData["block_hash"]}</div>
                <div className='text-[14px] truncate'>{_blockData["proposer"]}</div>
                {/* <div className='text-[10px] sm:text-xs'></div> */}
                <div>{_blockData["txn_size"]}</div>
                <div className='text-[14px] truncate'>{_blockData["block_time"]}</div>
            </div>
        )
    }

    function ValidatorPane ({ _validatorData }) {
        return (
            <div className='flex items-center justify-between w-full border border-[#636363] py-4 px-4'>
                <div className='text-[14px] w-content truncate'>{_validatorData["address"]}</div>
                <div className='text-[14px]'>{parseFloat(_validatorData["voting_power"]/1000000)} NAAN</div>
                <div className='text-[14px]'>{_validatorData["proposer_priority"]}</div>
            </div>
        )
    }

    return (
        <div className='flex-1 w-full bg-[#3A3C31] px-6 text-white py-4'>
            <div className='p-8 text-4xl text-[#FF9417] font-semibold text-center'>Namada SE Explorer</div>
            <div className='flex flex-col xl:flex-row items-center justify-center w-full space-y-3 xl:space-y-0 xl:space-x-4'>
                <div className='bg-[#303030] text-xl flex flex-col justify-center w-full py-6 space-y-2 px-4 border border-[#636363]'>
                    <div className='text-lg text-[#FF9417] font-semibold'>LATEST BLOCK:</div>
                    <div className='text-white text-sm'>{latestBlock !== undefined ? latestBlock["height"] : ""}</div>
                </div>
                <div className='bg-[#303030] text-xl flex flex-col justify-center w-full py-6 space-y-2 px-4 border border-[#636363]'>
                    <div className='text-lg text-[#FF9417] font-semibold'>BLOCK TIME:</div>
                    <div className='text-white text-sm'>{latestBlock !== undefined ? latestBlock["time"] : ""}</div>
                </div>
                <div className='bg-[#303030] text-xl flex flex-col justify-center w-full py-6 space-y-2 px-4 border border-[#636363]'>
                    <div className='text-lg text-[#FF9417] font-semibold'>CHAIN ID:</div>
                    <div className='text-white text-sm'>shielded-expedition.88f17d1d14</div>
                </div>
            </div>
            <div className='p-6'></div>
            <div className='flex justify-between py-4 font-bold text-xl text-[#FF9417] px-4'>
                <div>Block Height</div>
                <div className='w-24'>Hash</div>
                <div>Proposer</div>
                <div># of Txns</div>
                <div>Time</div>
            </div>
            <div className='bg-[#303030] w-full flex items-center justify-between space-x-6'>
                <div className='w-full overflow-x-auto'>
                    <div>
                        <div>
                            {
                                [...blockData.keys()].sort((a, b) => (b - a)).map((element) => {
                                    return (
                                        <BlockPane blockId={element}/>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className='p-6'></div>
            <div className='flex justify-between py-4 font-bold text-xl text-[#FF9417] px-4'>
                <div className='w-64'>Validator Address</div>
                <div >Voting Power</div>
                <div>Priority</div>
            </div>
            <div className='w-full flex items-center justify-between space-x-6'>
                <div className='w-full bg-[#303030] overflow-x-scroll'>
                    <div>
                        <div>
                            {
                                JSON.stringify(validatorData) !== '{}' && validatorData !== undefined ? validatorData["validators"].map(element => {
                                    return (
                                        <ValidatorPane _validatorData={element}/>
                                    )
                                }) : ''
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;