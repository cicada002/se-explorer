import { useEffect, useRef, useState } from 'react';
import { NavLink as Link, useParams, useNavigate } from 'react-router-dom';

function Search () {
    const navigate = useNavigate();
    let { id } = useParams();
    const searchInput = useRef()

    function Hash({hash}) {
        const[txnData, setTxnData] = useState({})
        useEffect(() => {
            (async () => {
                let response = await fetch(process.env.REACT_APP_INDEXER_ENDPOINT + "/tx/" + hash);
                const _txnData = await response.json();
                if(_txnData !== null) {
                    response = await fetch(process.env.REACT_APP_INDEXER_ENDPOINT + "/block/hash/" + _txnData['block_id']);
                    const _blockData = await response.json();
                    if(_blockData !== null) {
                        setTxnData({
                            'chain_id': _blockData['header']['chain_id'],
                            'block_time': _blockData['header']['time'],
                            'block_height': _blockData['header']['height'],
                            'block_hash': _txnData['block_id'],
                            'txn_hash': _txnData['hash'],
                            "txn_type": _txnData["tx_type"],
                            "fee_amount_per_gas_unit": _txnData["fee_amount_per_gas_unit"],
                            "fee_token": _txnData["fee_token"],
                            "gas_limit_multiplier": _txnData["gas_limit_multiplier"],
                            "code": _txnData["code"],
                            "data": _txnData["data"],
                            'status': !(_txnData['return_code'] === null || _txnData['return_code'] === 0) ? 'Failed' : 'Success',
                            "tx": _txnData['tx'],
                            "raw_data": JSON.stringify(_txnData)
                        })
                    }
                }
                
            })();
        },[])
        return (
            <div className='h-content space-y-6 flex flex-col'>
                <div className='p-4'>
                    <div className='bg-[#212529] text-white p-6 overflow-x-auto'>
                        <div className='text-xl'>Transaction Overview</div>
                        <div className='flex justify-between py-6'>
                            <div>
                                <div className='font-semibold'>Transaction Hash</div>
                                <div>{txnData["txn_hash"]}</div>
                            </div>
                            <div>
                                <div className='font-semibold'>Block Height</div>
                                <button onClick={() => {navigate('/search/' + txnData['block_height'])}} className='text-white underline'>#{txnData["block_height"]}</button>
                            </div>
                        </div>
                        <div className='flex justify-between py-6'>
                            <div>
                                <div className='font-semibold'>Block Hash</div>
                                <div>{txnData["block_hash"]}</div>
                            </div>
                            <div>
                                <div className='font-semibold'>Status</div>
                                <div className={`${txnData["status"] === 'Success' ? 'bg-green-900 text-green-400 ' : 'bg-red-900 text-red-400 '} rounded-md p-1 px-2`}>{txnData["status"]}</div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className='p-4'>
                    <div className='rounded-md bg-black text-white p-6'>
                        <div className='text-xl'>Raw Data</div>
                        <div className='py-2'></div>
                        <article className='text-ellipsis border'>
                            <p>{
                                txnData["raw_data"]
                            }</p>
                        </article>
                    </div>
                </div> */}
            </div>
        )
    }

    function Height({height}) {
        const[blockData, setBlockData] = useState({})
        useEffect(() => {
            (async () => {
                const response = await fetch(process.env.REACT_APP_INDEXER_ENDPOINT + "/block/height/" + height);
                const _blockData = await response.json();
                if(_blockData !== null) {
                    setBlockData({
                        'block_height': _blockData['header']['height'],
                        "block_hash": _blockData['block_id'],
                        'block_time': _blockData['header']['time'],
                        'chain_id': _blockData['header']['chain_id'],
                        'proposer': _blockData['header']['proposer_address'],
                        "txn_hash": _blockData["tx_hashes"],
                        "txn_size": _blockData["tx_hashes"].length,
                    })
                }
            })();
        },[])
        return (
            <div className='h-content space-y-6 flex flex-col'>
                <div className='p-4'>
                    <div className='text-3xl text-center p-4 text-[#FF9417]'>Block Overview</div>
                    <div className='bg-[#212529] text-white overflow-x-auto border border-[#636363] bg-[#303030]'>
                        <div className='flex justify-between space-x-4 border border-[#636363] p-6'>
                            <div>
                                <div className='font-semibold'>Block Height</div>
                                <div>#{blockData["block_height"]}</div>
                            </div>
                            <div>
                                <div className='font-semibold'>Block Time</div>
                                <div>{blockData["block_time"]}</div>
                            </div>
                            <div>
                                <div className='font-semibold'>Transactions</div>
                                <div>{blockData["txn_size"]}</div>
                            </div>
                        </div>
                        <div className='flex justify-between py-6 space-x-4 border border-[#636363] p-6'>
                            <div>
                                <div className='font-semibold'>Block Hash</div>
                                <div>{blockData["block_hash"]}</div>
                            </div>
                            <div>
                                <div className='font-semibold'>Proposer</div>
                                <div>{blockData["proposer"]}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='p-4'>
                    <div className='text-3xl text-center p-4 text-[#FF9417]'>Block Transactions</div>
                    <div className='px-4 text-[#FF9417]'>
                        <div className='flex justify-between py-4 text-lg space-x-4'>
                            <div className='w-96'>Transaction</div>
                            <div>Block</div>
                            <div>Transaction Type</div>
                        </div>
                    </div>
                    <div className='bg-[#212529] text-white overflow-x-auto border border-[#636363] bg-[#303030]'>
                        <div>
                            {
                                blockData["txn_hash"] !== undefined ? blockData["txn_hash"].map(element => {
                                    return (
                                        <div className='flex items-center justify-between w-full border border-[#636363] p-4 space-x-4'>
                                            <button onClick={() => {navigate('/search/' + element['hash_id'])}} className='text-white underline text-[14px] w-80 truncate'>{element["hash_id"]}</button>
                                            <div className='text-[14px]'>#{blockData["block_height"]}</div>
                                            <div>{element["tx_type"]}</div>
                                         </div>
                                    )
                                }) : ''
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-[#3A3C31] h-screen w-full overflow-auto">
            <div className='w-full px-6'>
                <div className='flex justify-center z-0 w-full py-4'>
                    <div>
                        <form class="flex items-center border border-[#636363] bg-[#303030]">   
                            <label for="voice-search" class="sr-only">Search</label>
                            <div class="relative w-full">
                                <input ref={searchInput} onChange={e => {searchInput.current = e.target.value}} type="text" id="voice-search" class="bg-[#303030] w-[260px] text-white text-sm block w-full p-2.5  dark:bg-[#303030] dark:placeholder-white dark:text-white" placeholder="Search By Block Height / Txn Hash" required />
                            </div>
                            <button onClick={() => {if(typeof(searchInput.current) !== 'object'){navigate('/search/' + searchInput.current)} }} type="submit" class="">
                                <div className='px-4 py-2 bg-[#FF9417] text-white'>
                                    Search
                                </div>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <div className='w-full'>
                {
                    id !== undefined ? 
                        isNaN(id) ?
                            // (id.slice(0,1) === 'p' && !isNaN(id.slice(1,id.length))) ?
                            //     <Proposal proposal={id}/> : 
                            <Hash hash={id}/> : <div><Height height={id}/></div> : ''
                }
            </div>
        </div>
    )
}

export default Search;