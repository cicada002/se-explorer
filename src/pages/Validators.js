import { useEffect, useState, useMemo, useRef } from 'react';
import axios from 'axios';

function Home () {
    const[validatorData, setValidatorData] = useState({})

    useEffect(() => {
        (async () => {
            const _response = await axios.get(process.env.REACT_APP_RPC_ENDPOINT + "/validators")
            console.log(_response)
            setValidatorData(_response["data"]["result"])
        })();
    },[])

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
            <div className='p-12 text-5xl text-[#FF9417] font-semibold text-center'> Validators</div>
            <div className='flex justify-between py-4 font-bold text-xl text-[#FF9417] px-4'>
                <div className='w-64'>Validator Address</div>
                <div >Voting Power</div>
                <div>Priority</div>
            </div>
            <div className='bg-[#303030] w-full flex items-center justify-between space-x-6'>
                <div className='w-full overflow-x-scroll'>
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