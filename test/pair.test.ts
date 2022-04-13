import {ChainId, Pair, PairType, Price, Token, TokenAmount, WETH} from '../src'

describe('Pair', () => {
  const USDC = new Token(ChainId.MAINNET, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 18, 'USDC', 'USD Coin')
  const DAI = new Token(ChainId.MAINNET, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'DAI Stablecoin')

  const POLYGON_MAINNET_FATE = new Token(ChainId.POLYGON_MAINNET, '0x4853365bC81f8270D902076892e13F27c27e7266', 18, 'FATE', 'FATExFI')
  const POLYGON_MAINNET_USDC = new Token(ChainId.POLYGON_MAINNET, '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', 6, 'USDC', 'USD Coin')

  const HARMONY_MAINNET_WONE = new Token(ChainId.HARMONY_MAINNET, '0xcF664087a5bB0237a0BAd6742852ec6c8d69A27a', 18, 'WONE', 'Wrapped ONE')
  const HARMONY_MAINNET_BUSD = new Token(ChainId.HARMONY_MAINNET, '0xE176EBE47d621b984a73036B9DA5d834411ef734', 18, 'BUSD', 'Binance USD')
  const HARMONY_MAINNET_USDC = new Token(ChainId.HARMONY_MAINNET, '0x985458E523dB3d53125813eD68c274899e9DfAb4', 6, '1USDC', 'USD Coin')
  const HARMONY_MAINNET_UST = new Token(ChainId.HARMONY_MAINNET, '0x224e64ec1BDce3870a6a6c777eDd450454068FEC', 18, 'UST', 'Wrapped UST Token')

  const HARMONY_TESTNET_WONE = new Token(ChainId.HARMONY_TESTNET, '0x7466d7d0C21Fa05F32F5a0Fa27e12bdC06348Ce2', 18, 'WONE', 'Wrapped ONE')
  const HARMONY_TESTNET_BUSD = new Token(ChainId.HARMONY_TESTNET, '0x0E80905676226159cC3FF62B1876C907C91F7395', 18, 'BUSD', 'Binance USD')

  describe('constructor', () => {
    it('cannot be used for tokens on different chains', () => {
      expect(() => new Pair(new TokenAmount(USDC, '100'), new TokenAmount(WETH[ChainId.RINKEBY], '100'))).toThrow(
        'CHAIN_IDS'
      )
    })
  })

  describe('#getAddress', () => {
    it('returns the correct address for Polygon Mainnet', () => {
      expect(Pair.getAddress(POLYGON_MAINNET_FATE, POLYGON_MAINNET_USDC, PairType.FATE)).toEqual('0x69c894Dce6FA2E3b89D3111d29167F0484AC0b2A')
    })
    it('returns the correct address for Harmony Mainnet', () => {
      expect(Pair.getAddress(HARMONY_MAINNET_WONE, HARMONY_MAINNET_BUSD, PairType.FATE)).toEqual('0x125FE08811F40f2fc2ae7A6DAA4b4eCc5daFB88d')
    })
    it('returns the correct address for Harmony Testnet for Viper', () => {
      expect(Pair.getAddress(HARMONY_TESTNET_WONE, HARMONY_TESTNET_BUSD, PairType.VIPER)).toEqual('0x0fd43eB53e9c80eb439dC47da7539d8b6f71DC1E')
    })
    it('returns the correct address for Harmony Mainnet for Viper', () => {
      expect(Pair.getAddress(HARMONY_MAINNET_WONE, HARMONY_MAINNET_USDC, PairType.VIPER)).toEqual('0xF170016d63fb89e1d559e8F87a17BCC8B7CD9c00')
    })
    it('returns the correct address for Harmony Mainnet for Fuzz', () => {
      expect(Pair.getAddress(HARMONY_MAINNET_WONE, HARMONY_MAINNET_UST, PairType.FUZZ_FI)).toEqual('0xe0ABC0253A8654c2d217f931Df2c9616e30A4573')
    })
    it('returns the correct address for Harmony Mainnet for DeFi Kingdom', () => {
      expect(Pair.getAddress(HARMONY_MAINNET_WONE, HARMONY_MAINNET_USDC, PairType.DEFI_KINGDOM)).toEqual('0x66C17f5381d7821385974783BE34c9b31f75Eb78')
    })
    it('returns the correct address for Harmony Testnet for Sushi', () => {
      expect(Pair.getAddress(HARMONY_MAINNET_WONE, HARMONY_MAINNET_USDC, PairType.SUSHI)).toEqual('0xBf255d8c30DbaB84eA42110EA7DC870F01c0013A')
    })
  })

  describe('#token0', () => {
    it('always is the token that sorts before', () => {
      expect(new Pair(new TokenAmount(USDC, '100'), new TokenAmount(DAI, '100')).token0).toEqual(DAI)
      expect(new Pair(new TokenAmount(DAI, '100'), new TokenAmount(USDC, '100')).token0).toEqual(DAI)
    })
  })
  describe('#token1', () => {
    it('always is the token that sorts after', () => {
      expect(new Pair(new TokenAmount(USDC, '100'), new TokenAmount(DAI, '100')).token1).toEqual(USDC)
      expect(new Pair(new TokenAmount(DAI, '100'), new TokenAmount(USDC, '100')).token1).toEqual(USDC)
    })
  })
  describe('#reserve0', () => {
    it('always comes from the token that sorts before', () => {
      expect(new Pair(new TokenAmount(USDC, '100'), new TokenAmount(DAI, '101')).reserve0).toEqual(
        new TokenAmount(DAI, '101')
      )
      expect(new Pair(new TokenAmount(DAI, '101'), new TokenAmount(USDC, '100')).reserve0).toEqual(
        new TokenAmount(DAI, '101')
      )
    })
  })
  describe('#reserve1', () => {
    it('always comes from the token that sorts after', () => {
      expect(new Pair(new TokenAmount(USDC, '100'), new TokenAmount(DAI, '101')).reserve1).toEqual(
        new TokenAmount(USDC, '100')
      )
      expect(new Pair(new TokenAmount(DAI, '101'), new TokenAmount(USDC, '100')).reserve1).toEqual(
        new TokenAmount(USDC, '100')
      )
    })
  })

  describe('#token0Price', () => {
    it('returns price of token0 in terms of token1', () => {
      expect(new Pair(new TokenAmount(USDC, '101'), new TokenAmount(DAI, '100')).token0Price).toEqual(
        new Price(DAI, USDC, '100', '101')
      )
      expect(new Pair(new TokenAmount(DAI, '100'), new TokenAmount(USDC, '101')).token0Price).toEqual(
        new Price(DAI, USDC, '100', '101')
      )
    })
  })

  describe('#token1Price', () => {
    it('returns price of token1 in terms of token0', () => {
      expect(new Pair(new TokenAmount(USDC, '101'), new TokenAmount(DAI, '100')).token1Price).toEqual(
        new Price(USDC, DAI, '101', '100')
      )
      expect(new Pair(new TokenAmount(DAI, '100'), new TokenAmount(USDC, '101')).token1Price).toEqual(
        new Price(USDC, DAI, '101', '100')
      )
    })
  })

  describe('#priceOf', () => {
    const pair = new Pair(new TokenAmount(USDC, '101'), new TokenAmount(DAI, '100'))
    it('returns price of token in terms of other token', () => {
      expect(pair.priceOf(DAI)).toEqual(pair.token0Price)
      expect(pair.priceOf(USDC)).toEqual(pair.token1Price)
    })

    it('throws if invalid token', () => {
      expect(() => pair.priceOf(WETH[ChainId.MAINNET])).toThrow('TOKEN')
    })
  })

  describe('#reserveOf', () => {
    it('returns reserves of the given token', () => {
      expect(new Pair(new TokenAmount(USDC, '100'), new TokenAmount(DAI, '101')).reserveOf(USDC)).toEqual(
        new TokenAmount(USDC, '100')
      )
      expect(new Pair(new TokenAmount(DAI, '101'), new TokenAmount(USDC, '100')).reserveOf(USDC)).toEqual(
        new TokenAmount(USDC, '100')
      )
    })

    it('throws if not in the pair', () => {
      expect(() =>
        new Pair(new TokenAmount(DAI, '101'), new TokenAmount(USDC, '100')).reserveOf(WETH[ChainId.MAINNET])
      ).toThrow('TOKEN')
    })
  })

  describe('#chainId', () => {
    it('returns the token0 chainId', () => {
      expect(new Pair(new TokenAmount(USDC, '100'), new TokenAmount(DAI, '100')).chainId).toEqual(ChainId.MAINNET)
      expect(new Pair(new TokenAmount(DAI, '100'), new TokenAmount(USDC, '100')).chainId).toEqual(ChainId.MAINNET)
    })
  })
  describe('#involvesToken', () => {
    expect(new Pair(new TokenAmount(USDC, '100'), new TokenAmount(DAI, '100')).involvesToken(USDC)).toEqual(true)
    expect(new Pair(new TokenAmount(USDC, '100'), new TokenAmount(DAI, '100')).involvesToken(DAI)).toEqual(true)
    expect(
      new Pair(new TokenAmount(USDC, '100'), new TokenAmount(DAI, '100')).involvesToken(WETH[ChainId.MAINNET])
    ).toEqual(false)
  })
})
