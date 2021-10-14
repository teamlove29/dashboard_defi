import { useState, useEffect } from 'react'
import { getERC20Contract } from './useContract'
import { web3BNToFloatString, ZERO_ADDRESS } from '../utils/checkAddress'
import BigNumber from 'bignumber.js'
import BN from 'bn.js'
import { useWeb3React } from '@web3-react/core'

export default function useBalance(
    tokenAddress: any,
    decimals: any,
) {
    const [balance, setBalance] = useState('0')

    const { account, library } = useWeb3React()



    useEffect(() => {
        let isCancelled = false


        if (library) {
            const pow = new BigNumber('10').pow(new BigNumber(18))
            library.getBalance(account).then((value: string | number | BN | number[] | Uint8Array | Buffer) => {
                console.log(web3BNToFloatString(value, pow, 4, BigNumber.ROUND_DOWN))
            })
        }

        function getBalance() {
            return new Promise((resolve) => {
                if (!library || !tokenAddress) {
                    resolve(new BN('0'))
                    return
                }

                try {
                    if (tokenAddress === ZERO_ADDRESS) {
                        library.eth.getBalance(account)
                            .then((value: string | number | BN | number[] | Uint8Array | Buffer) => {
                                resolve(new BN(value))
                            })
                            .catch((error: any) => {
                                console.log(error)
                                resolve(new BN('0'))
                            })
                    } else {
                        const contract = getERC20Contract(tokenAddress, library)
                        contract?.methods
                            .balanceOf(account)
                            .call()
                            .then((value: string | number | BN | number[] | Uint8Array | Buffer) => {
                                resolve(new BN(value))
                            })
                            .catch((error: any) => {
                                console.log(error)
                                resolve(new BN('0'))
                            })
                    }
                } catch (error) {
                    console.log(error)
                    resolve(new BN('0'))
                }
            })
        }

        async function run() {
            const bn = await getBalance()
            if (!isCancelled) {
                const pow = new BigNumber('10').pow(new BigNumber(decimals))
                setBalance(web3BNToFloatString(bn, pow, 4, BigNumber.ROUND_DOWN))
            }
        }

        run()

        return () => {
            isCancelled = true
        }
    }, [tokenAddress, library, decimals, account])

    return [balance]
}

