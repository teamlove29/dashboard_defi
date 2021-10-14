import ERC20ABI from '../ABI/abi-erc20.json'

export const getERC20Contract = (address: any, web3: any) => {
    return web3 ? new web3.eth.Contract(ERC20ABI, address, {
        from: web3.eth.defaultAccount
    }) : null
}

